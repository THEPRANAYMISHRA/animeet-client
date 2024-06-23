import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebrtcService {
  constructor() {}

  // peer = new RTCPeerConnection({
  //   iceServers: [
  //     {
  //       urls: [
  //         'stun:stun.l.google.com:19302',
  //         'stun:global.stun.twilio.com:3478',
  //       ],
  //     },
  //   ],
  // });
  peer = new RTCPeerConnection();

  async createOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(offer) {
    await this.peer.setRemoteDescription(offer);
    const answer = await this.peer.createAnswer(offer);
    await this.peer.setLocalDescription(answer);
    return answer;
  }

  async setRemoteAns(ans) {
    await this.peer.setRemoteDescription(ans);
  }

  async sendStream(mystream: MediaStream) {
    const tracks = mystream.getTracks();
    for (let track of tracks) {
      this.peer.addTrack(track, mystream);
    }
  }
}
