import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes';
import { HttpService } from 'src/app/core/service/http/http.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-signin-2',
  templateUrl: './signin-2.component.html',
  styleUrl: './signin-2.component.scss',
})
export class Signin2Component {
  public routes = routes;
  public userEmail: string | undefined;
  public userPassword: string | undefined;
  public loginBtnText: string = 'Login';
  public loginBtnDisable: boolean = false;

  constructor(
    private router: Router, 
    private apiService: HttpService,
    private snackBarService: SnackBarService
  ) {}

  public password: boolean[] = [false];

  public togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }

  public login() {

    this.loginBtnText = 'Loading...';
    this.loginBtnDisable = true;

    const loginObj = {
      userName: this.userEmail,
      password: this.userPassword,
      grant_type: 'password',
    };

    this.apiService.post('getToken', loginObj).subscribe({
      next: (res) => {
          if (res) {
              console.log('Login Res::', res);
              sessionStorage.setItem('access_token', res.access_token);
              JSON.stringify(sessionStorage.setItem('user', res.user));
              this.snackBarService.showSuccess('Redirecting to OTP verification !');
          } else {
              console.log('No auth token found');
          }
      },
      error: (err) => {
          console.error('Error fetching auth token:', err.error.message);
          this.snackBarService.showError(err.error.message);
          this.loginBtnText = 'Login';
          this.loginBtnDisable = false;
      },
      complete: () => {
          console.log('Auth token fetch complete');
          this.navigationToVerification();
      }
  });
  }

  navigationToVerification() {
    // this.router.navigate([routes.adminDashboard]);
    this.router.navigate([routes.twoStepVerification]);
  }
}
