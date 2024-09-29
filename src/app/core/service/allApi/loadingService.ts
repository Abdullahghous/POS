import {Injectable, OnInit} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService  {
  private isLoadingSubject: Subject<boolean> = new Subject<boolean>();
  isLoading$ = this.isLoadingSubject.asObservable();


   public constructor() { }

  show() {

   // console.log(this.isLoading$,"===============================");
    this.isLoadingSubject.next(true);
   // console.log(this.isLoading$,"===========end============");
  }

  hide() {
    this.isLoadingSubject.next(false);
  }
}