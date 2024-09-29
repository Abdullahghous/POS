import { Component,OnInit , ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { DataService,SidebarService,routes} from 'src/app/core/core.index';


import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';

import { HttpService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';


interface Company {
  id: number;
  name: string;
}


@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.scss'
})
export class SalesOrderComponent implements OnInit {
  initChecked = false;
  public routes = routes;
  // pagination variables
 
 public allParties:any[]= [];
 
 companies: Company[] = [];
 isButtonDisabled = false;
  itemDefs: any[] = [];
  parties: any[] = [];
  mills: any[] = [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  orderList:any=[];
  isCollapsed: boolean = false;

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private apiService: HttpService,
     private el: ElementRef,
     private allApiService:AllApiService
    
  ) {}


obj={
  "companyId": "1",
  "branchId": "26",
  "voucherStatusId": "0",
  "financialYearId": "5",
  millKhata:0,

  "fromDate": "2023-09-05",
  "toDate": "2024-09-05",
  "itemDefId": "0",
  "itemCategoryId": "0",
  "accountCode": "0",
  "serchByDate": "1",
  "voucherType": "0"
}
  payLoad=
  {
    "company": {
        "id": "1",
        "name": ""
    },
    "branch": {
        "id": "1",
        "name": ""
    },
    "voucherType": {
        "name": ""
    },
    "voucherStatus": {
        "id": "M",
        "name": ""
    },
    "voucherCode": "",
    "inventoryVoucherType": "SQV",
    "voucherNarration": "",
    "searchByDate": "3",
    "fromDate": "2024-07-22",
    "toDate": "2024-07-22",
    "postedUnPosted": "2"
  }
  
  ngOnInit(): void {
    this.getAll();
   
   
  }

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
    let getBranches: any = localStorage.getItem('getBranches');
    let getCompanies: any = localStorage.getItem('getCompanies');
    let financialYear: any = localStorage.getItem('financialYear');
    // console.log(getBranches,'mills====')
    if (items && parties && mills && getBranches && getCompanies && financialYear
       != null && JSON.parse(items).length != 0) {
      this.itemDefs = JSON.parse(items);
      this.parties =JSON.parse(parties);
      this.mills = JSON.parse(mills); 
      this.getBranches = JSON.parse(getBranches);
      this.getCompanies = JSON.parse(getCompanies);
      this.financialYear = JSON.parse(financialYear);
      debugger
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
      getBranches = localStorage.getItem('getBranches');
      this.getBranches = JSON.parse(getBranches);
      this.allApiService.getCompanies();
      getCompanies = localStorage.getItem('getCompanies');
      this.getCompanies = JSON.parse(getCompanies);
      this.allApiService.financialYear();
      financialYear = localStorage.getItem('financialYear');
      this.financialYear = JSON.parse(financialYear);
       debugger
    }
  }
   
  search() {
   
    this.apiService.post('receivables/sale_order_list', this.obj).subscribe(
        (res) => {
           this.orderList = res;
            console.log(res, 'looooog');
            
        },
       
    );
  }
 
}
