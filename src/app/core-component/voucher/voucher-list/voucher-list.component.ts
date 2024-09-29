import { Component,OnInit , ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { DataService,SidebarService,} from 'src/app/core/core.index';


import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';

import { HttpService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrl: './voucher-list.component.scss'
})
export class VoucherListComponent implements OnInit {
  initChecked = false;
  // public routes = routes;
  // pagination variables
 
 public allParties:any[]= [];
 
 companies: any[] = [];
 isButtonDisabled = false;
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  voucher:any=[];
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
  "companyId": "1",
  "branchId": "26",
  "voucherStatusId": "0",
  "financialYearId": "5",
  "fromDate": "2023-09-05",
  "toDate": "2024-09-05",
  "itemDefId": "0",
  "itemCategoryId": "0",
  "accountCode": "0",
  "serchByDate": "1",
  "voucherType": "0"
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
   
    this.apiService.post('vouchers/voucher_list', this.obj).subscribe(
        (res) => {
           this.voucher = res;
            console.log(res, 'looooog');
            
        },
       
    );
  }
}
