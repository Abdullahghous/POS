import { Component, Inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { HttpService } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { AddEditBrandModalComponent } from '../../brand-list/add-edit-brand-modal/add-edit-brand-modal.component';

@Component({
  selector: 'app-add-edit-unit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    NzCheckboxModule,
    MatSelectModule,
  ],
  templateUrl: './add-edit-unit-modal.component.html',
  styleUrl: './add-edit-unit-modal.component.scss',
})
export class AddEditUnitModalComponent {
  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    baseUnit: new FormControl('', [Validators.required]),
    secondaryUnit: new FormControl('', [Validators.required]),
    conversionValue: new FormControl('', [Validators.required]),
  });

  parentCategoryList: any[] = [];

  public baseUnit: any = 'Base unit';
  public secondaryUnit: any = 'Secondary unit';

  constructor(
    private dialogRef: MatDialogRef<AddEditUnitModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiService: HttpService,
    private snackBarService: SnackBarService
  ) {
    this.getAllParentCategory();
    this.formGroup.valueChanges.subscribe((v) => {
      this.baseUnit = v.baseUnit;
      this.secondaryUnit = v.secondaryUnit;
    });
  }

  ngOnInit() {
    if (this.data?.isEdit) {
      console.log('Edit Data', this.data);
      // this.formGroup.setValue({
      //   name: this.data.values.name ? this.data.values.name : '',
      // });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  addDetails() {
    console.log('ADD DETAILS::');

    if (this.formGroup.valid) {
      this.apiService
        .post('unit/add_or_update', {
          name: this.formGroup.value.name,
          conversionName: this.formGroup.value.secondaryUnit,
          conversionValue: Number(this.formGroup.value.conversionValue),
          baseName: this.formGroup.value.baseUnit,
          baseValue: 1, // 1 bydeafult
        })
        .subscribe({
          next: (value) => {
            this.snackBarService.showSuccess('Unit Added Successfuly !');
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
        .post('unit/add_or_update', {
          conversionName: this.formGroup.value.secondaryUnit,
          conversionValue: this.formGroup.value.conversionValue,
          baseName: this.formGroup.value.baseUnit,
          baseValue: 1, // 1 bydeafult
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

  getAllParentCategory() {
    this.apiService.get('item/get-all-item-category').subscribe((res) => {
      this.parentCategoryList = res;
    });
  }
}
