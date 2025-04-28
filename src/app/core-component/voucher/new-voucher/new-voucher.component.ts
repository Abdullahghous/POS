import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { id_ID } from 'ng-zorro-antd/i18n';
import { HttpService,routes,SidebarService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-new-voucher',
  templateUrl: './new-voucher.component.html',
  styleUrl: './new-voucher.component.scss'
})
export class NewVoucherComponent implements OnInit {
  public allParties:any[]= [];
   
   companies: any[] = [];
   isButtonDisabled = false;
    getBranches:any[]= [];
    getCompanies:any[]= [];
    financialYear:any[]= [];
    voucherList:any[]=[];
    isCollapsed: boolean = false;
    itemDefs: any[] = [];
    parties:any[]=[]
    mills:any=[] // Define the itemDefs array
    selectedItem: any | null = null;
    totalsValid: boolean = true;
    public routes = routes;
  constructor(
    private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private snackBarService:SnackBarService
  ) {}
  voucher:any={
    "company": {
      "id": 1
    },
    "id": 0,
    "voucherType": {
      "id": ""
    },
    "voucherStatus": {
      "id": ""
    },
    "financialYear": {
      "id": 6
    },
    "voucherDate": new Date().toISOString().substring(0, 10) ,
    "voucherCode": "",
    "voucherNarration": "",
    "paymentType": "0",
    "voucherEntries": [{
      "id": 0,
      "sequence": 1,
      "lockLine": false,
      branch: 0,
      account: {
      code: "0"
      },
      narration: "",
      thirdParty: {
        code: "0"
      },
      recBookPageNumber: 0,
      invoiceNumber: 0,
      recBookNumber: 0
    },
    {
      "id": 0,
      "sequence": 2,
      "lockLine": false,
      branch: 0,
      account: {
      code: "0"
      },
      narration: "",
      thirdParty: {
        code: "0"
      },
      recBookPageNumber: 0,
      invoiceNumber: 0,
      recBookNumber: 0
    }
      
    ]
  }
 
  
    ngOnInit(): void {
    this.getAll();
    // this.openVoucher()
   
  }
  openVoucher(){
    this.voucher={
      "company": {
        "id": 1
      },
      "id": 0,
      "voucherType": {
        "id": ""
      },
      "voucherStatus": {
        "id": "M"
      },
      "financialYear": {
        "id": 5
      },
      "voucherDate": new Date().toISOString().substring(0, 10) ,
      "voucherCode": "",
      "voucherNarration": "",
      "paymentType": 0,
      "voucherEntries": [{
        "id": 0,
        "sequence": 1,
        "lockLine": false,
        "branch": 0,
        "account": { code: "0"},
        "narration": "",
        "chequeNumber": "",
        "recBookPageNumber": "",
        "invoiceNumber": "",
        "recBookNumber": 0,
      },
      {
        "id": 0,
        "sequence": 2,
        "lockLine": false,
        "branch": 0,
        "account": {code: "0"},
        "narration": "",
        "chequeNumber": "",
        "recBookPageNumber": "",
        "invoiceNumber": "",
        "recBookNumber": 0
      }
        
    ]
  }}
  onchange(id: any) {
    let code = { ...this.voucher };  
    code.voucherEntries = [];
    // console.log('Before API call:', this.voucher1);
    this.apiService.post('vouchers/next_voucher_code', code).subscribe((res: any) => {
      this.voucher.voucherCode = res.nextVoucherCode;
    });
  }
  isFormValid(): boolean {
    debugger
     const entriesValid = this.voucher.voucherEntries.every((entry: any) => {
      if (entry.branch === 0) {
        this.snackBarService.showError('Please select a valid branch!');
        return false;
      }
      if (entry.thirdParty.code === "0") {
        this.snackBarService.showError('Please enter a valid thirdParty Account!');
        return false;
      }
      if (entry.account.code === "0") {
        this.snackBarService.showError('Please select a valid account!');
        return false;
      }
      return true;
    });
    if (!entriesValid) {
      return false;
    }
    const totalRecBookPageNumber = this.getTotalRecBookPageNumber();
    const totalInvoiceNumber = this.getTotalInvoiceNumber();

    // Set the totals validity
    this.totalsValid = totalRecBookPageNumber === totalInvoiceNumber; // Check if totals are equal

    if (!this.totalsValid) {
      this.snackBarService.showError('The totals of RecBook Page Number and Invoice Number must be equal!');
      return false;
    }

    // Continue with form validation...
    return entriesValid && this.totalsValid;
  }

  onSubmit(): void {
    // this.voucher1.voucherEntries=this.voucherEntries;
    if (this.isFormValid()) {
        this.apiService.post('vouchers/add_or_update_third_party_voucher_rest_api', this.voucher).subscribe(
            res => {
                console.log('Submitted voucher:', res);
                this.snackBarService.showSuccess('Voucher Saved Successfully!');
            },
            error => {
              this.snackBarService.showError('An error occurred while adding the record!');
            }
        );
    } 
  }
getTotalRecBookPageNumber(): string {
  if (Array.isArray(this.voucher.voucherEntries)) {
    const total = this.voucher.voucherEntries.reduce((sum: number, entry: any) => {
      // Clean and parse the 'recBookPageNumber' value by removing commas and spaces
      const recBookPageNumber = entry.recBookPageNumber ? entry.recBookPageNumber.replace(/[^0-9.]/g, '') : '';
      
      const value = parseFloat(recBookPageNumber);  // Parse as number

      if (!isNaN(value)) {
        return sum + value;
      } else {
        // console.warn(`Invalid recBookPageNumber value: ${entry.recBookPageNumber}`);  
        return sum;
      }
    }, 0);

    // Format with commas and no decimal places
    return total.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  return '0';
}

// This function calculates the total of 'invoiceNumber' from the voucher entries.
getTotalInvoiceNumber(): string {
  if (Array.isArray(this.voucher.voucherEntries)) {
    const total = this.voucher.voucherEntries.reduce((sum: number, entry: any) => {
      // Clean and parse the 'invoiceNumber' value by removing commas and spaces
      const invoiceNumber = entry.invoiceNumber ? entry.invoiceNumber.replace(/[^0-9.]/g, '') : '';
      
      const value = parseFloat(invoiceNumber);  // Parse as number

      if (!isNaN(value)) {
        return sum + value;
      } else {
        // console.warn(`Invalid invoiceNumber value: ${entry.invoiceNumber}`); 
        return sum;
      }
    }, 0);

    // Format with commas and no decimal places
    return total.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  return '0';
}
  deleteRow(i: number): void {
    if (this.voucher.voucherEntries.length > 2) {
      this.voucher.voucherEntries.splice(i, 1);
    }
  }
  
  addNewRow(): void {
    const newEntry = {
      id: 0,
      sequence: this.voucher.voucherEntries.length + 1, // Set sequence based on current length
      lockLine: false,
      branch: 0,
      account: {
      code: "0"
      },
      narration: "",
      thirdParty: {
        code: "0"
      },
      recBookPageNumber: "0",
      invoiceNumber: "0",
      recBookNumber: 0
    };
    
    this.voucher.voucherEntries.push(newEntry);
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
    // this.obj.fromDate =maxFinancialYear.fromDate;
    // this.obj.toDate =maxFinancialYear.toDate;
    this.voucher.financialYearId =maxFinancialYear.id;
  
  }
}

