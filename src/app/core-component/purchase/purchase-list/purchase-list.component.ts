import { Component , OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
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
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

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
  voucher1:any=[];
  item:any={
    "conversionValue": 0,
    "conversionName": "",
    "unitName": "",
    "unitValue": 0,
  }
  hideFirstTwoRows: boolean = false;
  //** / pagination variables

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private snackBarService:SnackBarService,
    private route: ActivatedRoute,
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
  voucher:any=null;
 
  obj={
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
    "inventoryVoucherType": "PJV",
    "searchByDate": "1",
    "fromDate": new Date().toISOString().substring(0, 10),
    "toDate": new Date().toISOString().substring(0, 10),
    "postedUnPosted": "2"
}
search(){
  this.apiService.post('receivables/inventory_voucher_list', this.obj).subscribe((res:any) => {
    if (res) {
      const result = res.voucherDetailList.map((item:any) =>({
        ...item,
         typeVoucher:this.splitFunctio(item.voucherCode),
        date: this.allApiService.formatDateDayMonthYear(item.updatedAt)
      }))
      this.voucher1 = result;
      console.log('pppppplisttt===',result);
      this.totalAmount = this.voucher1.reduce((sum:any, data:any) => sum + (data.voucherAmount || 0), 0);
    //
    }
  });
}
totalAmount = 0;
splitFunctio(  voucherCode:any){
  let splitValue: string[] = voucherCode.split('-');
let firstPart: string = splitValue[0];
return firstPart;
}
openModel() {
  this.apiService.getObservable('app/new_voucher/PQV?markeit=markeit').subscribe(
    (res:any) => {
      console.log('new====pjv',res);
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
cancle(){
  this.total=0;
  this.qty=0;
  this.exp=0; 
}
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

updateNetAmount() {
 
}
addVoucher() {
  // debugger
  const accountCode = this.voucher.itemStock.account.code;
    if (accountCode === 0) {
      this.snackBarService.showError('Please fill Select Party fields!');
        return; 
    }
    const isValid = this.voucher.itemStock.itemStockEntries.every((item: any) => {
        const { itemQuantity, price, itemDef } = item;
        return (
          itemQuantity != null && 
          itemQuantity > 0 &&
            price > 0 &&     
            itemDef.id > 0
        );
    });
  if (!isValid) {
    this.snackBarService.showError('Please  required fields input!');
    return;
  }
  this.voucher.itemStock.itemStockEntries.forEach((row: any) => {
    row.transactionType = "in";
});
  debugger
  this.apiService.post('app/add_or_update_voucher', this.voucher).subscribe(
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
modelview(){
  document.getElementById('openvoucher')?.click();
}
viwoVoucher(id:any,typeVoucher:any){
  // debugger
  if (typeVoucher === "PJV") {
    this.apiService.getObservable(`app/purchase_journal_vouchers/${id}`).subscribe(
        (res: any) => {
            console.log('veiw voucher pjv', res);
            this.voucher = res;
            this.model(); 
        },
        error => {
            console.error('Error fetching vouchers:', error);
        }
    );
  } else if(typeVoucher === "PQV" ) {
    this.apiService.getObservable(`app/purchase_journal_vouchers/${id}`).subscribe((res:any)=>{
      document.getElementById('open-qty')?.click();
      this.voucher= res;
      console.log('view voucher pqv',res);
     })
    console.log('voucher id.' ,id);
  }
}
model(){
  document.getElementById('voucher-pjv')?.click();
}
editVoucher(id:any,typeVoucher:any){
  // let idN = id.id
  debugger
  console.log('voucherType ===edit',typeVoucher );
  if (typeVoucher === "PJV") {
    debugger
    const url = this.router.createUrlTree(['/purchase/purchase-voucher'], { queryParams: { id } });
    const fullUrl = window.location.origin + url.toString();
    console.log(fullUrl); 
    console.log('pjv',typeVoucher)
    window.open(fullUrl, '_blank');
  } else if(typeVoucher === "PQV"){
    document.getElementById('purchaseVoucher')?.click();
    this.apiService.getObservable(`app/purchase_journal_vouchers/${id}`).subscribe((res:any)=>{
     this.voucher= res;
     console.log('editvoucher',res)
     this.calculate()
    })
    console.log('voucher code::' ,id);
  }
}
ledger(accountCode:any){
  console.log('ledger',accountCode);
  const url = this.router.createUrlTree(['/reports/general-ledger'], { queryParams: { accountCode } });
  const fullUrl = window.location.origin + url.toString();
  console.log(fullUrl); // Log the full URL to check it
  window.open(fullUrl, '_blank');
}
deleteRow(i: any) {
  if (this.voucher.itemStock.itemStockEntries.length > 1) {
    this.voucher.itemStock.itemStockEntries.splice(i, 1);
  }
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
