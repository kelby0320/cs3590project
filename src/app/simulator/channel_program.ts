import { ProgramAction, Action} from './program_action'

export class ChannelProgram {
  public name: string;
  private leftRightActions: Array<ProgramAction>;
  private rightLeftActions: Array<ProgramAction>;
  private currentLeftRight: number;
  private currentRightLeft: number;

  public constructor(name: string) {
    this.name = name;
    this.leftRightActions = new Array<ProgramAction>();
    this.rightLeftActions = new Array<ProgramAction>();
    this.currentLeftRight = 0;
    this.currentRightLeft = 0;
  }

  public addProgramAction(buffer: string, programAction: ProgramAction) {
    if (buffer === "leftRight") {
      this.leftRightActions.push(programAction);
    }
    else if (buffer === "rightLeft") {
      this.rightLeftActions.push(programAction);
    }
  }

  public getCurrentProgramAction(buffer: string): ProgramAction {
    if (buffer === "leftRight") {
      if (this.leftRightActions[this.currentLeftRight])
        return this.leftRightActions[this.currentLeftRight];
      return null;
    }
    else if (buffer === "rightLeft") {
      if (this.rightLeftActions[this.currentRightLeft])
        return this.rightLeftActions[this.currentRightLeft];
      return null;
    }
  }

  public completeCurrentProgramAction(buffer: string) {
    if (buffer === "leftRight") {
      this.currentLeftRight++;
    }
    else if (buffer === "rightLeft") {
      this.currentRightLeft++;
    }
  }
}
