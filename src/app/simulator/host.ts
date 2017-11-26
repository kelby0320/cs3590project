import { Frame, FrameType } from './frame';
import { Channel } from './channel';
import { HostConfig } from './host_config';
import { FillStyle } from './fill_style';

export class Host {
  private sendingBuffer: Array<Frame>;
  private receivingBuffer: Array<Frame>;
  private lastSendingFrameAck: number;
  private lastSendingFrameTransmitted: number;
  private lastReceivingFrameAck: number;
  private lastReceivingFrameReceived: number;
  private messageLength: number;
  private rrResponse: Frame;
  private rrResponseIdx: number;
  private rejected: boolean;
  private readonly config: HostConfig;
  private readonly name: string;
  private readonly x_pos: number;
  private readonly y_pos: number;
  private readonly bufferWidth: number;
  private readonly bufferHeight: number;
  private readonly horizontalGap: number;
  private readonly verticalGap: number;

  public constructor(config: HostConfig, name: string, x_pos: number, y_pos: number) {
    this.config = config;
    this.name = name;
    this.sendingBuffer = new Array<Frame>(config.bufSize);
    this.receivingBuffer = new Array<Frame>(config.bufSize);
    this.lastSendingFrameAck = -1;
    this.lastSendingFrameTransmitted = -1;
    this.lastReceivingFrameAck = -1;
    this.lastReceivingFrameReceived = -1;
    this.messageLength = 0;
    this.rrResponse = null;
    this.rrResponseIdx = null;
    this.rejected = false;
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.bufferWidth = 400;
    this.bufferHeight = 80;
    this.horizontalGap = 5;
    this.verticalGap = 5;

    let hzgap = this.horizontalGap;
    let vtgap = this.verticalGap;

    //Initialize buffers
    for (let i = 0; i < this.config.bufSize; i++) {
      let f1 = new Frame();
      let f2 = new Frame();
      let seqnum = i % this.config.sequenceMod;

      f1.number = seqnum;
      f1.type = FrameType.FRAME;
      f1.x_pos = this.x_pos + ((i + 1) * hzgap) + (i * Frame.width);
      f1.y_pos = this.y_pos + vtgap;

      f2.number = seqnum;
      f2.type = FrameType.FRAME;
      f2.x_pos = this.x_pos + ((i + 1) * hzgap) + (i * Frame.width);
      f2.y_pos = this.y_pos + 3 * this.bufferHeight + 30 + vtgap;

      this.sendingBuffer[i] = f1;
      this.receivingBuffer[i] = f2;
    }
  }

  public setSendMessage(message: Array<any>){
    //Convert message to frames and copy to messageBuffer
    for (let i = 0; i < message.length; i++) {
      this.sendingBuffer[i].data = message[i];
    }

    this.messageLength = message.length;
  }

  public getSendingBuffer(): Array<any> {
    let sendingData = new Array<any>(this.sendingBuffer.length);

    for (let i = 0; i < this.sendingBuffer.length; i++) {
      sendingData[i] = this.sendingBuffer[i].data;
    }

    return sendingData;
  }

  public getReceivingBuffer(): Array<any> {
    let recievingData = new Array<any>(this.receivingBuffer.length);

    for (let i = 0; i < this.receivingBuffer.length; i++) {
      recievingData[i] = this.receivingBuffer[i].data;
    }

    return recievingData;
  }

