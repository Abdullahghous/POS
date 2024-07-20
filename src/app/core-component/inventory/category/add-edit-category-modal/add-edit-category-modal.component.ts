import { Component, Inject } from '@angular/core';
import { HttpService } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-add-edit-category-modal',
  standalone: true,
  imports: [ReactiveFormsModule,MatDialogModule, NzCheckboxModule],
  templateUrl: './add-edit-category-modal.component.html',
  styleUrl: './add-edit-category-modal.component.scss'
})
export class AddEditCategoryModalComponent {

  constructor (
    private dialogRef: MatDialogRef<AddEditCategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiService: HttpService,
    private snackBarService: SnackBarService
  ) {}

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    active: new FormControl(false),
  });



  ngOnInit() {
    if(this.data?.isEdit) {
      console.log('Edit Data', this.data);
      this.formGroup.setValue({
        name: this.data.values.name ? this.data.values.name : '',
        active: this.data.values.active ? this.data.values.active : false,
      })
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  addDetails() {
    console.log('ADD DETAILS::');

    if (this.formGroup.valid) {
      this.apiService
        .post('item/add_or_update_item_category', this.formGroup.value)
        .subscribe({
          next: (value) => {
            this.snackBarService.showSuccess('Category Added Successfuly !');
            this.dialogRef.close('created');
          },
          error: (err) => {
            this.snackBarService.showError(err.error.error);
            // this.dialogRef.close('created');
          },
          complete: () => {},
        })
    } else {
      this.snackBarService.showError('Please fill the fields !');
    }
  }

  updateDetails() {
    console.log('UPDATE DETAILS::');
    if (this.formGroup.valid) {
      this.apiService
        .post('item/add_or_update_item_category', {
          ...this.formGroup.value,
          id: this.data.values.id ? this.data.values.id : null,
        })
        .subscribe({
          next: (value) => {
            this.snackBarService.showSuccess('Category Updated Successfuly !');
            this.dialogRef.close('updated');
          },
          error: (err) => {
            this.snackBarService.showError(err.error.error);
            // this.dialogRef.close('created');
          },
          complete: () => {},
        })
    } else {
      this.snackBarService.showError('Please fill the fields !');
    }
  }

}
