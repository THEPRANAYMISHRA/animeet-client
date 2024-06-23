import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from '../../socket';
import { Renderer2 } from '@angular/core';
import { WebrtcService } from '../webrtc.service';

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.css'],
})
@Injectable({
  providedIn: 'root',
})
export class MeetComponent implements AfterViewInit {
  constructor(
    private socketService: SocketService,
    private renderer: Renderer2,
    private WebrtcService: WebrtcService
  ) {}

  @ViewChild('localVideo') myLocalVideoElementRef: ElementRef;
  @ViewChild('remoteVideo') myRemoteVideoElementRef: ElementRef;

  async getUserMediaStream() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const myLocalVideoElement = this.myLocalVideoElementRef.nativeElement;
    this.renderer.setProperty(myLocalVideoElement, 'srcObject', stream);
    this.WebrtcService.sendStream(stream);
  }

  ngAfterViewInit(): void {
    this.getUserMediaStream();
    this.socketService.handleNewUserJoined();
    this.socketService.handleIncommingCall();
    this.WebrtcService.peer.addEventListener('track', (e) => {
      const streams = e.streams;
      const remoteVideoElement = this.myRemoteVideoElementRef.nativeElement;
      this.renderer.setProperty(remoteVideoElement, 'srcObject', streams[0]);
    });
  }
}
