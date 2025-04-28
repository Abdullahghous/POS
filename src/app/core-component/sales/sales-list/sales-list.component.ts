import { Component ,OnInit } from '@angular/core';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { routes, SidebarService } from 'src/app/core/core.index'; 
import { HttpService } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.scss',
  providers: [DatePipe],
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
  voucherDetailList:any[]=[];
  searchQuery: string = '';
  filteredReport: any[] = [];
  hideFirstTwoRows: boolean = false;
  // public loginBtnDisable: boolean = false;
  // public loginBtnText: string = 'Search';
  
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
        "name": "0"
    },
    "voucherCode": "",
    "inventoryVoucherType": "SJV",
    "searchByDate": "2",
    "fromDate": "",
    "toDate": "",
    "postedUnPosted": "2"
  }
  voucher:any= null;
  item:any=[
  //   {
  //   "conversionValue": 0,
  //   "conversionName": "",
  //   "unitName": "",
  //   "unitValue": 1,
  //   "openingRate": "0",
  //   "openingQty": "0"
  //  }
  ]
  constructor(
    private allApiService:AllApiService,
    private sidebar: SidebarService,
    private apiService: HttpService,
    private snackBarService:SnackBarService,
    private router:Router,
    private route: ActivatedRoute,
  ) {
    const today = new Date();
    this.obj.fromDate = today.toISOString().split('T')[0];
    this.obj.toDate = today.toISOString().split('T')[0];
  }
  search(){
    debugger
    this.apiService.post('receivables/inventory_voucher_list', this.obj).subscribe((res:any) => {
      if (res) {
        const result = res.voucherDetailList.map((item:any) =>({
          ...item,
          date: this.allApiService.formatDateDayMonthYear(item.updatedAt),
          typeVoucher:this.splitFunctio(item.voucherCode)
        }))
        this.voucherDetailList = result;
        this.filteredReport = result;
        this.totalAmount = this.filteredReport.reduce((sum, data) => sum + (data.voucherAmount || 0), 0);
        console.log(result ,res,'oggggggg===')
      //
      }
    });
  }
// currentPage: number = 1;
// itemsPerPage: number = 10;

// // This will give you the current page's slice
// get paginatedReport() {
//   const start = (this.currentPage - 1) * this.itemsPerPage;
//   return this.filteredReport.slice(start, start + this.itemsPerPage);
// }

