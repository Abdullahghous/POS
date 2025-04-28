import { Component,OnInit , ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService,SidebarService,} from 'src/app/core/core.index';


import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';
import { DatePipe } from '@angular/common';
import { HttpService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrl: './voucher-list.component.scss',
  providers: [DatePipe]
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
    private route: ActivatedRoute,
    private router: Router,
    private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private datePipe: DatePipe
  ) {
    this.route.queryParams.subscribe(params => {
      const id = params['id']; 
      // const typeVoucher = params['typeVoucher']; 
      console.log('id',id)
      if (id ) {
        this.viwoVoucher(id); 
      }
    });
  }


  obj={
    "company": {
        "id": "0",
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
    "fromDate":  new Date().toISOString().substring(0, 10) ,
    "toDate":  new Date().toISOString().substring(0, 10) ,
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
      //  debugger
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
  
  viwoVoucher(id:any){
    console.log('view voucvhermmmmmmmmmm', id);
    document.getElementById('voucher-view')?.click();
    this.apiService.getObservable('vouchers/'+id).subscribe((res) => {
      // document.getElementById('voucher-view')?.click();
      this.voucher = res;
      console.log('edit voucvher', res);
            
    });
  }
}
