import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Summary', url: '/summary', icon: 'clipboard-outline' },
    { title: 'Say anything', url: '/bam', icon: 'chatbubble-outline' },
    { title: 'My stuff', url: '/my-stuff', icon: 'apps-outline' },
    { title: 'This Month\'s Money', url: '/financials', icon: 'logo-usd'},
    { title: 'Archived Stuff', url:'/archived', icon: 'archive-outline'},
    { title: 'Profile', url: '/folder/Profile', icon: 'person-outline' },
    { title: 'Sign Out', url: '/signout', icon: 'log-in-outline' },
  ];
  constructor() {}
}
