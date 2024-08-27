import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  public password : boolean[] = [false];

  public loginUserData: any;
  public firstname: any;
  public lastname: any;
  public userId: number | undefined;

  formGroup = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private router: Router,
    private apiService: HttpService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.loginUserData = JSON.parse(sessionStorage.getItem('loginUser::')!);
    if(this.loginUserData?.Success) {
      console.log('LOGIN USER DATA::', this.loginUserData);
      this.firstname = this.loginUserData?.Success?.firstName;
      this.lastname = this.loginUserData?.Success?.lastName;
      this.userId = this.loginUserData?.Success?.id;
      this.formGroup.setValue({
        firstName: this.loginUserData?.Success?.firstName,
        lastName: this.loginUserData?.Success?.lastName,
        email: this.loginUserData?.Success?.email,
        phone: '',
        username: '',
        password: null
      })
    }
  }

  updateProfile() {
    this.apiService.post('user/add-or-update', { id: this.userId, profileCompleted: true, ...this.formGroup.value }).subscribe((res: any) => {
      if(res.status == '1') {
        this.snackBarService.showSuccess('Profile updated successfully !');
      }
    })
  }

  public togglePassword(index: number){
    this.password[index] = !this.password[index]
  }
}
