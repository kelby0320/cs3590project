import { Frame, FrameType } from './frame';
import { ChannelProgram } from './channel_program';
import { ProgramAction, Action } from './program_action';

class TravelingFrame {
  public frame: Frame;
  public time: number;
}

export class Channel {
  private leftRightBuf: TravelingFrame[];
  private rightLeftBuf: TravelingFrame[];
  private program: ChannelProgram;
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

  public setProgram(program: ChannelProgram) {
    this.program = program;
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
    let leftRightAction = this.program.getCurrentProgramAction("leftRight");

    //Update positions in leftRightBuf
    for (let i = 0; i < this.leftRightBuf.length; i++) {
      this.leftRightBuf[i].time++;
      if (this.leftRightBuf[i].frame.x_pos < this.x_pos + this.bufferWidth) {
        this.leftRightBuf[i].frame.x_pos += this.travelStep;
      }

      if (leftRightAction !== null) {
        let match = this.matchProgramAction(leftRightAction, this.leftRightBuf[i]);
        if (match) {
          if (leftRightAction.action == Action.Error) {
            this.leftRightBuf[i].frame.error = true;
          }
          else if (leftRightAction.action == Action.Destroy) {
            this.leftRightBuf.splice(i, 1);
          }
          this.program.completeCurrentProgramAction("leftRight");
        }
      }
    } //end for

    let rightLeftAction = this.program.getCurrentProgramAction("rightLeft");

    //Update positions in rightLeftBuf
    for (let i = 0; i < this.rightLeftBuf.length; i++) {
      this.rightLeftBuf[i].time++;
      if (this.rightLeftBuf[i].frame.x_pos > this.x_pos) {
        this.rightLeftBuf[i].frame.x_pos -= this.travelStep;
      }

      if (rightLeftAction !== null) {
        let match = this.matchProgramAction(rightLeftAction, this.rightLeftBuf[i]);
        if (match) {
          if (rightLeftAction.action == Action.Error) {
            this.rightLeftBuf[i].frame.error = true;
          }
          else if (rightLeftAction.action == Action.Destroy) {
            this.rightLeftBuf.splice(i, 1);
          }
          this.program.completeCurrentProgramAction("rightLeft");
        }
      }
    } //end for
  } //end updateState

  private matchProgramAction(programAction: ProgramAction, tframe: TravelingFrame) {
    let match = true;
    if (tframe.frame.type === FrameType.FRAME) {
      //Try to match a frame
      if (programAction.frame.data !== tframe.frame.data ||
        programAction.frame.type !== tframe.frame.type ||
        programAction.frame.number !== tframe.frame.number) {
          match = false;
      }
    }
    else if (tframe.frame.type === FrameType.RR) {
      //Try to match an rr
      if (programAction.frame.type !== tframe.frame.type ||
        programAction.frame.number !== tframe.frame.number) {
          match = false;
      }
    }

    if (tframe.time < programAction.time) {
      //match time
      match = false;
    }
    return match;
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
