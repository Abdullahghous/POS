import { Component, OnInit } from '@angular/core';
import { HttpService,routes,SidebarService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrl: './purchase-order-list.component.scss'
})
export class PurchaseOrderListComponent implements OnInit {

  public routes = routes;
  itemDefs: any[] = [];
  parties: any[] = [];
  mills: any[] = [];
  allParties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  items:any[]= [];
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
    "company": {
        "id": "0",
        "name": ""
    },
    "branch": {
        "id": "0",
        "name": ""
    },
    "voucherStatus": {
        "id": "0",
        "name": ""
    },
    "pending": "true",
    "searchByDate": "4",
    fromDate: new Date().toISOString().substring(0, 10),
    toDate: new Date().toISOString().substring(0, 10),
    "accountCode": "0",
    "qty": "",
    "requestFromPjv": "0",
    "item": "0",
    // millKhata:"0",
    "paymentType": "0",
    "status": "0"
  }
  
  constructor(private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,){}
  ngOnInit(): void {
    this.getAll();
   
  }
  public filter = false;
  openFilter() {
    this.filter = !this.filter;
  }
  search(){
    this.apiService.post<any[]>('payables/purchase_order_list', this.purchaseOrder).subscribe((res:any[]) => {
      if (res) {
  
        this.items = res;
        debugger
        console.log(res ,'obnjjjjjj')
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

}
