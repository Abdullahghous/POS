import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService, SidebarService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';

@Component({
  selector: 'app-trading-report',
  templateUrl: './trading-report.component.html',
  styleUrl: './trading-report.component.scss'
})
export class TradingReportComponent {
  //  public routes = routes;
    itemDefs: any = [];
    parties: any[] = [];
    mills: any[] = [];
    allParties:any[]= [];
    getBranches:any[]= [];
    getCompanies:any[]= [];
    millKhata:any[]=[]
    financialYear:any[]= [];
    tradingReport: any = [];
    
    constructor(private sidebar: SidebarService,
      private apiService: HttpService,
      private allApiService:AllApiService,
      private router:Router
      ){
        // const today = new Date();
        // this.obj.fromDate = today.toISOString().split('T')[0];
        // this.obj.toDate = today.toISOString().split('T')[0];
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
      "financialYearId": "6",
      "fromDate": new Date().toISOString().substring(0, 10),
      "toDate": new Date().toISOString().substring(0, 10),
      "itemDefId": null,
      "itemCategoryId": "0",
      "accountCode": "0",
      "serchByDate": "1",
      "voucherType": "0",
      "callingFrom": "trading",
      "dublicateFilter": "0",
      "millKhataId": "0",
      "millId": "0"
  }
  
  onSave() {
    
    this.apiService.post('reports/trading-report', this.obj).subscribe((res:any) => {
      if (res) {
        res.forEach((element:any) => {
          element.createdDate =  this.allApiService.formatDateDayMonthYear(element.createdDate);
          element.typeVoucher=this.splitFunctio(element.voucherCode)
        });
          this.tradingReport = res;
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
    
    viwoVoucher(id:any ,typeVoucher:any){
      console.log('voucher viwo',id ,typeVoucher);
      const url = this.router.createUrlTree(['/sales/direct-sales'], { queryParams: { id } });
      const fullUrl = window.location.origin + url.toString();
      console.log(fullUrl); 
      window.open(fullUrl, '_blank');
    }
    getAll(){
      
      let items: any = localStorage.getItem('itemDefs');
      let parties: any = localStorage.getItem('parties');
      let mills: any = localStorage.getItem('mills');
      let millKhata: any = localStorage.getItem('mills');
      let getBranches: any = localStorage.getItem('branch');
      let getCompanies: any = localStorage.getItem('companies');
      let financialYear: any = localStorage.getItem('financialYear');
      // console.log(getCompanies,'compnayyyy====8')
      if (items && parties && mills&&millKhata && getBranches && getCompanies && financialYear
         != null && JSON.parse(items).length != 0) {
        this.itemDefs = JSON.parse(items);
        this.parties =JSON.parse(parties);
        this.mills = JSON.parse(mills);
        this.millKhata = JSON.parse(millKhata); 
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
        this.allApiService.khata();
        millKhata = localStorage.getItem('mills');
        this.mills = JSON.parse(millKhata);
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
