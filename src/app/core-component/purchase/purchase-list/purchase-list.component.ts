import { Component , OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  DataService,
  pageSelection,
  apiResultFormat,
  routes,
  SidebarService,HttpService
} from 'src/app/core/core.index';
import { purchaseList } from 'src/app/shared/model/page.model';
import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';
import Swal from 'sweetalert2';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { VoucherService } from 'src/app/core/service/voucher/voucher.service';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss',
})
export class PurchaseListComponent implements OnInit {
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

  public routes = routes;
  // pagination variables
  public tableData: Array<purchaseList> = [];
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<purchaseList>;
  public searchDataValue = '';
  isButtonDisabled = false;
  itemDefs: any[] = [];
  parties: any[] = [];
  mills: any[] = [];
  allParties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  voucher:any=[];
  //** / pagination variables

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private voucherService:VoucherService
  ) {
      
    // this.data.getDataTable().subscribe((apiRes: apiResultFormat) => {
    //   this.totalData = apiRes.totalData;
    //   this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
    //     if (this.router.url == this.routes.purchaseList) {
    //       this.getTableData({ skip: res.skip, limit: this.totalData  });
    //       this.pageSize = res.pageSize;
    //     }
    //   });
    // });
  
  }
  
  ngOnInit(): void {
    this.getAll()
  }
  obj={
    "company": {
        "id": "1",
        "name": ""
    },
    "branch": {
        "id": "26",
        "name": ""
    },
    "voucherType": {
        "name": ""
    },
    "voucherCode": "0",
    "inventoryVoucherType": "PJV",
    "searchByDate": "3",
    "fromDate": "2024-01-07",
    "toDate": "2024-09-07",
    "postedUnPosted": "2"
}
search(){
  this.apiService.post('receivables/inventory_voucher_list', this.obj).subscribe((res) => {
    if (res) {

      this.voucher = res;
      console.log(res ,'pppppplisttt===')
    //
    }
  });
}




getAll(){
  
  let items: any = localStorage.getItem('itemDefs');
  let parties: any = localStorage.getItem('parties');
  let mills: any = localStorage.getItem('mills');
  let getBranches: any = localStorage.getItem('branch');
  let getCompanies: any = localStorage.getItem('companies');
  let financialYear: any = localStorage.getItem('financialYear');
  // console.log(getCompanies,'compnayyyy====8')
  if (items && parties && mills && getBranches && getCompanies && financialYear
     != null && JSON.parse(items).length != 0) {
    this.itemDefs = JSON.parse(items);
    this.parties =JSON.parse(parties);
    this.mills = JSON.parse(mills); 
    this.getBranches = JSON.parse(getBranches);
    this.getCompanies = JSON.parse(getCompanies);
    this.financialYear = JSON.parse(financialYear);
    // debugger
  }
  else{
    this.allApiService.getItemDefs();
    items = localStorage.getItem('itemDefs');
    this.itemDefs = JSON.parse(items);
    this.allApiService.getMills();
    mills = localStorage.getItem('mills');
    this.mills = JSON.parse(mills);
    this.allApiService.getParties();
    parties = localStorage.getItem('parties');
    this.parties = JSON.parse(parties);
    this.allApiService.getBranches();
    getBranches = localStorage.getItem('branch');
    this.getBranches = JSON.parse(getBranches);
    this.allApiService.getCompanies();
    getCompanies = localStorage.getItem('companies');
    this.getCompanies = JSON.parse(getCompanies);
    this.allApiService.financialYear();
    financialYear = localStorage.getItem('financialYear');
    this.financialYear = JSON.parse(financialYear);
     debugger
  }
}
  private getTableData(pageOption: pageSelection): void {
    this.data.getPurchaseList().subscribe((apiRes: apiResultFormat) => {
      this.tableData = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: purchaseList, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.tableData.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<purchaseList>(this.tableData);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        serialNumberArray: this.serialNumberArray,
      });
    });
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
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  public filter = false;
  openFilter() {
   
    this.filter = !this.filter;
  }

  confirmColor() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: ' btn btn-success',
        cancelButton: 'me-2 btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      confirmButtonText: 'Yes, delete it!',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }
  public cartValue = [2,2,2,2,2,2,2,2];

  public addPos(i: number): void {
    this.cartValue[i]++;
  }
  public reducePos(i: number): void {
    this.cartValue[i]--;
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
}
