import { Frame } from './frame';

class TravelingFrame {
  public frame: Frame;
  public time: number;
}

export class Channel {
  private leftRightBuf: TravelingFrame[];
  private rightLeftBuf: TravelingFrame[];
  private readonly travelTime: number;
  private readonly travelStep: number;
  private readonly x_pos: number;
  private readonly y_pos: number;
  private readonly bufferWidth: number;
  private readonly bufferHeight: number;

  public constructor(x_pos: number, y_pos: number) {
    this.leftRightBuf = new Array<TravelingFrame>();
    this.rightLeftBuf = new Array<TravelingFrame>();
    this.travelTime = 300; //Five Seconds
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.bufferWidth = 1180;
    this.bufferHeight = 80;
    this.travelStep = this.bufferWidth / this.travelTime;
  }

  public sendLeftRight(frame: Frame): void {
    let buf = this.leftRightBuf;
    frame.y_pos = this.y_pos + 5;
    frame.x_pos = this.x_pos;
    let movingFrame = new TravelingFrame();
    movingFrame.frame = frame;
    movingFrame.time = 0;
    buf.push(movingFrame);
  }

  public sendRightLeft(frame: Frame): void {
    let buf = this.rightLeftBuf;
    frame.y_pos = this.y_pos + 95;
    frame.x_pos = this.x_pos + this.bufferWidth;
    let movingFrame = new TravelingFrame();
    movingFrame.frame = frame;
    movingFrame.time = 0;
    buf.push(movingFrame);
  }

  public receiveLeftRight(): Frame {
    let buf = this.leftRightBuf;
    if (buf.length > 0 && (buf[0].time > this.travelTime)) {
      let mf = buf.shift();
      return mf.frame;
    }
    return null;
  }

  public receiveRightLeft(): Frame {
    let buf = this.rightLeftBuf;
    if (buf.length > 0 && (buf[0].time > this.travelTime)) {
      let mf = buf.shift();
      return mf.frame;
    }
    return null;
  }

  public updateState(timestep: number): void {
    for (let i = 0; i < this.leftRightBuf.length; i++) {
      this.leftRightBuf[i].time++;
      if (this.leftRightBuf[i].frame.x_pos < this.x_pos + this.bufferWidth) {
        this.leftRightBuf[i].frame.x_pos += this.travelStep;
      }
    }

    for (let i = 0; i < this.rightLeftBuf.length; i++) {
      this.rightLeftBuf[i].time++;
      if (this.rightLeftBuf[i].frame.x_pos > this.x_pos) {
        this.rightLeftBuf[i].frame.x_pos -= this.travelStep;
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    let x = this.x_pos;
    let y = this.y_pos;
    //Draw left to right buffer
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + this.bufferHeight);
    ctx.lineTo(x + this.bufferWidth, y + this.bufferHeight);
    ctx.lineTo(x + this.bufferWidth, y);
    ctx.lineTo(x, y);
    ctx.stroke();

    //Draw frames in left to right buffer
    for (let i of this.leftRightBuf) {
      i.frame.draw(ctx);
    }

    y = y + this.bufferHeight + 10;

    //Draw receiving buffer
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + this.bufferHeight);
    ctx.lineTo(x + this.bufferWidth, y + this.bufferHeight);
    ctx.lineTo(x + this.bufferWidth, y);
    ctx.lineTo(x, y);
    ctx.stroke();

    //Draw frames in right to left buffer
    for (let i of this.rightLeftBuf) {
      i.frame.draw(ctx);
    }
  }
}
