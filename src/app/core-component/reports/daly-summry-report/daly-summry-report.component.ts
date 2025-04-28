import { ChangeDetectionStrategy, Component ,OnInit} from '@angular/core';
import { HttpService, SidebarService } from 'src/app/core/core.index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daly-summry-report',
  templateUrl: './daly-summry-report.component.html',
  styleUrl: './daly-summry-report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DalySummryReportComponent implements OnInit {
  voucher1:any[]=[]
  getBranches:any[]= [];
  getCompanies:any[]= [];
  // allApiService: any;
  
  constructor(
   public apiServise:HttpService,
   private sidebar:SidebarService,
   private router: Router,
  ){
    this.comBranches();
  }
  obj:any={
    "companyId": "0",
    "branchId": "0",
    "voucherStatusId": "0",
    "summaryDate":new Date().toISOString().substring(0, 10),
  }
  totalCredit = 0;
  totalDebit = 0;
  search() {
    this.apiServise.post('reports/daily_summary_report', this.obj).subscribe((res: any) => {
      this.voucher1 = res;
  
      // Calculate totalDebit and totalCredit by iterating through voucher1 and its children
      this.totalDebit = 0;
      this.totalCredit = 0;
  
      // Loop through each voucher and its children to sum debit and credit
      this.voucher1.forEach((voucher: any) => {
        voucher.children.forEach((data: any) => {
          this.totalDebit += data.debit || 0;
          this.totalCredit += data.credit || 0;
        });
      });
  
      console.log('account', res);
    });
  }
  ngOnInit(): void {
    console.log(this.voucher1);  // Check the structure of voucher1
    this.voucher1.forEach(voucher => {
      console.log(voucher);  // Log each voucher
      voucher.children.forEach((child:any) => {
        console.log(child);  // Log each child voucher
      });
    });
  }
  viwoVoucher(id:any ){
    console.log('voucher viwo',id );
    const url = this.router.createUrlTree(['/voucher/voucher-detail-list'], { queryParams: { id } });
    const fullUrl = window.location.origin + url.toString();
    console.log(fullUrl); 
    window.open(fullUrl, '_blank');
  }
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  public comBranches():void {
    this.apiServise.getObservable('app/getAllbranch').subscribe(
      (res: any) => {
       this.getBranches=res;
      }
    );
    this.apiServise.getObservable('app/getAllCompany').subscribe(
      (res: any) => {
       this.getCompanies=res;
      }
    );
  }
  
}
