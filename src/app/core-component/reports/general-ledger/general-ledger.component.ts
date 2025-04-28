import { Component ,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarService,routes,HttpService} from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-general-ledger',
  templateUrl: './general-ledger.component.html',
  styleUrl: './general-ledger.component.scss'
})
export class GeneralLedgerComponent implements OnInit {
  public routes = routes;
  itemDefs: any = [];
  parties: any[] = [];
  mills: any[] = [];
  allParties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  report: any = [];
  ledger:any[]=[];
  
  constructor(private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private route: ActivatedRoute
    ){
    }
    isCollapsed: boolean = false;
    toggleCollapse() {
      this.sidebar.toggleCollapse();
      this.isCollapsed = !this.isCollapsed;
    }
    public filter = false;
    openFilter() {
      this.filter = !this.filter;
    }
  ngOnInit(): void {
    this.getAll();
    this.route.queryParams.subscribe(params => {
      if (params['accountCode']) {
        this.obj.accountCode = params['accountCode'];
        this.detail.accountCode = params['accountCode']; // Get accountCode from URL
        this.onSave(); 
        this.search()// Call onSave to fetch the report
      }
    });
   
  }
 
  obj={
    "companyId": "0",
    "branchId": "0",
    "voucherStatusId": "0",
    "financialYearId": "5",
    "fromDate": new Date().toISOString().substring(0, 10),
    "toDate": new Date().toISOString().substring(0, 10),
    "accountCode": "",
    "paymentType": "0"
  };
  detail: any = {
    "companyIds": ["0"],
    "branchIds": ["0"],
    "financialYearId": "1",
    "fromDate": new Date().toISOString().substring(0, 10),
    "toDate":new Date().toISOString().substring(0, 10),
    "accountCode":"0"
  };
debitTotal: number = 0;
creditTotal: number = 0;
balanceTotal: number = 0;
bagsTotal: number = 0;
safiKgTotal: number = 0;
millTaxTotal: number = 0;
bankTaxTotal: number = 0;
freightTotal: number = 0;
silaiTotal: number = 0;
baradanaTotal: number = 0;
otherTotal: number = 0;

onSave() {
  this.apiService.post('reports/general_ledger', this.obj).subscribe((res) => {
    if (res) {
      this.report = res;
      this.tableFooter();
    }
  });
  }
  search() {
    this.apiService.post('reports/detail_general_ledger', this.detail).subscribe((res:any) => {
      if (res) {
        this.ledger = res;
        this.calculateTotals()
      }
    });
  }
  totalDebit: number = 0;
  totalCredit: number = 0;
  calculateTotals() {
    this.totalDebit = this.ledger.reduce((sum, data) => sum + data.debit, 0);
    this.totalCredit = this.ledger.reduce((sum, data) => sum + data.credit, 0);
    
  }
tableFooter(){
  this.debitTotal = this.calculateSum('debit');
  this.creditTotal = this.calculateSum('credit');
  // this.balanceTotal = this.calculateSum('balance');
  this.bagsTotal = this.calculateSum('bags');
  this.safiKgTotal = this.calculateSum('safiKg');
  this.millTaxTotal = this.calculateSum('millTax');
  this.bankTaxTotal = this.calculateSum('bankTax');
  this.freightTotal = this.calculateSum('freight');
  this.silaiTotal = this.calculateSum('silai');
  this.baradanaTotal = this.calculateSum('baradana');
  this.otherTotal = this.calculateSum('other');

}
calculateSum(column: string): number {
  // Debugging: Check if the data is numeric
  const sum = this.report.reduce((sum: number, current: any) => {
    const value = current[column];
    console.log(`${column}:`, value);  // Debugging line to check the value
    // Ensure the value is numeric, if not, set it to 0
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);

  console.log(`Total for ${column}:`, sum);  // Debugging line to check the final sum
  return sum;
}
balance=0;
getBalance(accountCode: string) {
  const selectedAccount = this.parties.find(party => party.code === accountCode);
  if (selectedAccount) {
    // Assuming closingBalance is a field of each account
    console.log('Closing Balance:', selectedAccount.closingBalance);
    this.balance = selectedAccount.closingBalance; // Or wherever you want to store this value
  } else {
    console.log('Account not found!');
    this.balance = 0; // Reset balance if account is not found
  }
}
dBalance=0;
getDBalance(accountCode: string) {
  const selectedAccount = this.parties.find(party => party.code === accountCode);
  if (selectedAccount) {
    // Assuming closingBalance is a field of each account
    console.log('Closing Balance:', selectedAccount.closingBalance);
    this.dBalance = selectedAccount.closingBalance; // Or wherever you want to store this value
  } else {
    console.log('Account not found!');
    this.dBalance = 0; // Reset balance if account is not found
  }
}
generatePDF() {
  const data = document.getElementById('table-to-pdf'); // The ID of the table

    if (data) {
    html2canvas(data).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      
      // Adjust the dimensions and positioning as needed
      const imgWidth = 190; // Set the width of the PDF
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      position += heightLeft;

      pdf.save('report.pdf'); // Name of the generated PDF
    });
    }
  }
  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.report);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'report.xlsx');
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

