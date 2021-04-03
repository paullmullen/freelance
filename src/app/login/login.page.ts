import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) {}

  ngOnInit() {}

  logIn(email, password) {
    this.authService
      .SignIn(email.value, password.value)
      .then((res) => {
        console.log('res: ', res);
        console.log('authService: ', this.authService);
        if (this.authService.isEmailVerified) {
          this.router.navigate(['my-stuff']);
        } else {
          window.alert('Something\'s wrong with the login.  Hmmm.');
          return false;
        }
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
}
