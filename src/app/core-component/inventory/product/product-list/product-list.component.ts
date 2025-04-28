import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  DataService,
  pageSelection,
  apiResultFormat,
  routes,
  SidebarService,
  HttpService,
} from 'src/app/core/core.index';
import { productList } from 'src/app/shared/model/page.model';
import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AddEditBrandModalComponent } from '../../brand-list/add-edit-brand-modal/add-edit-brand-modal.component';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  initChecked = false;
  selectedValue1 = '';
  selectedValue2 = '';
  selectedValue3 = '';
  selectedValue4 = '';
  selectedValue5 = '';
  selectedValue6 = '';
  selectedValue7 = '';
  selectedValue8 = '';
  selectedValue9 = '';
  selectedValue10 = '';
  selectedValue11 = '';
  selectedValue12 = '';
  selectedValue13 = '';
  selectedValue14 = '';
  selectedValue15 = '';
  selectedValue16 = '';
  selectedValue17 = '';
  selectedValue18 = '';
  selectedValue19 = '';
  selectedValue20 = '';
  selectedValue21 = '';
  selectedValue22 = '';
  selectedValue23 = '';
  selectedValue24 = '';
  selectedValue25 = '';
  selectedValue26 = '';

  public routes = routes;
  // pagination variables
  public tableData: Array<any> = [];
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<productList>;
  public searchDataValue = '';
  //** / pagination variables
  allData = [];
  allBrands: any[] = [];
  allCategory: any[] = [];
  allSubCategory: any[] = [];
  allUnits: any[] = [];
  item:any=[];
  rowIndex: number = 1;
  // istableLoading = true;

  constructor(
    public dialog: MatDialog,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private apiService: HttpService,
    private snackBarService: SnackBarService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.initializeData();
    this.getAllCategory();
    this.getAllSubCategory()
  }


  async initializeData() {
    // await this.getAllProducts();
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
  }

  isCollapsed: boolean = false;

  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !
    this.isCollapsed;
  }
  public filter = false;

  openFilter() {
    this.filter = !this.filter;
  }
  obj: any = {
    "id": 0, 
    itemSubCategoryId:0,
    "formattedCode": "",
    "name": "",  
    "weightParBag": 0,
    "standardRate": 0, 
    "pricingRule": "",  
    "conversionValue": 0,
    "conversionName": "",
    "unitName": "",   
    "unitValue": 0,
  }

  async getAllProducts() {
    debugger
    this.allData = [];
    const value = await this.apiService.get<any>('item/get-all-item');
    if (value.length) {
      this.allData = value.map((d: any) => ({
        ...d,
        formattedCreatedAt : this.datePipe.transform(new Date(d.createdAt), 'MM-dd-yyyy'),
        formattedModifiedAt : this.datePipe.transform(new Date(d.modifiedAt), 'MM-dd-yyyy'),
      }));;
      this.tableData = [...this.allData];
      this.dataSource = new MatTableDataSource<any>(this.allData);
      console.log('data' ,value);
      console.log('all---data' ,this.tableData)
    } else {
    }
  }
  
  getAllCategory() {
    this.apiService.getObservable('item/get-all-item-category').subscribe((res: any) => {
      if (res.length) {
        this.allCategory = res;
      }
    });
  }

  getAllSubCategory() {
    this.apiService.getObservable('item/get-all-item-sub-category').subscribe((res: any) => {
      if (res) {
        this.allSubCategory = res;
        this.rowIndex = 1;
        console.log('apiressss',this.rowIndex)
      }
    });
  }
  onChangeCatgory(data:any) {
    debugger
    console.log('id datta',data)
    // const level = this.allSubCategory.find((l: any) => l.code == data);
    // let id = level.id;
    this.apiService.getObservable('item/get_new_item_code?itemSubCategoryId=' +data ).subscribe((res:any) =>
    {
      debugger
      this.obj.formattedCode= res.itemCode
      // console.log('gfhfhjdf',level)
    })
  }
  onSave(): void {
    // Validate required fields in the obj
    if (!this.obj.formattedCode || !this.obj.name || !this.obj.pricingRule || !this.obj.conversionName || !this.obj.unitName || this.obj.weightParBag <= 0 
      || this.obj.conversionValue <= 0 || this.obj.unitValue <= 0 || this.obj.itemSubCategoryId <= 0) {
      this.snackBarService.showError('Please fill all required fields');
      return;
    }

    // POST request to add or update the item
    this.apiService.post('item/add_or_update_item', this.obj).subscribe(
      (res: any) => {
        console.log('Success:', res);
        if (res) {
          // Close the modal or dialog if successful
          const closeButton = document.getElementById('close-item');
          if (closeButton) {
            closeButton.click();
          }

          // Show success message
          this.snackBarService.showSuccess('Record updated successfully!');
        } else {
          // If the response is invalid
          this.snackBarService.showError('Please fill all the required fields!');
        }
      },
      (error) => {
        // Handle error
        console.error('Error occurred:', error);
        this.snackBarService.showError('An error occurred while adding the record!');
      }
    );
  }
  async getAllUnits() {
    const value = await this.apiService.get<any>('unit/list');
    if (value.length) {
      this.allUnits = value;
    }
  }

  cancel(){
    this.obj={
      "id": 0,  //  1
      "formattedCode": "", //   2
      "name": "",  //  3
      "weightParBag": 0, // 4
      "standardRate": 0, // 5
      "pricingRule": "",  // 6
      "conversionValue": 0,// 7
      "conversionName": "", //  8
      "unitName": "",   //  9
      "unitValue": 0,
      itemSubCategoryId:0,   //  10
      
    }
  }
  getSequentialIndex(voucherIndex: number, itemIndex: number): number {
    let globalIndex = 0;

    // پہلے تمام واؤچرز کے اندر موجود آئٹمز کی تعداد گنیں
    for (let i = 0; i < voucherIndex; i++) {
      globalIndex += this.allSubCategory[i].itemDefs.length;
    }

    // موجودہ واؤچر کے اندر موجود آئٹم کا انڈیکس + 1
    globalIndex += itemIndex + 1;

    return globalIndex; // گلوبل انڈیکس واپس کریں
  }
  onEdit(data: any,item:any) {
    debugger
    
    item = {
      ...item,
      itemSubCategoryId:  data.id, 
    };
    this.obj= item;
    console.log('edit',item)
  }

  generatePDF() {
    const data: any = document.getElementById('table-container');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`${environment.PRODUCT_NAME}-products-list.pdf`);
    });
  }

  exportToExcel(): void {
    // Create a new workbook and a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableData);

    // Create a workbook with the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the file
    XLSX.writeFile(wb, `${environment.PRODUCT_NAME}-category-list.xlsx`);
  }
 
}
