import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Say anything', url: '/bam', icon: 'chatbubble-outline' },
    { title: 'See your stuff', url: '/my-stuff', icon: 'apps-outline' },
    { title: 'This Month\'s Money', url: '/financials', icon: 'logo-usd'},
    { title: 'Profile', url: '/folder/Profile', icon: 'person-outline' },
    { title: 'Sign Out', url: '/signout', icon: 'log-in-outline' },
  ];
  constructor() {}
}
