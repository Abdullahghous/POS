import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(
    private snackBar: MatSnackBar,
    private message: NzMessageService
  ) { }

  // openSnackBar() {
  //   this._snackBar.open('Cannonball!!', 'Splash', {
      // horizontalPosition: 'center',
      // verticalPosition: 'top',
  //     duration: 3000
  //   });
  // }

  showSuccess(message: string) {
    this.message.create('success', message);
    // this.snackBar.open(message, 'Close', {
    //   horizontalPosition: 'center',
    //   verticalPosition: 'top',
    //   duration: 4000,
    //   panelClass: ['snackbar-success']
    // });
  }

  showError(message: string) {
    this.message.create('error', message);
    // this.snackBar.open(message, 'Close', {
    //   horizontalPosition: 'center',
    //   verticalPosition: 'top',
    //   duration: 4000,
    //   panelClass: ['snackbar-danger']
    // });
  }

  showWarning(message: string) {
    this.message.create('warning', message);
    // this.snackBar.open(message, 'Close', {
    //   horizontalPosition: 'center',
    //   verticalPosition: 'top',
    //   duration: 4000,
    //   panelClass: ['snackbar-danger']
    // });
  }
}
