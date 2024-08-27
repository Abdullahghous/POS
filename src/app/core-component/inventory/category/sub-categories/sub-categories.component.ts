import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { apiResultFormat, HttpService } from 'src/app/core/core.index';
import { routes } from 'src/app/core/helpers/routes';
import { DataService } from 'src/app/core/service/data/data.service';
import { SidebarService } from 'src/app/core/service/sidebar/sidebar.service';
import { PaginationService, pageSelection, tablePageSize } from 'src/app/shared/custom-pagination/pagination.service';
import { subcategories } from 'src/app/shared/model/page.model';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { AddEditSubCategoryModalComponent } from '../add-edit-sub-category-modal/add-edit-sub-category-modal.component';
import { DatePipe } from '@angular/common';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

interface data {
  value: string;
}


@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.scss'
})
export class SubCategoriesComponent {
  public routes = routes;
  initChecked = false;
  // pagination variables
  public tableData: any[] = [];
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<subcategories>;
  public searchDataValue = '';
  //** / pagination variables

  allData = [];
  istableLoading = false;
  parentCategoryList = [];

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
    await this.getParentCategroyList();
    await this.getAllSubCategory();
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


  async getAllSubCategory() {

    this.allData = [];
    this.istableLoading = true;
    const value = await this.apiService.get<any>('item/get-all-item-sub-category');
    if (value.length) {
      this.allData = value.map((d: any) => ({
        ...d,
        formattedCreatedAt : this.datePipe.transform(new Date(d.createdAt), 'MM-dd-yyyy'),
        formattedModifiedAt : this.datePipe.transform(new Date(d.modifiedAt), 'MM-dd-yyyy'),
      }))
      this.dataSource = new MatTableDataSource<any>(this.tableData);
      this.istableLoading = false;
    } else {
      this.istableLoading = false;
    }
  }



  addModal(): void {
    const dialogRef = this.dialog.open(AddEditSubCategoryModalComponent, {
      disableClose: true,
      width: "500px",
      data: { 
        isEdit: false,
        parentCategoryList: this.parentCategoryList
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('RESULT ::', result);
      if(result === 'created') {
        this.getAllSubCategory();
      }
    });
  }

  editModal(data: any): void {
    const dialogRef = this.dialog.open(AddEditSubCategoryModalComponent, {
      disableClose: true,
      width: "500px",
      data: { 
        isEdit: true,
        values: data,
        parentCategoryList: this.parentCategoryList
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('RESULT ::', result);
      if(result === 'updated') {
        this.getAllSubCategory();
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
      pdf.save(`${environment.PRODUCT_NAME}-sub-category-list.pdf`);
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

  async getParentCategroyList() {

    const value = await this.apiService.get<any>('item/get-all-item-category');
    if (value.length) {
      this.parentCategoryList = value;
    }
  }

}
