import { Component , OnInit } from '@angular/core';
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
  obj={
    "companyId": "0",
    "branchId": "0",
    "voucherStatusId": "0",
    "financialYearId": "0",
    "fromDate": "2024-07-05",
    "toDate": "2024-09-07",
    "itemDefId": null,
    "itemCategoryId": "0",
    "accountCode": "0",
    "serchByDate": "1",
    "voucherType": "0"
}
onSave() {
  
  this.apiService.post('reports/purchase_report', this.obj).subscribe((res:any) => {
    if (res) {
      res.forEach((element:any) => {
        element.createdDate =  this.allApiService.formatDateDayMonthYear(element.createdDate);
      });
      this.purchaseReport = res;
      // console.log(res ,'obnjjjjjj')
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
    const maxFinancialYear = this.financialYear.reduce((maxYear, currentYear) => {
      // debugger
      return currentYear.id > maxYear.id ? currentYear : maxYear;
  }, this.financialYear[0]);
  this.obj.fromDate =maxFinancialYear.fromDate;
  this.obj.toDate =maxFinancialYear.toDate;
  this.obj.financialYearId =maxFinancialYear.id;
  }
}
