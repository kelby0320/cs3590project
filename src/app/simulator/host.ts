import { Frame, FrameType } from './frame';
import { Channel } from './channel';
import { HostConfig } from './host_config';

export class Host {
  private sendingBuffer: Array<Frame>;
  private receivingBuffer: Array<Frame>;
  private lastSendingFrameAck: number;
  private lastSendingFrameTransmitted: number;
  private lastReceivingFrameAck: number;
  private lastReceivingFrameReceived: number;
  private messageLength: number;
  private rrResponse: Frame;
  private readonly config: HostConfig;
  private readonly name: string;

  public constructor(config: HostConfig, name: string) {
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

    //Initialize buffers
    for (let i = 0; i < this.config.bufSize; i++) {
      let f1 = new Frame();
      let f2 = new Frame();
      let seqnum = i % this.config.sequenceMod;

      f1.number = seqnum;
      f1.type = FrameType.FRAME;
      f2.number = seqnum;
      f2.type = FrameType.FRAME;

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
        this.config.channelSend(this.sendingBuffer[i]);
        //console.log(this.name + " - Sent frame: " + this.sendingBuffer[i].data);
      }
    }

    //Send RR rrResponse
    if (this.rrResponse !== null &&
      timestep % this.config.stepsPerSend === 0) {
      this.config.channelSend(this.rrResponse);
      //console.log(this.name + " - Sent RR: " + this.rrResponse.number);
      this.rrResponse = null;
    }

    //Receive Frame
    let r = this.config.channelReceive();
    if (r !== null) {
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
      else if (r.type === FrameType.FRAME) {
        //Received Data Frame
        //console.log(this.name + " - Received Frame: " + r.data);
        let pending = this.lastReceivingFrameReceived - this.lastReceivingFrameAck;
        if (pending < this.config.maxWindowSize) {
          let i = this.lastReceivingFrameReceived + 1;
          let f = this.receivingBuffer[i];

          if (f.number !== r.number) {
            //TODO
            //Frame out of order
          } else {
            //Receive Frame
            this.receivingBuffer[i].data = r.data;
            this.lastReceivingFrameReceived++;

            //Prepare RR Response
            this.lastReceivingFrameAck = this.lastReceivingFrameReceived;

            this.rrResponse = new Frame();
            this.rrResponse.type = FrameType.RR;
            this.rrResponse.number = (this.lastReceivingFrameReceived + 1) % this.config.sequenceMod;
          } //end else
        } //end if
      } //end elseif
    } //end if
  } //end updateState()
} //end class
