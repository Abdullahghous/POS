import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpService, SidebarService, apiResultFormat } from 'src/app/core/core.index';
import { routes } from 'src/app/core/helpers/routes';
import { DataService } from 'src/app/core/service/data/data.service';
import { unit } from 'src/app/shared/model/page.model';
import { PaginationService, pageSelection, tablePageSize } from 'src/app/shared/shared.index';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { AddEditUnitModalComponent } from './add-edit-unit-modal/add-edit-unit-modal.component';

interface data {
  value: string;
}

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss'
})
export class UnitsComponent {
  initChecked = false;
  public selectedValue1 = '';
  public selectedValue2 = '';
  public selectedValue3 = '';
  public routes = routes;

 

  public cartValue = [4,4];

  public addPos(i: number): void {
    this.cartValue[i]++;
  }
  public reducePos(i: number): void {
    this.cartValue[i]--;
  }


  // pagination variables
  public tableData: Array<any> = [];
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<any>;
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
    this.getAllUnits();
  }

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

  selectedList3: data[] = [
    { value: 'Sort by Datee' },
    { value: 'Newest' },
    { value: 'Oldest' },
  ];
  selectedList1: data[] = [
    { value: 'Choose Status' },
    { value: 'Active' },
    { value: 'Inactive' },
  ];
  selectedList2: data[] = [
    { value: 'Choose Unit' },
    { value: 'Piece' },
    { value: 'Kilogram' },
    { value: 'Gram' },
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

  getAllUnits() {
    this.apiService.get('unit/list').subscribe((res) => {
      console.log('All Units::', res);
      if (res.length) {
        res.forEach((d: any) => {
          this.tableData.push({
            ...d,
          })
        })

        this.tableData = [];
        this.serialNumberArray = [];
        this.totalData = res.length;
        res.map((d: any, index: number) => {
            // res.sNo = serialNumber;
            this.tableData.push({
              ...d,
            });
        });
        this.dataSource = new MatTableDataSource<any>(this.tableData);
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
    const dialogRef = this.dialog.open(AddEditUnitModalComponent, {
      disableClose: true,
      width: "500px",
      data: { 
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('RESULT ::', result);
      if(result === 'created') {
        this.getAllUnits();
      }
    });
  }

  editModal(data: any): void {
    const dialogRef = this.dialog.open(AddEditUnitModalComponent, {
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
        this.getAllUnits();
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
      pdf.save(`${environment.PRODUCT_NAME}-units-list.pdf`);
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
