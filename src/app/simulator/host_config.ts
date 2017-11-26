import { Frame } from './frame';

export class HostConfig {
  public bufSize: number;
  public maxWindowSize: number;
  public sequenceMod: number;
  public stepsPerSend: number;
  public channelSend: (Frame) => void;
  public channelReceive: () => Frame;

  public constructor(channelSend: (Frame) => void, channelReceive: () => Frame) {
    this.bufSize = 14
    this.maxWindowSize = 5; //Note: maxWindowSize < sequenceMod
    this.sequenceMod = 8;
    this.stepsPerSend = 30;
    this.channelSend = channelSend;
    this.channelReceive = channelReceive;
  }
}
