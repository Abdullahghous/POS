import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService, SidebarService, routes } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-account-management-add-edit',
  templateUrl: './account-management-add-edit.component.html',
  styleUrl: './account-management-add-edit.component.scss'
})
export class AccountManagementAddEditComponent {

  formGroupLevels = new FormGroup({
    levelOne: new FormControl('', [Validators.required]),
    levelTwo: new FormControl('', [Validators.required]),
    levelThree: new FormControl('', [Validators.required]),
    levelFour: new FormControl('', [Validators.required]),
  });

  public routes = routes;

  levelOneData: any[] = [];
  levelTwoData: any[] = [];
  levelThreeData: any[] = [];
  levelFourData: any[] = [];

  isCollapsed: boolean = false;

  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(
    private sidebar: SidebarService,
    private apiService: HttpService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    // this.initializeData();
  }

  async initializeData() {
    await this.getAllBrand();
  }

  async getAllBrand() {}


  onSave() {
    // if (this.formGroup.valid) {

    //   const obj: any = {
    //     itemSubCategory: { 
    //       id: this.formGroup.value?.subCategory
    //     },
    //     name: this.formGroup.value.productName,
    //     pricingRule: 'QUANTITY',
    //     reorderLevel: this.formGroup.value.quantityAlert,
    //     saleRate: this.formGroup.value.sellingPrice,
    //     purchaseRate: this.formGroup.value.buyingPrice,
    //     unit: {
    //       id: this.formGroup.value.unit,
    //     },
    //     brand: {
    //       id: this.formGroup.value.brand,
    //     },
    //   };

    //   this.apiService.post('item/add_or_update_item', obj).subscribe((res) => {
    //     // console.log(res, 'sssssssssssssssss');
    //     if(res) {
    //       this.snackBarService.showSuccess('Product Added Successfully !');
    //       this.formGroup.reset();
    //     }
    //   })

    // } else {
    //   this.snackBarService.showError('Please fill all the required fields !');
    // }
  }


  onChangeLevelOne(value: any) {
    console.log("LEVEL ONE CHANGE DP::", value);
  }

  onChangeLevelTwo(value: any) {
    console.log("LEVEL TWO CHANGE DP::", value);
  }

  onChangeLevelThree(value: any) {
    console.log("LEVEL THREE CHANGE DP::", value);
  }

  onChangeLevelFour(value: any) {
    console.log("LEVEL FOUR CHANGE DP::", value);
  }

}
