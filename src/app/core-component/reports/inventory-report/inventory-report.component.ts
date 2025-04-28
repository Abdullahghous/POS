import { Component } from '@angular/core';
import { HttpService, SidebarService} from 'src/app/core/core.index';
import { routes } from 'src/app/core/helpers/routes';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';


@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrl: './inventory-report.component.scss'
})
export class InventoryReportComponent {
  itemDefs: any = [];
   parties: any[] = [];
   mills: any[] = [];
   allParties:any[]= [];
   getBranches:any[]= [];
   getCompanies:any[]= [];
   financialYear:any[]= [];
   report:any[]=[];
   account:any=[];
   sumOpeningBalance: number = 0;
   sumDebit: number = 0;
   sumCredit: number = 0;
   sumDiff: number = 0;
   sumClosingBalance: number = 0;
 
 
   constructor(private sidebar:SidebarService,
     private allApiService:AllApiService,
     private apiService:HttpService
   ){
      this.getAll();
      this.onChangeLevelOne()
   }
   obj:any={
    "companyIds": [
        "0"
    ],
    "branchIds": [
        "0"
    ],
    "voucherStatusId": "0",
    "financialYearId": "1",
    "fromDate": "2024-05-30",
    "toDate": "2025-09-01",
    "accountCode": "22"
}
  search() {
    this.apiService.post('reports/monthly_breakup_report', this.obj).subscribe((res: any) => {
      if (res) {
      this.report = res;
      console.log('repot',res)
      // Calculate total closing balance for each row
      this.report.forEach((data: any) => {
        data.totalClosingBalance = this.getTotalClosingBalance(data);  // Add calculated total to each row
      });
    }
    });
  }
  getColumnSum(column: string): number {
    return this.report.reduce((sum, data) => sum + (data[column] || 0), 0);
  }
  getTotalClosingBalanceSum(): number {
    return this.report.reduce((sum, data) => sum + this.getTotalClosingBalance(data), 0);
  }
   onChangeLevelOne() {
    this.apiService.getObservable<any[]>('accounts/one_level_accounts').subscribe((res: any[]) => {
      this.account = res;
      console.log('level====1',res);
      // const level = this.levelOneData.accountLevelResults.find((l: any) => l.code == value);
      // this.selectedLevelOne = `${level?.code} ${level?.name}`; 
      
    });
  }
  getTotalClosingBalance(data: any): number {
    return (Number(data['7']) || 0) + (Number(data['8']) || 0) + (Number(data['9']) || 0) +
           (Number(data['10']) || 0) + (Number(data['11']) || 0) + (Number(data['12']) || 0) + 
           (Number(data['1']) || 0) + (Number(data['2']) || 0) + (Number(data['3']) || 0) + 
           (Number(data['4']) || 0) + (Number(data['5']) || 0) + (Number(data['6']) || 0);
  }
   public filter = false;
   openFilter() {
     this.filter = !this.filter;
   }
   isCollapsed: boolean = false;
   toggleCollapse() {
     this.sidebar.toggleCollapse();
     this.isCollapsed = !this.isCollapsed;
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
   }, this.financialYear[0]);
   this.obj.fromDate =maxFinancialYear.fromDate;
   this.obj.toDate =maxFinancialYear.toDate;
   this.obj.financialYearId =maxFinancialYear.id;
   
   }
}
