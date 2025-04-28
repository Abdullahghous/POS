import { Component, OnInit } from '@angular/core';
import { HttpService,routes,SidebarService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';


@Component({
  selector: 'app-pre-purchase-report',
  templateUrl: './pre-purchase-report.component.html',
  styleUrl: './pre-purchase-report.component.scss'
})
export class PrePurchaseReportComponent implements OnInit {

  public routes = routes;
  itemDefs: any[] = [];
  parties: any[] = [];
  mills: any[] = [];
  allParties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  items:any[]= [];
  millKhata:any=[];
  // item: any = {
  //   itemSubCategory: {
  //     account: { code: 0, id: 0 },
  //     itemDefs: [],
  //     silaiRate: 0,
  //   },
  //   company: { id: 0 },
  //   branch: { id: 0 },
  //   financialYear: { id: 4 }
  // }
  
  purchaseOrder = {
    "companyId": "0",
    "branchId": "0",
    "voucherStatusId": "",
    "financialYearId": "6",
    "fromDate": "2024-09-01",
    "toDate": "2024-09-30",
    "itemDefId": "0",
    "millId": "0",
    "accountCode": "0",
    "serchByDate": "1",
    "sellerAccountCode": "0",
    "millKhataId": "0",
    "status": "0",
    "paymentType": "0"
}
  
  constructor(private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,){
      const today = new Date();
      this.purchaseOrder.fromDate = today.toISOString().split('T')[0];
      this.purchaseOrder.toDate = today.toISOString().split('T')[0];
    }
  ngOnInit(): void {
    
    this.getAll();
   
  }
  khata(){
    this.apiService.getObservable('app/getMillKhate').subscribe((res:any)=>{
      this.millKhata= res;
      console.log('millkhata',res)
    })
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
  search(){
    this.apiService.post<any[]>('reports/pre_purchase_report', this.purchaseOrder).subscribe((res:any[]) => {
      if (res) {
  
        this.items = res;
        debugger
        console.log(res ,'preeeeeprrrrrchaze===')
      //
      }
    });
  }
  editWeight(edit:any){ 
    // edit.thekedar ={"id":0}
    this.purchaseOrder =edit;
    debugger
    console.log(this.purchaseOrder,"edidttttttt");
  }
  getAll(){
    
    let items: any = localStorage.getItem('itemDefs');
    let parties: any = localStorage.getItem('parties');
    let mills: any = localStorage.getItem('mills');
    let getBranches: any = localStorage.getItem('branch');
    let getCompanies: any = localStorage.getItem('companies');
    let financialYear: any = localStorage.getItem('financialYear');
    console.log(this.mills,'millls====8')
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
      //  debugger
    }
    const maxFinancialYear = this.financialYear.reduce((maxYear, currentYear) => {
      // debugger
      return currentYear.id > maxYear.id ? currentYear : maxYear;
  }, this.financialYear[0]);
  this.purchaseOrder.fromDate =maxFinancialYear.fromDate;
  this.purchaseOrder.toDate =maxFinancialYear.toDate;
  this.purchaseOrder.financialYearId =maxFinancialYear.id;
  }
}
