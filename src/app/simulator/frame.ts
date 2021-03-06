import { FillStyle } from './fill_style'

export class Frame {
  public data: any;
  public number: number;
  public type: FrameType;
  public error: boolean;
  public p: boolean;
  public x_pos: number;
  public y_pos: number;
  public static readonly width: number = 23;
  public static readonly height: number = 50;

  public constructor() {
    this.error = false;
    this.p = false;
  }

  public clone(): Frame {
    let f = new Frame();
    f.data = this.data;
    f.number = this.number;
    f.type = this.type;
    f.error = this.error;
    f.p = this.p
    f.x_pos = this.x_pos;
    f.y_pos = this.y_pos;
    return f;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    let header = FrameTypeToString(this.type);
    if (header === "Frame")
      header = (this.data) ? this.data : "";

    let filltext = (this.p) ? "P" : String(this.number);
    ctx.font = "12px serif";
    ctx.fillText(header, this.x_pos + 5, this.y_pos + 15);
    ctx.fillText(filltext, this.x_pos + 5, this.y_pos + Frame.height - 5);

    ctx.moveTo(this.x_pos, this.y_pos);
    ctx.lineTo(this.x_pos, this.y_pos + Frame.height);
    ctx.lineTo(this.x_pos + Frame.width, this.y_pos + Frame.height);
    ctx.lineTo(this.x_pos + Frame.width, this.y_pos);
    ctx.lineTo(this.x_pos, this.y_pos);

    if (this.error)
      ctx.fillStyle = FillStyle.FrameErr;
    else
      ctx.fillStyle = FillStyle.FrameOK;

    ctx.fill();
    ctx.fillStyle = FillStyle.Default;
  }
}

export enum FrameType {FRAME, REJ, RR}

function FrameTypeToString(type: FrameType): string {
  let str = "";
  if (type === FrameType.FRAME)
    str = "Frame";
  else if (type === FrameType.RR)
    str = "RR";
  else if (type === FrameType.REJ)
    str = "REJ";
  return str;
}
