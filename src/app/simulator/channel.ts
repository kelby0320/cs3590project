import { Frame } from './frame';

export class MovingFrame {
  public frame: Frame;
  public time: number;
}

export class Channel {
  private leftRightBuf: MovingFrame[];
  private rightLeftBuf: MovingFrame[];
  private readonly travelTime: number;

  public constructor() {
    this.leftRightBuf = new Array<MovingFrame>();
    this.rightLeftBuf = new Array<MovingFrame>();
    this.travelTime = 30; //Half second
  }

  public sendLeftRight(frame: Frame): void {
    let buf = this.leftRightBuf;
    let movingFrame = new MovingFrame();
    movingFrame.frame = frame;
    movingFrame.time = 0;
    buf.push(movingFrame);
  }

  public sendRightLeft(frame: Frame): void {
    let buf = this.rightLeftBuf;
    let movingFrame = new MovingFrame();
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
    }

    for (let i = 0; i < this.rightLeftBuf.length; i++) {
      this.rightLeftBuf[i].time++;
    }
  }
}
