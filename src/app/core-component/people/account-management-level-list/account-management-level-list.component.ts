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
import { brandList } from 'src/app/shared/model/page.model';
import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-account-management-level-list',
  templateUrl: './account-management-level-list.component.html',
  styleUrl: './account-management-level-list.component.scss'
})
export class AccountManagementLevelListComponent {

  initChecked = false;
  public routes = routes;
  // pagination variables
  public tableData: any[] = [];
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<any>;
  public searchDataValue = '';
  //** / pagination variables

  allData = [];
  istableLoading = true;

  constructor(
    public dialog: MatDialog,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private apiService: HttpService,
    private snackBarService: SnackBarService,
    private datePipe: DatePipe
  ) {}

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

  ngOnInit() {
    this.initializeData();
  }


  async initializeData() {
    await this.getAllBrands();
  }

  async getAllBrands() {
    this.allData = [];
    this.istableLoading = true;
    const value = await this.apiService.get<any>('brand/list');
    if (value.length) {
      this.allData = value;
      this.dataSource = new MatTableDataSource<any>(this.tableData);
      this.istableLoading = false;
    } else {
      this.istableLoading = false;
    }
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
      pdf.save(`${environment.PRODUCT_NAME}-brand-list.pdf`);
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

  navigateToAddAccount() {
    this.router.navigate([routes.accountManagementLevelsAddEdit])
  }

}
