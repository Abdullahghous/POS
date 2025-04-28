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
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { lowStocks } from 'src/app/shared/model/page.model';
import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';
import Swal from 'sweetalert2';
interface data {
  value: string;
}
@Component({
  selector: 'app-low-stocks',
  templateUrl: './low-stocks.component.html',
  styleUrl: './low-stocks.component.scss',
})
export class LowStocksComponent {
  public routes = routes;
  initChecked = false;
  // pagination variables
  public tableData: Array<lowStocks> = [];
  public tableData2: Array<lowStocks> = [];

  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<lowStocks>;
  itemDefs: any = [];
  parties: any[] = [];
  mills: any[] = [];
  allParties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  item:any=[];
  report:any=[];
  report2:any=[];
  public searchDataValue = '';
  //** / pagination variables

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService
  ) {
    this.data.getLowStocks().subscribe((apiRes: apiResultFormat) => {
      this.totalData = apiRes.totalData;
      this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
        if (this.router.url == this.routes.lowStock) {
          this.getTableData({ skip: res.skip, limit: this.totalData  });
          this.pageSize = res.pageSize;
        }
      });
    });
    this.data.getLowStocks2().subscribe((apiRes: apiResultFormat) => {
      this.totalData = apiRes.totalData;
      this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
        if (this.router.url == this.routes.lowStock) {
          this.getTableData2({ skip: res.skip, limit: this.totalData  });
          this.pageSize = res.pageSize;
        }
      });
    });
    this.getItem();
    this.getAll();
  }
  obj:any={
    "companyId": "0",
    "branchId": "0",
    "voucherStatusId": "0",
    "financialYearId": "5",
    "fromDate": "2023-08-14",
    "toDate": "2024-12-16",
    "itemDefId": "0",
    "itemCategoryId": "11",
    "accountCode": "0"
  }
  obj2:any={
    "companyId": "0",
    "branchId": "0",
    "voucherStatusId": "0",
    "financialYearId": "5",
    "fromDate": "2023-08-14",
    "toDate": "2024-12-16",
    "itemDefId": 0,
    "itemCategoryId": "0",
    "accountCode": "0",
    "negativePositive": "0"
}
  onSave(){
    this.apiService.post('reports/stock_ledger', this.obj).subscribe((res) => {
      if (res) {
  
        this.report = res;
        console.log('obnjjjjjj::',res);
      }
    });
  }
  onSave2(){
    this.apiService.post('reports/stock_report_quantity', this.obj2).subscribe((res) => {
      if (res) {
  
        this.report2 = res;
        console.log('report22::',res);
      }
    });
  }
  getItem(){
    this.apiService.getObservable('item/get-all-item-category').subscribe((res:any)=>{
      this.item=res
    })
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
      console.log(this.financialYear ,'yearrrr====')
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
      
      //  debugger
    }
    const maxFinancialYear = this.financialYear.reduce((maxYear, currentYear) => {
      debugger
      return currentYear.id > maxYear.id ? currentYear : maxYear;
  }, this.financialYear[0]);
  this.obj.fromDate =maxFinancialYear.fromDate;
  this.obj.toDate =maxFinancialYear.toDate;
  this.obj.financialYearId =maxFinancialYear.id;
  
  }
  private getTableData(pageOption: pageSelection): void {
    this.data.getLowStocks().subscribe((apiRes: apiResultFormat) => {
      this.tableData = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: lowStocks, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.tableData.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<lowStocks>(this.tableData);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        serialNumberArray: this.serialNumberArray,
      });
    });
  }
  private getTableData2(pageOption: pageSelection): void {
    this.data.getLowStocks().subscribe((apiRes: apiResultFormat) => {
      this.tableData2 = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: lowStocks, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.tableData2.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<lowStocks>(this.tableData2);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData2: this.tableData2,
        serialNumberArray: this.serialNumberArray,
        tableData: []
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
  public selectedValue1 = '';
  public selectedValue2 = '';
  public selectedValue3 = '';
  public selectedValue4 = '';
  public selectedValue5 = '';
  public selectedValue6 = '';
  public selectedValue7 = '';
  public selectedValue8 = '';


  selectedList1: data[] = [
    { value: 'Sort by Date' },
    { value: 'Newest' },
    { value: 'Oldest' },
  ];
  selectedList2: data[] = [
    { value: 'Choose Product' },
    { value: 'Lenovo 3rd Generation' },
    { value: 'Nike Jordan' },
    { value: 'Amazon Echo Dot' },
  ];
  selectedList3: data[] = [
    { value: 'Choose Category' },
    { value: 'Laptop' },
    { value: 'Shoe' },
    { value: 'Speaker' },
  ];
  selectedList4: data[] = [
    { value: 'Choose Warehouse' },
    { value: 'Lavish Warehouse' },
    { value: 'Lobar Handy' },
    { value: 'Traditional Warehouse' },
  ];
  selectedList5: data[] = [
    { value: 'Sort by Date' },
    { value: 'Newest' },
    { value: 'Oldest' },
  ];
  selectedList6: data[] = [
    { value: 'Choose Product' },
    { value: 'Lenovo 3rd Generation' },
    { value: 'Nike Jordan' },
    { value: 'Amazon Echo Dot' },
  ];
  selectedList7: data[] = [
    { value: 'Choose Category' },
    { value: 'Laptop' },
    { value: 'Shoe' },
    { value: 'Speaker' },
  ];
  selectedList8: data[] = [
    { value: 'Choose Warehouse' },
    { value: 'Lavish Warehouse' },
    { value: 'Lobar Handy' },
    { value: 'Traditional Warehouse' },
  ];
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
  // selectAll(initChecked: boolean) {
  //   if (!initChecked) {
  //     this.tableData.forEach((f) => {
  //       f.isSelected = true;
  //     });
  //   } else {
  //     this.tableData.forEach((f) => {
  //       f.isSelected = false;
  //     });
  //   }
  // }
}
