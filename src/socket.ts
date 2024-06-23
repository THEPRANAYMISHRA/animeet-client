import { Injectable, Input, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';
import { Peer } from 'peerjs';
import { WebrtcService } from './app/webrtc.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: any;

  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private WebrtcService: WebrtcService
  ) {
    this.socket = io('http://localhost:4500', {
      autoConnect: false,
    });
  }

  @Input() roomId: String = '';

  connect() {
    this.socket.connect();
  }

  generateUniqueRoomId() {
    return Math.random().toString(36).substring(2, 13);
  }

  createMeeting() {
    const roomId = this.generateUniqueRoomId();
    const peer = new Peer();
    peer.on('open', (id) => {
      console.log('everything is send to server');
      this.socket.emit('create-meeting', { roomId: roomId, peerId: peer.id });
    });

    peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const videoElement: HTMLVideoElement = this.localVideo.nativeElement;
          videoElement.srcObject = stream;
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            console.log('Got this on call');
            console.log(remoteStream);
            const videoElement: HTMLVideoElement =
              this.remoteVideo.nativeElement;
            videoElement.srcObject = remoteStream;
          });
        })
        .catch((err) => {
          console.error('Failed to get local stream', err);
        });
    });

    peer.on('connection', (conn) => {
      console.log('Someone connected to me!');
      conn.on('data', (data: MediaStream) => {
        const videoElement: HTMLVideoElement = this.localVideo.nativeElement;
        videoElement.srcObject = data;
      });
    });

    this.socket.on('meeting-created', (receivedRoomId: string) => {
      if (roomId === receivedRoomId) {
        this.router.navigate(['/meet', roomId]);
        return console.log('Meeting room created successfully!');
      } else {
        console.error('Room ID mismatch!');
      }
    });
  }

  joinMeeting(roomIdInput: string, email: string) {
    const peer = new Peer();
    this.socket.emit('join-meeting', { email: email, roomId: roomIdInput });
    this.socket.on('joined-meeting', (roomId: string) => {
      console.log(`joined room ${roomId}`);
      this.router.navigate(['/meet', roomId]);
    });

    this.socket.on('meeting-not-joined', () => {
      console.log("This meeting doesn't exist or it has already been joined.");
    });
  }

  handleNewUserJoined() {
    this.socket.on('new-user-joined', async (email) => {
      console.log(email, ' Joined this room');
      const offer = await this.WebrtcService.createOffer();
      this.socket.emit('call-user', { email, offer });
    });
  }

  handleIncommingCall() {
    this.socket.on('incoming-call', async ({ from, offer }) => {
      const ans = await this.WebrtcService.createAnswer(offer);
      this.socket.emit('call-accepted', { email: from, answer: ans });
    });

    this.socket.on('call-accepted', async ({ answer }) => {
      console.log('call accepted ', answer);
      await this.WebrtcService.setRemoteAns(answer);
    });
  }

  roomCreated() {
    this.socket.on('meeting-created', (roomId: string) => {
      alert('Meeting room created successfully!');
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
