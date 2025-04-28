import { Component,OnInit , ElementRef } from '@angular/core';
import { HttpService,routes,SidebarService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
@Component({
  selector: 'app-supplier-status-report',
  templateUrl: './supplier-status-report.component.html',
  styleUrl: './supplier-status-report.component.scss',
})
export class SupplierStatusReportComponent {
 itemDefs: any[] = [];
  parties: any[] = [];
  mills: any[] = [];
  allParties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  list:any = []
  public routes = routes;
  isCollapsed: boolean = false;
  constructor(
    private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private el: ElementRef,
  ) {}
  
  obj:any={
    "companyId": "0",
    "branchId": "0",
    "voucherStatusId": "M",
    "financialYearId": "",
    "fromDate": "",
    "toDate": "",
}
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  ngOnInit(): void {
    this.getAll();
   
  }
  public filter = false;
  openFilter() {
    this.filter = !this.filter;
  }
 
  search(){
    // console.log(data , 'paaaaaaac')
    this.apiService.post('reports/supplier_status_report', this.obj).subscribe(
      (res) => {
       console.log('supplier status::',res);
        this.list=res; 
      }
      
    );
    
  } 
  getAll(){
    
    let items: any = localStorage.getItem('itemDefs');
    let parties: any = localStorage.getItem('parties');
    let mills: any = localStorage.getItem('mills');
    let getBranches: any = localStorage.getItem('branch');
    let getCompanies: any = localStorage.getItem('companies');
    let financialYear: any = localStorage.getItem('financialYear');
    // console.log(parties,'party')
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
    },  
    this.financialYear[0]);
    this.obj.fromDate =maxFinancialYear.fromDate;
    this.obj.toDate =maxFinancialYear.toDate;
    this.obj.financialYearId =maxFinancialYear.id;
  
  } 
}