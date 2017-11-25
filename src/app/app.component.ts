import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Host }  from './simulator/host';
import { HostConfig }  from './simulator/host_config';
import { Channel } from './simulator/channel';
import { Frame } from './simulator/frame';

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
  @ViewChild('sim_canvas') canvasRef: ElementRef;

  public constructor() {
    this.title = "sim";
    this.timestamp = 0;

    this.channel = new Channel(10, 100);

    let host1_config = new HostConfig((f: Frame) => this.channel.sendLeftRight(f), () => this.channel.receiveRightLeft());
    let host2_config = new HostConfig((f: Frame) => this.channel.sendRightLeft(f), () => this.channel.receiveLeftRight());

    this.host1 = new Host(host1_config, "Host1", 10, 10);
    this.host2 = new Host(host2_config, "Host2", 790, 10);

    let msg = ['H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd'];
    this.host1.setSendMessage(msg);
  }

  public ngOnInit() {
    let canvas = this.canvasRef.nativeElement;
    let ctx = canvas.getContext('2d');

    this.host1.draw(ctx);
    this.host2.draw(ctx);
    this.channel.draw(ctx);
  }

  public debug() {
    for (let i = 0; i < 480; i++) {
      this.channel.updateState(this.timestamp);
      this.host1.updateState(this.timestamp);
      this.host2.updateState(this.timestamp);
      this.timestamp++;
    }

    let h2recbuf = this.host2.getReceivingBuffer();
    let outputString = "";
    for (let i of h2recbuf) {
      if (i) {
        outputString = outputString + i;
      }
    }
    console.log(outputString);
  }

  private updateState() {
    this.channel.updateState(this.timestamp);
    this.host1.updateState(this.timestamp);
    this.host2.updateState(this.timestamp);
    this.timestamp++;

    let canvas = this.canvasRef.nativeElement;
    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 1200, 380); // clear canvas
    this.host1.draw(ctx);
    this.host2.draw(ctx);
    this.channel.draw(ctx);

    window.requestAnimationFrame(() => this.updateState());
  }

  public startSim() {
    window.requestAnimationFrame(() => this.updateState());
  }
}
