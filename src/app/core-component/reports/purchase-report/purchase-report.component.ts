import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService,routes,HttpService} from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';


@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrl: './purchase-report.component.scss',
})
export class PurchaseReportComponent implements OnInit {
  public routes = routes;
  itemDefs: any = [];
  parties: any[] = [];
  mills: any[] = [];
  allParties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  purchaseReport: any = [];
  
  constructor(private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private router:Router
    ){
      const today = new Date();
      this.obj.fromDate = today.toISOString().split('T')[0];
      this.obj.toDate = today.toISOString().split('T')[0];
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
  ngOnInit(): void {
    this.getAll();
   
  }
  // public searchData(value: string): void {
  //   this.dataSource.filter = value.trim().toLowerCase();
  //   this.tableData = this.dataSource.filteredData;
  // }
  obj:any={
    "companyId": "0",
    "branchId": "0",
    "voucherStatusId": "0",
    "financialYearId": "0",
    "fromDate": "",
    "toDate": "",
    "itemDefId": "0",
    "itemCategoryId": "0",
    "accountCode": "0",
    "serchByDate": "1",
    "voucherType": "0"
  }
    sqvSearch(obj: any) {
      if (obj.voucherType === "PQV") {
        obj.callingFrom = "detailSearch";  // Add callingFrom if voucherType is "SQV"
        document.getElementById('pills-list-tab')?.click();
      } else {
        delete obj.callingFrom;  // Remove callingFrom if voucherType is not "SQV"
        document.getElementById('pills-home-tab')?.click();;
      }
    
      this.onSave(obj);  // Passing obj directly to onSave
      return obj;
    }
    onSave(obj: any) {
  
  this.apiService.post('reports/purchase_report', this.obj).subscribe((res:any) => {
    if (res) {
      res.forEach((element:any) => {
        element.createdDate =  this.allApiService.formatDateDayMonthYear(element.createdDate);
        element.typeVoucher=this.splitFunctio(element.voucherCode)
      });
        this.purchaseReport = res;
        console.log('purchase report ::',res)
      //
      }
    });
  
  }
  splitFunctio(  voucherCode:any){
    let splitValue: string[] = voucherCode.split('-');
  let firstPart: string = splitValue[0];
  return firstPart;
  }
  editVoucher(idN:any){
    console.log('voucher ===view',idN);
    const url = this.router.createUrlTree(['/purchase/purchase-voucher'], { queryParams: { idN } });
    const fullUrl = window.location.origin + url.toString();
    console.log(fullUrl); 
    window.open(fullUrl, '_blank');
  }
  viwoVoucher(id:any ,typeVoucher:any){
    if(typeVoucher=='PJV'){
      console.log('voucher viwo',id );
      const url = this.router.createUrlTree(['/purchase/purchase-list'], { queryParams: { id ,typeVoucher} });
      const fullUrl = window.location.origin + url.toString();
      console.log(fullUrl); 
      window.open(fullUrl, '_blank');
    }
    if(typeVoucher=='PTV'){
      console.log('voucher viwo',id );
      const url = this.router.createUrlTree(['/sales/direct-sales'], { queryParams: { id } });
      const fullUrl = window.location.origin + url.toString();
      console.log(fullUrl); 
      window.open(fullUrl, '_blank');
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
    const maxFinancialYear = this.financialYear.reduce((maxYear, currentYear) => {
      // debugger
      return currentYear.id > maxYear.id ? currentYear : maxYear;
  }, this.financialYear[0]);
  // this.obj.fromDate =maxFinancialYear.fromDate;
  // this.obj.toDate =maxFinancialYear.toDate;
  this.obj.financialYearId =maxFinancialYear.id;
  }
}
