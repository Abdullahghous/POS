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

  constructor(
    public dialog: MatDialog,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private apiService: HttpService,
    private snackBarService: SnackBarService,
    private datePipe: DatePipe
  ) {
    // this.data.getDataTable().subscribe((apiRes: apiResultFormat) => {
    //   this.totalData = apiRes.totalData;
    //   this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
    //     if (this.router.url == this.routes.categoryList) {
    //       this.getTableData({ skip: res.skip, limit: this.totalData  });
    //       this.pageSize = res.pageSize;
    //     }
    //   });
    // });
  }

  ngOnInit() {
    this.getAllCategory();
  }

  // private getTableData(pageOption: pageSelection): void {
  //   this.data.getCategoryList().subscribe((apiRes: apiResultFormat) => {
      // this.tableData = [];
      // this.serialNumberArray = [];
      // this.totalData = apiRes.totalData;
      // apiRes.data.map((res: categoryList, index: number) => {
      //   const serialNumber = index + 1;
      //   if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
      //     res.sNo = serialNumber;
      //     this.tableData.push(res);
      //     this.serialNumberArray.push(serialNumber);
      //   }
      // });
      // this.dataSource = new MatTableDataSource<categoryList>(this.tableData);
      // this.pagination.calculatePageSize.next({
      //   totalData: this.totalData,
      //   pageSize: this.pageSize,
      //   tableData: this.tableData,
      //   serialNumberArray: this.serialNumberArray,
      // });
  //   });
  // }

  public sortData(sort: Sort) {
    const data = this.tableData.slice();
    if (!sort.active || sort.direction === '') {
      this.tableData = data;
    } else {
      this.tableData = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
  }

  selectedList1: data[] = [
    { value: 'Sort by Date' },
    { value: 'Newest' },
    { value: 'Oldest' },
  ];
  public filter = false;
  openFilter() {
    this.filter = !this.filter;
  }
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  confirmColor() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: ' btn btn-success',
        cancelButton: 'me-2 btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        confirmButtonText: 'Yes, delete it!',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          );
        }
      });
  }
  selectedList2: data[] = [
    { value: 'Choose Category' },
    { value: 'Laptop' },
    { value: 'Electronics' },
  ];
  selectedList3: data[] = [
    { value: 'Choose Status' },
    { value: 'Active' },
    { value: 'Inactive' },
  ];

  selectAll(initChecked: boolean) {
    if (!initChecked) {
      this.tableData.forEach((f) => {
        f.isSelected = true;
      });
    } else {
      this.tableData.forEach((f) => {
        f.isSelected = false;
      });
    }
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

  getAllCategory() {
    this.apiService.get('item/get-all-item-category').subscribe((res) => {
      console.log('All Category::', res);
      if (res.length) {
        res.forEach((d: any) => {
          this.tableData.push({
            ...d,
            formattedCreatedAt : this.datePipe.transform(new Date(d.createdAt), 'MM-dd-yyyy'),
            formattedModifiedAt : this.datePipe.transform(new Date(d.modifiedAt), 'MM-dd-yyyy'),
          })
        })

        this.tableData = [];
        this.serialNumberArray = [];
        this.totalData = res.length;
        res.map((d: any, index: number) => {
            // res.sNo = serialNumber;
            this.tableData.push({
              ...d,
              formattedCreatedAt : this.datePipe.transform(new Date(d.createdAt), 'MM-dd-yyyy'),
              formattedModifiedAt : this.datePipe.transform(new Date(d.modifiedAt), 'MM-dd-yyyy'),
            });
        });
        this.dataSource = new MatTableDataSource<categoryList>(this.tableData);
        this.pagination.calculatePageSize.next({
          totalData: this.totalData,
          pageSize: this.pageSize,
          tableData: this.tableData,
          serialNumberArray: this.serialNumberArray,
        });
      }
    });
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
