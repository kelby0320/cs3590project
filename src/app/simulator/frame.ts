export class Frame {
  public data: any;
  public number: number;
  public type: FrameType;
}

export enum FrameType {FRAME, ACK, REJ, RR}
