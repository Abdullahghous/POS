import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  public isUserAuthenticatedSubject = new BehaviorSubject<boolean>(this.getAccessToken() ? true : false);
  isUserAuthenticated$ = this.isUserAuthenticatedSubject.asObservable();
  loggedInUser = null;

  constructor(private router: Router) {
    if (this.getAccessToken()) {
      this.isUserAuthenticatedSubject.next(true);
    }
  }

  setLoggedInUserInfo(user:any) {
    debugger
    localStorage.setItem('loggedInUser', JSON.stringify(user.user));
  }

  getLoggedInUserInfo() {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }

  userIsAuthenticated() {
    this.isUserAuthenticatedSubject.next(true);
  }

  isAuthenticated(): boolean {
    return this.isUserAuthenticatedSubject.value;
  }

  setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
    this.isUserAuthenticatedSubject.next(true);
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }

  getAccessToken(): string {
    return localStorage.getItem('accessToken') || '';
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken') || '';
  }

  logOutUser() {
    localStorage.clear();
    this.isUserAuthenticatedSubject.next(false);
  }
}
