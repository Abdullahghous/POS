import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService, routes } from 'src/app/core/core.index';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { AuthServiceService } from 'src/app/core/service/http/auth-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {

  public routes = routes;
  public isCollapsed: boolean = false;
  public loginUserData: any;
  public firstname: any;
  public lastname: any;
  public userId: number | undefined;

  formGroup = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private sidebar: SidebarService, 
    private router: Router,
    private apiService: HttpService,
    private snackBarService: SnackBarService,
    private authService: AuthServiceService
  ) {}

  ngOnInit() {
    const logInUserInfo = this.authService.getLoggedInUserInfo()?.Success;
    if(logInUserInfo) {
      this.firstname = logInUserInfo?.firstName;
      this.lastname = logInUserInfo?.lastName;
      this.userId = logInUserInfo?.id;
      this.formGroup.setValue({
        firstName: logInUserInfo?.firstName,
        lastName: logInUserInfo?.lastName,
        email: logInUserInfo?.email,
        phone: '',
        username: logInUserInfo?.email,
        password: null
      })
    }
  }

  updateProfile() {
    this.apiService.post('user/add-or-update', { id: this.userId, profileCompleted: true, ...this.formGroup.value }).subscribe((res: any) => {
      if(res.status == '1') {
        console.log('user/add-or-update res::', res);
        const localStorageUserData = this.authService.getLoggedInUserInfo()?.Success;
        localStorageUserData.firstName = this.formGroup.value.firstName;
        localStorageUserData.lastName = this.formGroup.value.lastName;
        localStorageUserData.phone = this.formGroup.value.phone;
        localStorageUserData.username = this.formGroup.value.email;
        localStorageUserData.profileCompleted = true;
        // localStorage.setItem('loginUser::', JSON.stringify(localStorageUserData))
        this.authService.setLoggedInUserInfo(localStorageUserData);;
        this.snackBarService.showSuccess('Profile updated successfully !');
      }
    })
  }

  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }

  navigation() {
    this.router.navigate([routes.generalSettings])
  }
}
