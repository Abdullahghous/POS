import { Component,ElementRef ,OnInit } from '@angular/core';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { routes, SidebarService } from 'src/app/core/core.index';
import { salesList } from 'src/app/shared/model/page.model';
import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';
import { VoucherService } from 'src/app/core/service/voucher/voucher.service'; 
import { HttpService } from 'src/app/core/core.index';

interface data {
  value: string;
}
@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.scss',
})
export class SalesListComponent implements OnInit {
  initChecked = false;
  public routes = routes;
  itemDefs: any[] = [];
  parties: any[] = [];
  mills: any[] = [];
  
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  paymentType = '';
  
  // isButtonDisabled = false;
  public selectedValue1 = '';
 
  public selectedValue8 = '';
  public selectedValue9 = '';
  public selectedValue10 = '';
  public selectedValue11 = '';
  public selectedValue12 = '';
  
  voucher1:any=[]
  voucher: any = {
    itemStock: {
      account: { code: 0, id: 0 },
      voucherDetailList: [],
      silaiRate: 0,
    },
    company: { id: 0 },
    branch: { id: 0 },
    financialYear: { id: 4 }
  }
  itemStockEntry = {
    rate: 0,
    bags: 0,
    parti: 0,
    safiKg: 0,
    account: { code: 0 },
    silaiRate: 0,
    amount: 0,
    transactionType: 'IN',
    itemDef: { id: 0 },
  };
  obj: any = {
    "company": {
        "id": "0",
        "name": ""
    },
    "branch": {
        "id": "0",
        "name": ""
    },
    "voucherType": {
        "name": ""
    },
    "voucherCode": "",
    "inventoryVoucherType": "SJV",
    "searchByDate": "",
    "fromDate": "2024-01-07",
    "toDate": "2024-09-07",
    "postedUnPosted": "0"
}
  
  
  selectedList1: data[] = [
    { value: 'Sort by Date' },
    { value: '07 09 23' },
    { value: '21 09 23' },
  ];
 
  selectedList8: data[] = [{ value: 'Thomas' }, { value: 'Name' }];
  selectedList9: data[] = [
    { value: 'Dazzle Shoes' },
    { value: 'Supplier Name' },
  ];
  selectedList10: data[] = [
    { value: 'Choose' },
    { value: 'Completed' },
    { value: 'Inprogress' },
  ];
  selectedList11: data[] = [
    { value: 'Choose' },
    { value: 'Online' },
    { value: 'Cash' },
  ];
  selectedList12: data[] = [
    { value: 'Cash' },
    { value: 'Online' },
    { value: 'Inprogress'},
  ];

  // pagination variables
  public tableData: Array<salesList> = [];
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<salesList>;
  public searchDataValue = '';
  //** / pagination variables

