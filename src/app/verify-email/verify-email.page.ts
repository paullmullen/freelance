import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  usersName: string;
  usersEmail: string;
  constructor(
    public authService: AuthenticationService
  ) { }

  ngOnInit() {

  }
  ionViewWillEnter(){
    this.usersName = JSON.parse(localStorage.getItem('user')).displayName;
    this.usersEmail = JSON.parse(localStorage.getItem('user')).email;
  }
}
