import { AuthenticationService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.page.html',
  styleUrls: ['./signout.page.scss'],
})
export class SignoutPage implements OnInit {

  constructor(private authService: AuthenticationService) { }

  signOut() {
    this.authService.SignOut();
  }

  ngOnInit() {
  }

}
