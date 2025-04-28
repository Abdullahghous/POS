import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService, SidebarService, routes } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
interface data {
  value: string;
}
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent {
  formGroup = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    brand: new FormControl(''),
    category: new FormControl(),
    subCategory: new FormControl(),
    unit: new FormControl('', [Validators.required]),
    buyingPrice: new FormControl('', [Validators.required]),
    sellingPrice: new FormControl('', [Validators.required]),
    quantityAlert: new FormControl(''),
  });

  isProductVisible: boolean = true;
  isProductVisible1: boolean = true;
  public routes = routes;

  allBrands: any[] = [];
  allCategory: any[] = [];
  allSubCategory: any[] = [];
  allUnits: any[] = [];

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
    this.getAllCategory();
    this.initializeData();
  }

  async initializeData() {
    await this.getAllBrand();
    // await this.getAllCategory();
    await this.getAllUnits();
  }

  async getAllBrand() {
    const value = await this.apiService.get<any>('brand/list');
    if (value.length) {
      this.allBrands = value;
    }
  }

  // async getAllCategory() {
  //   const value = await this.apiService.getPromise<any>('item/get-all-item-category');
  //   if (value.length) {
  //     this.allCategory = value;
  //   };
  // }

  getAllCategory() {
    this.apiService.getObservable('item/get-all-item-category').subscribe((res: any) => {
      if (res.length) {
        this.allCategory = res;
      }
    });
  }

  getAllSubCategory(categoryCode: any) {
    this.apiService.getObservable('item/get-all-item-sub-category').subscribe((res: any) => {
      if (res.length) {
        this.allSubCategory = res.filter(
          (sub: any) => sub.parentCode == categoryCode
        );
      }
    });
  }

  async getAllUnits() {
    const value = await this.apiService.get<any>('unit/list');
    if (value.length) {
      this.allUnits = value;
    }
  }

  onChangeCatgory(value: any) {
    this.getAllSubCategory(value);
    
  }

  onSave() {
    if (this.formGroup.valid) {

      const obj: any = {
        itemSubCategory: { 
          id: this.formGroup.value?.subCategory
        },
        name: this.formGroup.value.productName,
        pricingRule: '',
        // reorderLevel: this.formGroup.value.quantityAlert,
        // saleRate: this.formGroup.value.sellingPrice,
        // purchaseRate: this.formGroup.value.buyingPrice,
        unit: {
          id: this.formGroup.value.unit,
        },
        // brand: {
        //   id: this.formGroup.value.brand,
        // },
      };

      this.apiService.post('item/add_or_update_item', obj).subscribe((res) => {
        // console.log(res, 'sssssssssssssssss');
        if(res) {
          this.snackBarService.showSuccess('Product Added Successfully !');
          this.formGroup.reset();
        }
      })

    } else {
      this.snackBarService.showError('Please fill all the required fields !');
    }
  }
}
