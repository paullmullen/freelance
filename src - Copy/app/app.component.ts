import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Say anything', url: '/folder/Bam', icon: 'chatbubble' },
    // { title: 'Talk with me', url: '/chatbot', icon: 'chatbubble' },
    { title: 'See your stuff', url: '/my-stuff', icon: 'apps' },
    { title: 'Profile', url: '/folder/Profile', icon: 'person' },
    { title: 'SignIn/SignUp', url: '/folder/SignIn', icon: 'log-in' },
    // { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
//  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
