import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService, routes } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-register-2',
  templateUrl: './register-2.component.html',
  styleUrl: './register-2.component.scss',
})
export class Register2Component {
  public routes = routes;
  public password: boolean[] = [false];
  public productName = environment.PRODUCT_NAME;
  public email: string | undefined;
  public user_password: string | undefined;
  public user_con_password: string | undefined;
  public loginBtnText: string = 'Create Account';
  public loginBtnDisable: boolean = false;

  public togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }
  constructor(
    private router: Router,
    private apiService: HttpService,
    private snackBarService: SnackBarService
  ) {}

  public createAccount() {
    this.loginBtnText = 'Loading...';
    this.loginBtnDisable = true;

    const createAccObj = {
      email: this.email,
      password: this.user_con_password,
    };

    debugger
    if (
      this.email == '' ||
      this.user_password == '' ||
      this.user_con_password == ''
    ) {
      this.snackBarService.showError('Please fill required fields !');
      this.loginBtnText = 'Create Account';
    } else if (this.user_password !== this.user_con_password) {
      this.snackBarService.showError(
        'Password & Confirm Password should be same !'
      );
      this.loginBtnText = 'Create Account';
    } else {
      this.apiService.post('user/add-or-update', createAccObj).subscribe({
        next: (res) => {
          if (res) {
            console.log('Create Acc Res::', res);
            // sessionStorage.setItem('access_token', res.access_token);
            // JSON.stringify(sessionStorage.setItem('user', res.user));
            this.snackBarService.showSuccess('Account created successfully !');
          } else {
            console.log('No auth token found');
          }
        },
        error: (err) => {
          console.error('Error fetching auth token:', err.error.message);
          this.snackBarService.showError(err.error.message);
          this.loginBtnText = 'Create Account';
          this.loginBtnDisable = false;
        },
        complete: () => {
          console.log('Create Acc Complete');
          this.navigationToLoginAfterAccountCreation();
        },
      });
    }
  }

  navigationToLoginAfterAccountCreation() {
    this.router.navigate([routes.login]);
  }
}
