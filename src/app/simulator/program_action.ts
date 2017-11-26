import { Frame } from './frame';

export class ProgramAction {
  public frame: Frame;
  public action: Action;
  public time: number;

  public constructor(frame: Frame, action: Action, time: number) {
    this.frame = frame;
    this.action = action;
    this.time = time;
  }
}

export enum Action { Error, Destroy }
