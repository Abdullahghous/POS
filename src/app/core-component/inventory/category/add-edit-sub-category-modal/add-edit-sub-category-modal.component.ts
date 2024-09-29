import { Component, Inject } from '@angular/core';
import { HttpService } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-edit-sub-category-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, NzCheckboxModule, MatSelectModule],
  templateUrl: './add-edit-sub-category-modal.component.html',
  styleUrl: './add-edit-sub-category-modal.component.scss',
})
export class AddEditSubCategoryModalComponent {
  formGroup = new FormGroup({
    parentCategoryCode: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    active: new FormControl(false),
  });

  parentCategoryList: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddEditSubCategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiService: HttpService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.parentCategoryList = this.data?.parentCategoryList;
    if (this.data?.isEdit) {
      console.log('Edit Data', this.data);
      this.formGroup.setValue({
        parentCategoryCode: this.data.values.parentCode
          ? this.data.values.parentCode
          : null,
        name: this.data.values.name ? this.data.values.name : '',
        active: this.data.values.active ? this.data.values.active : false,
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
        .post('item/add_or_update_item_sub_category', {
          itemCategory: {
            code: this.formGroup.value.parentCategoryCode,
          },
          name: this.formGroup.value.name,
          active: this.formGroup.value.active,
        })
        .subscribe({
          next: (value) => {
            this.snackBarService.showSuccess('Category Added Successfuly !');
            this.dialogRef.close('created');
          },
          error: (err) => {
            this.snackBarService.showError(err.error.error);
            this.dialogRef.close('created');
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
        .post('item/add_or_update_item_sub_category', {
          itemCategory: {
            code: this.formGroup.value.parentCategoryCode,
          },
          name: this.formGroup.value.name,
          active: this.formGroup.value.active,
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
        });
    } else {
      this.snackBarService.showError('Please fill the fields !');
    }
  }

  // getAllParentCategory() {
  //   this.apiService.get('item/get-all-item-category').subscribe((res) => {
  //     this.parentCategoryList = res;
  //   });
  // }
}
