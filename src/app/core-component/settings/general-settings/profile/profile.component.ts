import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService, routes } from 'src/app/core/core.index';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

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
    this.apiService.post('user/add-or-update', { id: this.userId, profileCompleted: true, ...this.formGroup.value }).subscribe((res) => {
      if(res.status == '1') {
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
