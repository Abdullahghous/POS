import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { HttpService } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { AddEditSubCategoryModalComponent } from '../../category/add-edit-sub-category-modal/add-edit-sub-category-modal.component';

@Component({
  selector: 'app-add-edit-brand-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, NzCheckboxModule, MatSelectModule],
  templateUrl: './add-edit-brand-modal.component.html',
  styleUrl: './add-edit-brand-modal.component.scss'
})
export class AddEditBrandModalComponent {

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  parentCategoryList: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddEditBrandModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiService: HttpService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    if (this.data?.isEdit) {
      console.log('Edit Data', this.data);
      this.formGroup.setValue({
        name: this.data.values.name ? this.data.values.name : '',
      });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  addDetails() {
    console.log('ADD DETAILS::');

    if (this.formGroup.valid) {
      this.apiService
        .post('brand/add_or_update', {
          name: this.formGroup.value.name,
        })
        .subscribe({
          next: (value) => {
            this.snackBarService.showSuccess('Brand Added Successfuly !');
            this.dialogRef.close('created');
          },
          error: (err) => {
            this.snackBarService.showError(err.error.error);
            // this.dialogRef.close('created');
          },
          complete: () => {},
        });
    } else {
      this.snackBarService.showError('Please fill the fields !');
    }
  }

  updateDetails() {
    console.log('UPDATE DETAILS::');
    if (this.formGroup.valid) {
      this.apiService
        .post('brand/add_or_update', {
          name: this.formGroup.value.name,
          id: this.data.values.id ? this.data.values.id : null,
        })
        .subscribe({
          next: (value) => {
            this.snackBarService.showSuccess('Brand Updated Successfuly !');
            this.dialogRef.close('updated');
          },
          error: (err) => {
            this.snackBarService.showError(err.error.error);
            // this.dialogRef.close('created');
          },
          complete: () => {},
        });
    } else {
      this.snackBarService.showError('Please fill the fields !');
    }
  }

  // getAllParentCategory() {
  //   // this.apiService.get('item/get-all-item-category').subscribe((res) => {
  //   //   this.parentCategoryList = res;
  //   // });
  //   const value = this.apiService.get('item/get-all-item-category');
  // }

}
