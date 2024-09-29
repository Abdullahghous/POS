import { Component, OnInit , ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { DataService,SidebarService,} from 'src/app/core/core.index';


import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';

import { HttpService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';


@Component({
  selector: 'app-voucher-detail-list',
  templateUrl: './voucher-detail-list.component.html',
  styleUrl: './voucher-detail-list.component.scss'
})
export class VoucherDetailListComponent implements OnInit {
  initChecked = false;
  // public routes = routes;
  // pagination variables
 
 public allParties:any[]= [];
 
 companies: any[] = [];
 isButtonDisabled = false;
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  voucher:any[]=[];
  isCollapsed: boolean = false;

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private apiService: HttpService,
     private allApiService:AllApiService
    
  ) {}


obj={
  "company": {
      "id": "1",
      "name": ""
  },
  "voucherType": {
      "id": "0",
      "name": ""
  },
  "voucherStatus": {
      "id": "M",
      "name": ""
  },
  "voucherCode": "",
  "voucherNarration": "",
  "searchByDate": "3",
  "fromDate": "2024-05-09",
  "toDate": "2024-09-09",
  "postedUnPosted": "2"
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
    
    
    let getBranches: any = localStorage.getItem('getBranches');
    let getCompanies: any = localStorage.getItem('getCompanies');
    let financialYear: any = localStorage.getItem('financialYear');
    console.log(getBranches,'milll====')
    if ( getBranches && getCompanies && financialYear
       != null && JSON.parse(getCompanies).length != 0) {
       
      this.getBranches = JSON.parse(getBranches);
      this.getCompanies = JSON.parse(getCompanies);
      this.financialYear = JSON.parse(financialYear);
      debugger
    }
    else{
     
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
   
    this.apiService.post<any[]>('vouchers/voucher_detail_list', this.obj).subscribe(
        (res:any[]) => {
           this.voucher = res;
            console.log(res, 'looooog');
            
        },
       
    );
  }
}
