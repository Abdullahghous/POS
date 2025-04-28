import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { categoryList } from 'src/app/shared/model/page.model';
import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { AddEditCategoryModalComponent } from '../add-edit-category-modal/add-edit-category-modal.component';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';

interface data {
  value: string;
}

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
  providers: [DatePipe]
})
export class CategoryListComponent {
  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    active: new FormControl(false),
  });

  initChecked = false;
  public routes = routes;
  public selectedValue1 = '';
  public selectedValue2 = '';
  public selectedValue3 = '';

  // pagination variables
  public tableData: any[] = [];
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<categoryList>;
  public searchDataValue = '';
  //** / pagination variables

  allData = [];
  istableLoading = false;

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
  }

  async initializeData() {
    await this.getAllCategory();
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
  }


  public filter = false;

  openFilter() {
    this.filter = !this.filter;
  }

  isCollapsed: boolean = false;

  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }

  createCategory() {
    if (this.formGroup.valid) {
      this.apiService
        .post('item/add_or_update_item_category', this.formGroup.value)
        .subscribe((res) => {
          console.log('CREATE CATEGORY RES ::', res);
          if (res) {
            this.snackBarService.showError('Category Added Successfuly !');
            this.getAllCategory();
          }
        });
    } else {
      this.snackBarService.showError('Please fill the fields !');
    }
  }

  async getAllCategory() {

    this.allData = [];
    this.istableLoading = true;
    const value = await this.apiService.get<any>('item/get-all-item-category');
    if (value.length) {
      this.allData = value.map((d: any) => ({
        ...d,
        formattedCreatedAt : this.datePipe.transform(new Date(d.createdAt), 'MM-dd-yyyy'),
        formattedModifiedAt : this.datePipe.transform(new Date(d.modifiedAt), 'MM-dd-yyyy'),
      }))
      this.tableData = [...this.allData];
      this.dataSource = new MatTableDataSource<any>(this.allData);
      this.istableLoading = false;
    } else {
      this.istableLoading = false;
    }
  }


  addModal(): void {
    const dialogRef = this.dialog.open(AddEditCategoryModalComponent, {
      disableClose: true,
      width: "500px",
      data: { 
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('RESULT ::', result);
      if(result === 'created') {
        this.getAllCategory();
      }
    });
  }

  editModal(data: any): void {
    const dialogRef = this.dialog.open(AddEditCategoryModalComponent, {
      disableClose: true,
      width: "500px",
      data: { 
        isEdit: true,
        values: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('RESULT ::', result);
      if(result === 'updated') {
        this.getAllCategory();
      }
    });
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
      pdf.save(`${environment.PRODUCT_NAME}-category-list.pdf`);
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
