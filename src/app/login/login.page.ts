import { NgForm } from '@angular/forms';
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

  logIn(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.authService
      .SignIn(form.value.email, form.value.password)
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
