import { Frame, FrameType } from './frame';
import { ChannelProgram } from './channel_program';
import { ProgramAction, Action } from './program_action';

export class ProgramFactory {
  public static DefaultProgram(): ChannelProgram {
    let program = new ChannelProgram("No Errors");
    return program;
  }

  public static DestroyFrameTwo(): ChannelProgram {
    let program = new ChannelProgram("Destroy Frame 2");

    let frame = new Frame();
    frame.data = "l";
    frame.number = 2;
    frame.type = FrameType.FRAME;

    let action = new ProgramAction(frame, Action.Destroy, 60);
    program.addProgramAction("leftRight", action);
    return program;
  }

  public static ErrorFrameTwo(): ChannelProgram {
    let program = new ChannelProgram("Error on Frame 2");

    let frame = new Frame();
    frame.data = "l";
    frame.number = 2;
    frame.type = FrameType.FRAME;

    let action = new ProgramAction(frame, Action.Error, 60);
    program.addProgramAction("leftRight", action);
    return program;
  }

  public static ErrorRRTwo(): ChannelProgram {
    let program = new ChannelProgram("Error on RR 2");

    let frame = new Frame();
    frame.number = 2;
    frame.type = FrameType.RR;

    let action = new ProgramAction(frame, Action.Error, 60);
    program.addProgramAction("rightLeft", action);
    return program;
  }

  public static DestroyRRTwo(): ChannelProgram {
    let program = new ChannelProgram("Destroy RR 2");

    let frame = new Frame();
    frame.number = 2;
    frame.type = FrameType.RR;

    let action = new ProgramAction(frame, Action.Destroy, 60);
    program.addProgramAction("rightLeft", action);
    return program;
  }

  public static DestroyRROneThroughFive(): ChannelProgram {
    let program = new ChannelProgram("Destroy RRs 1 - 5");

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

  public static ErrorRROneThroughFive(): ChannelProgram {
    let program = new ChannelProgram("Error RRs 1 - 5");

    //Error RR1
    let frame1 = new Frame();
    frame1.number = 1;
    frame1.type = FrameType.RR;
    let action1 = new ProgramAction(frame1, Action.Error, 60);
    program.addProgramAction("rightLeft", action1);

    //Error RR2
    let frame2 = new Frame();
    frame2.number = 2;
    frame2.type = FrameType.RR;
    let action2 = new ProgramAction(frame2, Action.Error, 60);
    program.addProgramAction("rightLeft", action2);

    //Error RR3
    let frame3 = new Frame();
    frame3.number = 3;
    frame3.type = FrameType.RR;
    let action3 = new ProgramAction(frame3, Action.Error, 60);
    program.addProgramAction("rightLeft", action3);

    //Error RR4
    let frame4 = new Frame();
    frame4.number = 4;
    frame4.type = FrameType.RR;
    let action4 = new ProgramAction(frame4, Action.Error, 60);
    program.addProgramAction("rightLeft", action4);

    //Error RR5
    let frame5 = new Frame();
    frame5.number = 5;
    frame5.type = FrameType.RR;
    let action5 = new ProgramAction(frame5, Action.Error, 60);
    program.addProgramAction("rightLeft", action5);

    return program;
  }

  public static DestroyREJTwo(): ChannelProgram {
    let program = new ChannelProgram("Destroy REJ 2");

    //Error sending frame 2
    let frame1 = new Frame();
    frame1.data = "l";
    frame1.number = 2;
    frame1.type = FrameType.FRAME;

    let action1 = new ProgramAction(frame1, Action.Error, 60);
    program.addProgramAction("leftRight", action1);

    //Destroy REJ 2
    let frame2 = new Frame();
    frame2.number = 2;
    frame2.type = FrameType.REJ;

    let action2 = new ProgramAction(frame2, Action.Destroy, 60);
    program.addProgramAction("rightLeft", action2);
    return program;
  }

  public static ErrorREJTwo(): ChannelProgram {
    let program = new ChannelProgram("Error REJ 2");

    //Error sending frame 2
    let frame1 = new Frame();
    frame1.data = "l";
    frame1.number = 2;
    frame1.type = FrameType.FRAME;

    let action1 = new ProgramAction(frame1, Action.Error, 60);
    program.addProgramAction("leftRight", action1);

    //Destroy REJ 2
    let frame2 = new Frame();
    frame2.number = 2;
    frame2.type = FrameType.REJ;

    let action2 = new ProgramAction(frame2, Action.Error, 60);
    program.addProgramAction("rightLeft", action2);
    return program;
  }
}
