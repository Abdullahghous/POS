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

  ngOnInit() {
    this.initializeData();
  }


  async initializeData() {
    await this.getAllProducts();
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

  async getAllProducts() {

    this.allData = [];
    this.istableLoading = true;
    const value = await this.apiService.get<any>('item/get-all-item');
    if (value.length) {
      this.allData = value.map((d: any) => ({
        ...d,
        formattedCreatedAt : this.datePipe.transform(new Date(d.createdAt), 'MM-dd-yyyy'),
        formattedModifiedAt : this.datePipe.transform(new Date(d.modifiedAt), 'MM-dd-yyyy'),
      }));;
      this.dataSource = new MatTableDataSource<any>(this.tableData);
      this.istableLoading = false;
    } else {
      this.istableLoading = false;
    }
  }

  onEdit(data: any) {
    localStorage.setItem('product::', JSON.stringify(data));
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
