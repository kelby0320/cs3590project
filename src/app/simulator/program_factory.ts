import { Frame, FrameType } from './frame';
import { ChannelProgram } from './channel_program';
import { ProgramAction, Action } from './program_action';

export class ProgramFactory {
  public static DefaultProgram(): ChannelProgram {
    let program = new ChannelProgram();
    return program;
  }

  public static DestroyFrameTwo(): ChannelProgram {
    let program = new ChannelProgram();

    let frame = new Frame();
    frame.data = "l";
    frame.number = 2;
    frame.type = FrameType.FRAME;

    let action = new ProgramAction(frame, Action.Destroy, 60);
    program.addProgramAction("leftRight", action);
    return program;
  }

  public static ErrorFrameTwo(): ChannelProgram {
    let program = new ChannelProgram();

    let frame = new Frame();
    frame.data = "l";
    frame.number = 2;
    frame.type = FrameType.FRAME;

    let action = new ProgramAction(frame, Action.Error, 60);
    program.addProgramAction("leftRight", action);
    return program;
  }
}