// // Optional: total pages
// get totalPages() {
//   return Math.ceil(this.filteredReport.length / this.itemsPerPage);
// }
  totalAmount=0

  splitFunctio(  voucherCode:any){
    let splitValue: string[] = voucherCode.split('-');
  let firstPart: string = splitValue[0];
  return firstPart;
  }
  openModel() {
    this.apiService.getObservable('app/new_voucher/SQV?markeit=markeit').subscribe(
      (res:any) => {
        console.log(res, 'looooogSjv');
        this.voucher = res; 
          
         
           if (res.itemStock) {
            res.itemStock.account = res.itemStock.account || { code: 0 };
            
          }
          this.hideFirstTwoRows = true;
      },
    
  );
  }
  public getItemById(itemDefId: any, rowIndex: number) {
    // console.log('Selected ItemDefId:', itemDefId); 
    this.apiService.getObservable(`app/item_def_detail?itemDefId=${itemDefId}&branchId=0&companyId=0&voucherStatusId=0`).subscribe(
      (res: any) => {
        // console.log('Fetched Item Details:', res);
        const selectedItem = res;
        if (selectedItem) {
          const updatedItem = {
            ...this.voucher.itemStock.itemStockEntries[rowIndex], 
            itemDef: selectedItem,  
            openingQty: selectedItem.openingQty || '0', 
            openingRate: selectedItem.openingRate || '0' , 
            
          };
          this.voucher.itemStock.itemStockEntries[rowIndex] = updatedItem;
          console.log('this.item Item Details:',this.voucher.itemStock.itemStockEntries);
        }
      },
      (error) => {
        // console.log('Error fetching item details:', error);
      }
    );
  }
  account(data:any){
    console.log('party account' , data)
   }
  addVoucher() {
    debugger
    const accountCode = this.voucher.itemStock.account.code;

    // Check if account code is zero
    if (accountCode === 0) {
      this.snackBarService.showError('Please fill Select Party fields!');
        return; 
    }

    const isValid = this.voucher.itemStock.itemStockEntries.every((item: any) => {
        const { itemQuantity, price, itemDef } = item;
        return (
          itemQuantity != null && 
          itemQuantity> 0 &&
            price > 0 &&     
            itemDef.id > 0
        );
    });

    if (!isValid) {
        this.snackBarService.showError('Please fill in all required fields!');
        return;
    }
    this.apiService.post('sale-quantity/add-or-update-voucher', this.voucher).subscribe(
        (res) => {
            console.log(res, 'looooog');
            document.getElementById('close')?.click()
            if (res) {
              this.snackBarService.showSuccess('Voucher Added Successfully!');
              // this.newVoucher();
            } else {
              this.snackBarService.showError('Please fill all the required fields!');
            }
          },
          (error) => {
            this.snackBarService.showError('An error occurred while adding the record!');
          }
    );
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id']; 
      const typeVoucher = params['typeVoucher']; 
      if (id && typeVoucher) {
        this.viwoVoucher(id, typeVoucher); 
      }
    });
    this.getAll();
   
  }
  runTimeChange(row:any){
    console.log( 'looooog',row.unitValue); 
     if(row.unitValue > 1) {
        row.price =row.price / row.unitValue
        console.log( 'if',row.price);
      }else{
        row.price = row.price * row.itemDef.conversionValue;
        console.log( 'price',row.price); 
        console.log( 'conversionValue',row.itemDef.conversionValue);
      } 
    this.calculate() 
  } 
  total=0;
  qty=0;
  exp=0;
  calculate() {
    this.total = 0; 
    this.qty = 0;
    this.exp = 0;
    this.voucher.itemStock.itemStockEntries.forEach((row: any) => 
     { row.amount = row.itemQuantity * row.price;
      this.total += Number(row.amount);
      this.qty += Number(row.itemQuantity)
      }); 
      this.voucher.voucherEntries.forEach((item:any) => {
        if (item.operator === '+') {
          item.amount = this.qty *item.rate; 
          this.exp = item.amount
        } else if (item.operator === '-') {
          item.amount = item.rate; 
          this.exp -= item.amount
        }
      });
      let netAmount = this.total;
      let otherExp = this.voucher.itemStock.otherExp || 0; 
      let freightCharges = this.voucher.itemStock.freightCharges || 0; 
      netAmount += this.exp;
      this.voucher.itemStock.netAmount = netAmount; 
      this.voucher.itemStock.freightCharges = freightCharges; 
      this.voucher.itemStock.otherExp = otherExp; 
  } 
  addNewRow() {
    
    this.voucher.itemStock.itemStockEntries.push({
      itemDef: { id: 0, name: '',openingQty:'',openingrate:'',conversionValue:'',unitValue:'' },
      openingQty: 0,
      openingRate: 0,
      itemQuantity: '',
      price:0,
      unitValue:'',
      amount:0,
    });
  }
  viwoVoucher(id:any,typeVoucher:any){
  debugger
    if (typeVoucher==="SJV") {
      this.apiService.getObservable(`app/purchase_journal_vouchers/${id}`).subscribe(
          (res: any) => {
              console.log('voucher', res);
              this.voucher = res;
              this.model(); 
          },
          error => {
              console.error('Error fetching vouchers:', error);
          }
      );
    } if(typeVoucher === "SQV" || typeVoucher === "PQV") {
      this.apiService.getObservable(`app/purchase_journal_vouchers/${id}`).subscribe((res:any)=>{
        document.getElementById('veiwOpenSqv')?.click();
        this.voucher= res;
        console.log('view sqv voucher',res)
       })
      console.log('voucher id.' ,id);
    }
  }
  ledger(accountCode:any){
    // console.log('ledger',accountCode);
    const url = this.router.createUrlTree(['/reports/general-ledger'], { queryParams: { accountCode } });
    const fullUrl = window.location.origin + url.toString();
    // console.log(fullUrl); // Log the full URL to check it
    window.open(fullUrl, '_blank');
  }
  model(){
    document.getElementById('openviewvoucher')?.click();
  }
  editVoucher(id:any,typeVoucher:any){
    debugger
    if(typeVoucher==="SJV"){
      console.log('voucher ===view',id);
    const url = this.router.createUrlTree(['/sales/sale-voucher'], { queryParams: { id } });
    const fullUrl = window.location.origin + url.toString();
    console.log(fullUrl); // Log the full URL to check it
    window.open(fullUrl, '_blank');
    }
    if(typeVoucher==="SQV"){
      this.apiService.getObservable(`app/purchase_journal_vouchers/${id}`).subscribe((res:any)=>{
        document.getElementById('open-sqv')?.click();
        this.voucher= res;
        console.log('editvoucher',res);
        this.calculate()
       })
    }
  }
  deleteRow(i: any) {
    if (this.voucher.itemStock.itemStockEntries.length > 1) {
      this.voucher.itemStock.itemStockEntries.splice(i, 1);
    }
  }

 
  filterByName() {
    console.log('Search Query:', this.searchQuery);
    if (this.searchQuery) {
        this.filteredReport = this.voucherDetailList.filter((item) => 
            item.accountName && item.accountName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        console.log('Filtered Results:', this.filteredReport);
    } else {
        this.filteredReport = this.voucherDetailList;
    }
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
