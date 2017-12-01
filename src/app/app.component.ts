import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Host }  from './simulator/host';
import { HostConfig }  from './simulator/host_config';
import { Channel } from './simulator/channel';
import { Frame } from './simulator/frame';
import { ChannelProgram } from './simulator/channel_program'
import { ProgramFactory } from './simulator/program_factory';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string;
  public host1: Host;
  public host2: Host;
  public channel: Channel;
  public timestamp: number;
  public animationFrameRef: any;
  public programs: Array<ChannelProgram>;
  public selectedProgram: number;
  @ViewChild('sim_canvas') canvasRef: ElementRef;

  public constructor() {
    this.title = "sim";
    this.timestamp = 0;
    this.programs = this.makePrograms();
    this.selectedProgram = 0;

    this.reset();
  }

  public ngOnInit() {
    let canvas = this.canvasRef.nativeElement;
    let ctx = canvas.getContext('2d');
    this.draw(ctx);
  }

  private updateState() {
    this.channel.updateState(this.timestamp);
    this.host1.updateState(this.timestamp);
    this.host2.updateState(this.timestamp);
    this.timestamp++;

    let canvas = this.canvasRef.nativeElement;
    let ctx = canvas.getContext('2d');
    this.draw(ctx);

    this.animationFrameRef = window.requestAnimationFrame(() => this.updateState());
  }

  public startSim() {
    this.animationFrameRef = window.requestAnimationFrame(() => this.updateState());
  }

  public stopSim() {
    window.cancelAnimationFrame(this.animationFrameRef);
  }

  public resetSim() {
    window.cancelAnimationFrame(this.animationFrameRef);
    this.reset();
    this.timestamp = 0;
    let canvas = this.canvasRef.nativeElement;
    let ctx = canvas.getContext('2d');
    this.draw(ctx);
  }

  private reset() {
    this.programs = this.makePrograms();
    this.channel = new Channel(10, 90);
    this.channel.setProgram(this.programs[this.selectedProgram]);

    let host1_config = new HostConfig((f: Frame) => this.channel.sendLeftRight(f), () => this.channel.receiveRightLeft());
    let host2_config = new HostConfig((f: Frame) => this.channel.sendRightLeft(f), () => this.channel.receiveLeftRight());

    this.host1 = new Host(host1_config, "Host1", 10, 10);
    this.host2 = new Host(host2_config, "Host2", 790, 10);

    let msg = ['H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd'];
    this.host1.setSendMessage(msg);
  }

  private makePrograms(): Array<ChannelProgram> {
    let programs = new Array<ChannelProgram>();
    programs.push(ProgramFactory.DefaultProgram());
    programs.push(ProgramFactory.ErrorFrameTwo());
    programs.push(ProgramFactory.DestroyFrameTwo());
    programs.push(ProgramFactory.ErrorRRTwo());
    programs.push(ProgramFactory.DestroyRRTwo());
    programs.push(ProgramFactory.DestroyRROneThroughFive());
    programs.push(ProgramFactory.ErrorRROneThroughFive());
    programs.push(ProgramFactory.DestroyREJTwo());
    programs.push(ProgramFactory.ErrorREJTwo());
    return programs;
  }

  private draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, 1200, 380); // clear canvas
    this.host1.draw(ctx);
    this.host2.draw(ctx);
    this.channel.draw(ctx);
  }
}