  public updateState(timestep: number): void {
    //Send Frame
    if (this.lastSendingFrameTransmitted < this.messageLength - 1 &&
      timestep % this.config.stepsPerSend === 0) {
      //There are frames to be transmitted
      let pending = this.lastSendingFrameTransmitted - this.lastSendingFrameAck;
      if (pending < this.config.maxWindowSize) {
        //Sliding window is open, send one frame
        this.lastSendingFrameTransmitted++;
        let i = this.lastSendingFrameTransmitted;
        this.config.channelSend(this.sendingBuffer[i].clone());
        //console.log(this.name + " - Sent frame: " + this.sendingBuffer[i].data);
      }
    }

    //Send RR rrResponse
    if (this.rrResponse !== null &&
      timestep % this.config.stepsPerSend === 0) {
      this.lastReceivingFrameAck = this.rrResponseIdx;
      this.config.channelSend(this.rrResponse);
      //console.log(this.name + " - Sent RR: " + this.rrResponse.number);
      this.rrResponse = null;
    }

    //Receive Frame
    let r = this.config.channelReceive();
    if (r !== null && r.error !== true) {
      if (r.type === FrameType.RR) {
        //console.log(this.name + " - Recieved RR: " + r.number);
        //Received RR Frame
        let acked = (r.number - 1) % this.config.sequenceMod;
        let newSendingFrameAck = 0;

        //Find new LastFrameAck
        for (let i = this.lastSendingFrameAck + 1; i < this.sendingBuffer.length; i++) {
          if (this.sendingBuffer[i].number == acked) {
            newSendingFrameAck = i;
            break;
          }
        }

        this.lastSendingFrameAck = newSendingFrameAck;
      }
      else if (r.type === FrameType.REJ) {
        //Reset lastSendingFrameTransmitted to REJ.number - 1
        for (let i = this.lastSendingFrameAck + 1; i < this.sendingBuffer.length; i++) {
          if (this.sendingBuffer[i].number === r.number) {
            this.lastSendingFrameTransmitted = i - 1;
            break;
          }
        }
      }
      else if (r.type === FrameType.FRAME) {
        //Received Data Frame
        //console.log(this.name + " - Received Frame: " + r.data);
        let pending = this.lastReceivingFrameReceived - this.lastReceivingFrameAck;
        if (pending < this.config.maxWindowSize) {
          let i = this.lastReceivingFrameReceived + 1;
          let f = this.receivingBuffer[i];

          //Frame out of order
          if (f.number !== r.number) {
            //Send reject or discard frames
            if (this.rejected === false) {
              this.rejected = true;
              let rej = new Frame();
              rej.type = FrameType.REJ;
              rej.number = f.number;
              this.config.channelSend(rej);
            }
          } else {
            //Receive Frame
            this.rejected = false;
            this.receivingBuffer[i].data = r.data;
            this.lastReceivingFrameReceived++;

            //Prepare RR Response
            this.rrResponse = new Frame();
            this.rrResponse.type = FrameType.RR;
            this.rrResponse.number = (this.lastReceivingFrameReceived + 1) % this.config.sequenceMod;
            this.rrResponseIdx = this.lastReceivingFrameReceived + 1;
          } //end else
        } //end if
      } //end elseif
    } //end if
  } //end updateState()

  public draw(ctx: CanvasRenderingContext2D) {
    let x = this.x_pos;
    let y = this.y_pos;
    //Draw sending buffer
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + this.bufferHeight);
    ctx.lineTo(x + this.bufferWidth, y + this.bufferHeight);
    ctx.lineTo(x + this.bufferWidth, y);
    ctx.lineTo(x, y);
    ctx.stroke();

    //Draw Sliding window
    let start_x = x + (this.lastSendingFrameTransmitted + 1) * Frame.width
      + (this.lastSendingFrameTransmitted + 1) * this.horizontalGap;
    let end_x = x + (this.lastSendingFrameAck + this.config.maxWindowSize + 1) * Frame.width
      + (this.lastSendingFrameAck + this.config.maxWindowSize + 2) * this.horizontalGap;
    if (end_x > x + this.bufferWidth) end_x = x + this.bufferWidth;

    ctx.beginPath()
    ctx.moveTo(start_x, y);
    ctx.lineTo(start_x, y + this.bufferHeight);
    ctx.lineTo(end_x, y + this.bufferHeight);
    ctx.lineTo(end_x, y);
    ctx.lineTo(start_x, y);
    ctx.fillStyle = FillStyle.SlidingWindow;
    ctx.fill();
    ctx.fillStyle = FillStyle.Default;

    y = y + 3 * this.bufferHeight + 30;

    //Draw receiving buffer
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + this.bufferHeight);
    ctx.lineTo(x + this.bufferWidth, y + this.bufferHeight);
    ctx.lineTo(x + this.bufferWidth, y);
    ctx.lineTo(x, y);
    ctx.stroke();

    //Draw Sliding window
    start_x = x + (this.lastReceivingFrameReceived + 1) * Frame.width
      + (this.lastReceivingFrameReceived + 1) * this.horizontalGap;
    end_x = x + (this.lastReceivingFrameAck + this.config.maxWindowSize + 1) * Frame.width
      + (this.lastReceivingFrameAck + this.config.maxWindowSize + 2) * this.horizontalGap;
    if (end_x > x + this.bufferWidth) end_x = x + this.bufferWidth;

    ctx.beginPath()
    ctx.moveTo(start_x, y);
    ctx.lineTo(start_x, y + this.bufferHeight);
    ctx.lineTo(end_x, y + this.bufferHeight);
    ctx.lineTo(end_x, y);
    ctx.lineTo(start_x, y);
    ctx.fillStyle = FillStyle.SlidingWindow;
    ctx.fill();
    ctx.fillStyle = FillStyle.Default;

    //Draw frames in sending buffer
    for (let i of this.sendingBuffer) {
      i.draw(ctx);
    }

    //Draw frames in receiving buffer
    for (let i of this.receivingBuffer) {
      i.draw(ctx);
    }
  }
} //end class
