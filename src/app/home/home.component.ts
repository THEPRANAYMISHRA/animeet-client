import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../socket';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private router: Router, private socketService: SocketService) {}

  title = 'appName';
  count = 0;
  images = [
    {
      url: 'https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg',
      caption: 'Get a link that you can share',
    },
    {
      url: 'https://www.gstatic.com/meet/user_edu_scheduling_light_b352efa017e4f8f1ffda43e847820322.svg',
      caption: 'Plan ahead',
    },
    {
      url: 'https://www.gstatic.com/meet/user_edu_safety_light_e04a2bbb449524ef7e49ea36d5f25b65.svg',
      caption: 'Your meeting is safe',
    },
  ];
  roomIdInput: string = '';
  emailIdInput: string = '';

  next() {
    if (this.count >= 0 && this.count < this.images.length - 1) {
      return this.count++;
    } else {
      return (this.count = 0);
    }
  }
  previous() {
    if (this.count > 0 && this.count <= this.images.length - 1) {
      return this.count--;
    } else {
      return (this.count = this.images.length - 1);
    }
  }

  joinMeet() {
    this.socketService.connect();
    this.socketService.joinMeeting(this.roomIdInput, this.emailIdInput);
  }

  startNewMeet() {
    this.socketService.connect();
    this.socketService.createMeeting();
  }
}
