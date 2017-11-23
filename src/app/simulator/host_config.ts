import { Frame } from './frame';

export class HostConfig {
  public bufSize: number;
  public maxWindowSize: number;
  public stepsPerSend: number;
  public sequenceMod: number;
  public channelSend: (Frame) => void;
  public channelReceive: () => Frame;

  public constructor(channelSend: (Frame) => void, channelReceive: () => Frame) {
    this.bufSize = 14
    this.maxWindowSize = 7;
    this.stepsPerSend = 30;
    this.sequenceMod = 6;
    this.channelSend = channelSend;
    this.channelReceive = channelReceive;
  }
}
