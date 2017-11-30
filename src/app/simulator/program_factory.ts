import { Frame, FrameType } from './frame';
import { ChannelProgram } from './channel_program';
import { ProgramAction, Action } from './program_action';

export class ProgramFactory {
  public static DefaultProgram(): ChannelProgram {
    let program = new ChannelProgram();
    return program;
  }

  public static DestroySendingFrameTwo(): ChannelProgram {
    let program = new ChannelProgram();

    let frame = new Frame();
    frame.data = "l";
    frame.number = 2;
    frame.type = FrameType.FRAME;

    let action = new ProgramAction(frame, Action.Destroy, 60);
    program.addProgramAction("leftRight", action);
    return program;
  }

  public static ErrorSendingFrameTwo(): ChannelProgram {
    let program = new ChannelProgram();

    let frame = new Frame();
    frame.data = "l";
    frame.number = 2;
    frame.type = FrameType.FRAME;

    let action = new ProgramAction(frame, Action.Error, 60);
    program.addProgramAction("leftRight", action);
    return program;
  }

  public static ErrorSendingRRTwo(): ChannelProgram {
    let program = new ChannelProgram();

    let frame = new Frame();
    frame.number = 2;
    frame.type = FrameType.RR;

    let action = new ProgramAction(frame, Action.Error, 60);
    program.addProgramAction("rightLeft", action);
    return program;
  }

  public static DestroySendingRRTwo(): ChannelProgram {
    let program = new ChannelProgram();

    let frame = new Frame();
    frame.number = 2;
    frame.type = FrameType.RR;

    let action = new ProgramAction(frame, Action.Destroy, 60);
    program.addProgramAction("rightLeft", action);
    return program;
  }

  public static DestroySendingRROneThroughFive(): ChannelProgram {
    let program = new ChannelProgram();

    //Destroy RR1
    let frame1 = new Frame();
    frame1.number = 1;
    frame1.type = FrameType.RR;
    let action1 = new ProgramAction(frame1, Action.Destroy, 60);
    program.addProgramAction("rightLeft", action1);

    //Destroy RR2
    let frame2 = new Frame();
    frame2.number = 2;
    frame2.type = FrameType.RR;
    let action2 = new ProgramAction(frame2, Action.Destroy, 60);
    program.addProgramAction("rightLeft", action2);

    //Destroy RR3
    let frame3 = new Frame();
    frame3.number = 3;
    frame3.type = FrameType.RR;
    let action3 = new ProgramAction(frame3, Action.Destroy, 60);
    program.addProgramAction("rightLeft", action3);

    //Destroy RR4
    let frame4 = new Frame();
    frame4.number = 4;
    frame4.type = FrameType.RR;
    let action4 = new ProgramAction(frame4, Action.Destroy, 60);
    program.addProgramAction("rightLeft", action4);

    //Destroy RR5
    let frame5 = new Frame();
    frame5.number = 5;
    frame5.type = FrameType.RR;
    let action5 = new ProgramAction(frame5, Action.Destroy, 60);
    program.addProgramAction("rightLeft", action5);

    return program;
  }
}
