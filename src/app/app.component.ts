import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Say anything', url: '/folder/Bam', icon: 'chatbubble' },
    { title: 'See your stuff', url: '/my-stuff', icon: 'apps' },
    { title: 'Profile', url: '/folder/Profile', icon: 'person' },
    { title: 'Sign Out', url: 'signout', icon: 'log-in' },
  ];
  constructor() {}
}