  constructor(
    private allApiService:AllApiService,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private voucherService: VoucherService,
    private apiService: HttpService,
    private el: ElementRef
  ) {
    const today = new Date();
    this.obj.fromDate = today.toISOString().split('T')[0];
    this.obj.toDate = today.toISOString().split('T')[0];
    // this.addVoucher()
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
  public cartValue = [2,2,2,2,2,2,2,2];

  public addPos(i: number): void {
    this.cartValue[i]++;
  }
  public reducePos(i: number): void {
    this.cartValue[i]--;
  }
 
  
  search(){
    debugger
    this.apiService.post('receivables/inventory_voucher_list', this.obj).subscribe((res) => {
      if (res) {
  
        this.voucher = res;
        console.log(res ,'oggggggg===')
      //
      }
    });
  }

  

  ngOnInit(): void {
    this.getAll();
   
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
}
 
 
 
 
 
 
 
//   initChecked = false;
//   public selectedValue1 = '';
//   public selectedValue2 = '';
//   public selectedValue3 = '';
//   public selectedValue4 = '';
//   public selectedValue5 = '';
//   public selectedValue6 = '';
//   public selectedValue7 = '';
//   public selectedValue8 = '';
//   public selectedValue9 = '';
//   public selectedValue10 = '';
//   public selectedValue11 = '';
//   public selectedValue12 = '';
//   public routes = routes;
  
//   selectedList1: data[] = [
//     { value: 'Sort by Date' },
//     { value: '07 09 23' },
//     { value: '21 09 23' },
//   ];
//   selectedList2: data[] = [
//     { value: 'Choose Customer Name' },
//     { value: 'Macbook pro' },
//     { value: 'Orange' },
//   ];
//   selectedList3: data[] = [
//     { value: 'Choose Status' },
//     { value: 'Computers' },
//     { value: 'Fruits' },
//   ];
//   selectedList4: data[] = [
//     { value: 'Choose Payment Status' },
//     { value: 'Computers' },
//     { value: 'Fruits' },
//   ];
//   selectedList5: data[] = [{ value: 'Choose' }, { value: 'Customer Name' }];
//   selectedList6: data[] = [{ value: 'Choose' }, { value: 'Supplier Name' }];
//   selectedList7: data[] = [
//     { value: 'Choose' },
//     { value: 'Completed' },
//     { value: 'Inprogress' },
//   ];
//   selectedList8: data[] = [{ value: 'Thomas' }, { value: 'Name' }];
//   selectedList9: data[] = [
//     { value: 'Dazzle Shoes' },
//     { value: 'Supplier Name' },
//   ];
//   selectedList10: data[] = [
//     { value: 'Choose' },
//     { value: 'Completed' },
//     { value: 'Inprogress' },
//   ];
//   selectedList11: data[] = [
//     { value: 'Choose' },
//     { value: 'Online' },
//     { value: 'Cash' },
//   ];
//   selectedList12: data[] = [
//     { value: 'Cash' },
//     { value: 'Online' },
//     { value: 'Inprogress' },
//   ];

//   // pagination variables
//   public tableData: Array<salesList> = [];
//   public pageSize = 10;
//   public serialNumberArray: Array<number> = [];
//   public totalData = 0;
//   showFilter = false;
//   dataSource!: MatTableDataSource<salesList>;
//   public searchDataValue = '';
//   //** / pagination variables

//   constructor(
//     private data: DataService,
//     private pagination: PaginationService,
//     private router: Router,
//     private sidebar: SidebarService
//   ) {
//     this.data.getDataTable().subscribe((apiRes: apiResultFormat) => {
//       this.totalData = apiRes.totalData;
//       this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
//         if (this.router.url == this.routes.salesList) {
//           this.getTableData({ skip: res.skip, limit: this.totalData  });
//           this.pageSize = res.pageSize;
//         }
//       });
//     });
//   }

//   private getTableData(pageOption: pageSelection): void {
//     this.data.getSalesList().subscribe((apiRes: apiResultFormat) => {
//       this.tableData = [];
//       this.serialNumberArray = [];
//       this.totalData = apiRes.totalData;
//       apiRes.data.map((res: salesList, index: number) => {
//         const serialNumber = index + 1;
//         if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
//           res.sNo = serialNumber;
//           this.tableData.push(res);
//           this.serialNumberArray.push(serialNumber);
//         }
//       });
//       this.dataSource = new MatTableDataSource<salesList>(this.tableData);
//       this.pagination.calculatePageSize.next({
//         totalData: this.totalData,
//         pageSize: this.pageSize,
//         tableData: this.tableData,
//         serialNumberArray: this.serialNumberArray,
//       });
//     });
//   }

//   public sortData(sort: Sort) {
//     const data = this.tableData.slice();
//     if (!sort.active || sort.direction === '') {
//       this.tableData = data;
//     } else {
//       this.tableData = data.sort((a, b) => {
//         const aValue = (a as never)[sort.active];
//         const bValue = (b as never)[sort.active];
//         return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
//       });
//     }
//   }

//   public searchData(value: string): void {
//     this.dataSource.filter = value.trim().toLowerCase();
//     this.tableData = this.dataSource.filteredData;
//   }
//   isCollapsed: boolean = false;
//   toggleCollapse() {
//     this.sidebar.toggleCollapse();
//     this.isCollapsed = !this.isCollapsed;
//   }
//   public filter = false;
//   openFilter() {
//     this.filter = !this.filter;
//   }
//   public cartValue = [2,2,2,2,2,2,2,2];

//   public addPos(i: number): void {
//     this.cartValue[i]++;
//   }
//   public reducePos(i: number): void {
//     this.cartValue[i]--;
//   }
//   selectAll(initChecked: boolean) {
//     if (!initChecked) {
//       this.tableData.forEach((f) => {
//         f.isSelected = true;
//       });
//     } else {
//       this.tableData.forEach((f) => {
//         f.isSelected = false;
//       });
//     }
//   }
// }
