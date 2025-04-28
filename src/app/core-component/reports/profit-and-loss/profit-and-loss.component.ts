import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/core.index';
import { SidebarService } from 'src/app/core/service/sidebar/sidebar.service';

@Component({
  selector: 'app-profit-and-loss',
  templateUrl: './profit-and-loss.component.html',
  styleUrl: './profit-and-loss.component.scss',
})
export class ProfitAndLossComponent {
  voucher1:any=[]
    getBranches:any[]= [];
    getCompanies:any[]= [];
    financialYear:any[]=[];
    // allApiService: any;
    
    constructor(
     public apiServise:HttpService,
     private sidebar:SidebarService,
    ){
      this.comBranches();
    }
    obj:any={
      "companyIds": [
        "0"
    ],
    "branchIds": [
        "0"
    ],
      "voucherStatusId": "0",
      "financialYearId": "6",
      "fromDate":"",
      "toDate":"",
  }
    totalCredit = 0;
    totalDebit = 0;
    search() {
      this.apiServise.post('reports/pl_report', this.obj).subscribe((res: any) => {
        this.voucher1 = res;
        
        // ڈیٹا چیک کریں
        console.log('voucher1 data:', this.voucher1);
        
        // this.voucher1.forEach((data:any) => {
        //   console.log('data.bold:', data.bold);  // دیکھیں `bold` پراپرٹی کیا ہے
        // });
      });
    }
    
    getClass(data: any): string {
      console.log('Checking data.bold:', data.bold);  // Debugging log
      return data.bold ? 'gray-background' : '';
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
      this.apiServise.getObservable('app/getAllYear').subscribe(
        (res: any) => {
         this.financialYear=res;
        }
      );
      // const maxFinancialYear = this.financialYear.reduce((maxYear, currentYear) => {
      //   debugger
      //   return currentYear.id > maxYear.id ? currentYear : maxYear;
      // },  
      // this.financialYear[0]);
      // this.obj.fromDate =maxFinancialYear.fromDate;
      // this.obj.toDate =maxFinancialYear.toDate;
      // this.obj.financialYearId =maxFinancialYear.id;
   }
   
}
