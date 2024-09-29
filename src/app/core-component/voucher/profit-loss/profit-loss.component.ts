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
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrl: './profit-loss.component.scss'
})
export class ProfitLossComponent  implements OnInit {
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
  report:any=[];
  isCollapsed: boolean = false;
  searchQuery: string = ''; // Holds search input
  filteredReport: any[] = [];
  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private apiService: HttpService,
     private el: ElementRef,
     private allApiService:AllApiService
    
  ) {}


obj:any='';

  
  ngOnInit(): void {
    this.getAll();
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10); // yyyy-MM-dd format

    // Initialize your object with dynamic fromDate and toDate
    this.obj = {
      companyId: "0",
      branchId: "0",
      voucherStatusId: "0",
      financialYearId: "0",
      fromDate: formattedDate,  // Set to today's date
      toDate: formattedDate,    // Set to today's date
      itemDefId: 0,
      itemCategoryId: "0",
      accountCode: "0",
      serchByDate: "0"
    };
   
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
    console.log(getBranches,'milll====')
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
   
    this.apiService.post<any[]>('reports/profit&loss', this.obj).subscribe(
        (res:any[]) => {
           this.report = res;
           this.filteredReport = res;
            console.log(res, 'looooog');
            
        },
       
    );
  }
  filterByName() {
    if (this.searchQuery) {
      this.filteredReport = this.report.filter((item: any) =>
        item.accountName && item.accountName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredReport = this.report;
    }
  }
 
}
