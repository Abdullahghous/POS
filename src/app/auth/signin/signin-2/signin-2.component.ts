import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { routes } from 'src/app/core/helpers/routes';
import { HttpService } from 'src/app/core/service/http/http.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { environment } from '../../../../environments/environment'
import { AuthServiceService } from 'src/app/core/service/http/auth-service.service';
import { SidebarService } from 'src/app/core/core.index';

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

  public productName = environment.PRODUCT_NAME;
   
  constructor(
    private router: Router,
    private apiService: HttpService,
    private snackBarService: SnackBarService,
    private authService: AuthServiceService,
    private  sidebarService: SidebarService
  ) {}

  public password: boolean[] = [false];
    user:any;
  public togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }

  public login() {
    // debugger
    this.loginBtnText = 'Loading...';
    this.loginBtnDisable = true;

    const loginObj = {
      userName: this.userEmail,
      password: this.userPassword,
      grant_type: 'password',
    };

    this.apiService
      .post('auth/getToken', loginObj)
      .pipe(
        switchMap((loginRes: any) => {
          this.authService.setAccessToken(loginRes.access_token);
          // this.authService.setRefreshToken(loginRes.access_token);
          return    this.apiService.post('auth/getToken', loginObj);
        })
      )
      .subscribe({
        next: (res) => {
          if(loginObj) {
            this.user =res;
            this.authService.setLoggedInUserInfo(res);
            this.authService.userIsAuthenticated();
            this.snackBarService.showSuccess('Login Successfull !');
            this.navigationToVerification();
          }
        },
        error: (err) => {
          this.snackBarService.showError(err.error.message);
          this.loginBtnText = 'Login';
          this.loginBtnDisable = false;
          localStorage.clear();
          sessionStorage.clear();
        },
      });
    // this.apiService.post('user/getToken', loginObj).subscribe({
    //   next: (res) => {
    //     if (res) {
    //       console.log('Login Res::', res);
    //       sessionStorage.setItem('access_token', res.access_token);
    //       JSON.stringify(
    //         sessionStorage.setItem('companyName', res.companyName)
    //       );
    //       this.getLoginUserData(res.companyName);
    //       this.snackBarService.showSuccess('Redirecting to OTP verification !');
    //     } else {
    //       console.log('No auth token found');
    //     }
    //   },
    //   error: (err) => {
        // console.error('Error fetching auth token:', err.error.message);
        // this.snackBarService.showError(err.error.message);
        // this.loginBtnText = 'Login';
        // this.loginBtnDisable = false;
    //   },
    //   complete: () => {
    //     console.log('Auth token fetch complete');
    //     this.navigationToVerification();
    //   },
    // });
  }

  // getLoginUserData(email: string) {
  //   this.apiService.get(`user/get-by-email?email=${email}`).subscribe((res) => {
  //     if (res) {
  //       sessionStorage.setItem('uInfo', JSON.stringify(res));
  //     }
  //   });
  // }

  navigationToVerification() {
    debugger
    // this.sidebarService.sidebarData1=this.user.moduleList;
    this.router.navigate([routes.adminDashboard]);
    // this.router.navigate([routes.twoStepVerification]);
  }
}
