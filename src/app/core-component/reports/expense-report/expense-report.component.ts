import { Component, Renderer2 } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService, HttpService, SidebarService, apiResultFormat, pageSelection } from 'src/app/core/core.index';
import { routes } from 'src/app/core/helpers/routes';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { DataService } from 'src/app/core/service/data/data.service';
import { expensereport } from 'src/app/shared/model/page.model';
import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';
interface data {
  value: string;
}

@Component({
  selector: 'app-expense-report',
  templateUrl: './expense-report.component.html',
  styleUrl: './expense-report.component.scss'
})
export class ExpenseReportComponent {
  itemDefs: any = [];
  parties: any[] = [];
  mills: any[] = [];
  allParties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  account:any[]=[]
  report:any[]=[]
  sumOpeningBalance: number = 0;
  sumDebit: number = 0;
  sumCredit: number = 0;
  sumDiff: number = 0;
  sumClosingBalance: number = 0;


  constructor(private sidebar:SidebarService,
    private allApiService:AllApiService,
    private apiService:HttpService
  ){
     this.getAll()
  }
  obj:any={
    "companyIds": [
        "0"
    ],
    "accountThirdLevel": null,
    "branchIds": [
        "0"
    ],
    "level": "4",
    "fromAccountCode": "0",
    "toAccountCode": "0",
    "voucherStatusId": "0",
    "financialYearId": "6",
    "fromDate": new Date().toISOString().substring(0, 10),
    "toDate": new Date().toISOString().substring(0, 10),
    "upperRange": "0",
    "lowerRange": "0"
  }
  level(id:any){
    this.apiService.getObservable<any[]>('reports/load_from_and_to_Accounts?level='+id).subscribe((res:any)=>{
      console.log('account level::',res);
      this.account=res
    })
    console.log('level::',id)
  }
  search() {
    this.apiService.post('reports/trial_balance', this.obj).subscribe((res: any) => {
      if (res) {
        this.report = res;
        this.flattenReport();
        this.calculateSums()
      }
    });
  }
  calculateSums() {
    this.sumOpeningBalance = 0;
    this.sumDebit = 0;
    this.sumCredit = 0;
    this.sumDiff = 0;
    this.sumClosingBalance = 0;

    this.report.forEach(data => {
      this.sumOpeningBalance += data.openingBalance || 0;
      this.sumDebit += data.debit || 0;
      this.sumCredit += data.credit || 0;
      this.sumDiff += data.diff || 0;
      this.sumClosingBalance += data.closingBalance || 0;
    });
  }

  flattenReport() {
    debugger
    let flattened: any = [];
  
    this.report.forEach(data => {
      flattened.push(data);
      data.backgroundColor = this.getBackgroundColor(data.level);
      if (data.children) {
        data.children.forEach((secondData: any) => {
          flattened.push(secondData);
          secondData.backgroundColor = this.getBackgroundColor(secondData.level);
          if (secondData.children) {
            secondData.children.forEach((thirdData: any) => {
              flattened.push(thirdData);
              thirdData.backgroundColor = this.getBackgroundColor(thirdData.level);
              if (thirdData.children) {
                thirdData.children.forEach((forthData: any) => {
                  flattened.push(forthData);
                  forthData.backgroundColor = this.getBackgroundColor(forthData.level);
                });
              }
            });
          }
        });
      }
    });
  
    this.report = flattened;
  }
  
  getBackgroundColor(level: number): string {
    debugger
    if (level === 1) {
      return 'lightgray';
    } else if (level === 2) {
      return 'lightblue';
    } else if (level === 3) {
      return 'lightgreen';
    } else if (level === 4) {
      return 'lightyellow';
    }
    return 'transparent';  // Default background
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
    },  
      this.financialYear[0]);
      this.obj.fromDate =maxFinancialYear.fromDate;
      this.obj.toDate =maxFinancialYear.toDate;
      this.obj.financialYearId =maxFinancialYear.id;
  
  }

}
