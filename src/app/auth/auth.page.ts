import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then((loadingEl) => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(
          (resData) => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/folder/Bam');
          },
          (errRes) => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up as a new user. ';
            if (code === 'EMAIL_EXISTS') {
              message =
                "Hey, we've met before.  That email is already in use.  Try logging in.";
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = "Are you new here?  I didn't find that email.";
            } else if (code === 'INVALID_PASSWORD') {
              message =
                "OK, shall we try again?  That was'nt the right password.";
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Problem with login',
        message: message,
        buttons: ['OK'],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
