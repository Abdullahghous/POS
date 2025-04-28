import { Component, OnInit , ElementRef} from '@angular/core';
import { SidebarService,} from 'src/app/core/core.index';
import { FormControl } from '@angular/forms';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

import { HttpService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { ActivatedRoute } from '@angular/router';


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
  voucherList:any[]=[];
  isCollapsed: boolean = false;
  itemDefs: any[] = [];
  parties:any[]=[]
  mills:any=[] // Define the itemDefs array
  selectedItem: any | null = null;
  searchControl = new FormControl();
  totalsValid: boolean = true;
  
  constructor(
    private sidebar: SidebarService,
    private apiService: HttpService,
     private allApiService:AllApiService,
     private snackBarService:SnackBarService,
     private route: ActivatedRoute,
  ) {}


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
  voucher1:any={
    "company": {
      "id": 1
    },
    "id": 0,
    "voucherType": {
      "id": "CRV"
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
      "branch": {"id": "0","name": ""},
      "account": { code: "0"},
      "narration": "",
      "chequeNumber": "",
      "recBookPageNumber": 0,
      "invoiceNumber": 0,
      "recBookNumber": 0,
    },
    {
      "id": 0,
      "sequence": 2,
      "lockLine": false,
      "branch":{"id": "0", "name": ""},
      "account": {code: "0"},
      "narration": "",
      "chequeNumber": "",
      "recBookPageNumber": 0,
      "invoiceNumber": 0,
      "recBookNumber": 0
    }
      
    ]
  }
  onchange(id: any) {
    let code = { ...this.voucher1 };  
    code.voucherEntries = [];
    // console.log('Before API call:', this.voucher1);
    this.apiService.post('vouchers/next_voucher_code', code).subscribe((res: any) => {
      this.voucher1.voucherCode = res.nextVoucherCode;
    });
  }
 

  isFormValid(): boolean {
    debugger;
    if (!this.voucher1.voucherCode.trim()) {
      this.snackBarService.showError('Voucher Code is required!');
      return false;
    }
    const entriesValid = this.voucher1.voucherEntries.every((entry: any) => {
      if (entry.branch === 0) {
        this.snackBarService.showError('Please select a valid branch!');
        return false;
      }
      // if (entry.chequeNumber.trim() === "") {
      //   this.snackBarService.showError('Please enter a valid cheque number!');
      //   return false;
      // }
      if (entry.account.code === "0") {
        this.snackBarService.showError('Please select a valid account!');
        return false;
      }
      return true;
    });

    // If entries are invalid, stop the validation
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
        this.apiService.post('vouchers/add_or_update_voucher_rest_api', this.voucher1).subscribe(
            res => {
                console.log('Submitted voucher:', res);
                this.snackBarService.showSuccess('Voucher Saved Successfully!');
            },
            error => {
              this.snackBarService.showError('An error occurred while adding the record!');
            }
        );
    } else {
      this.snackBarService.showError('All filed requard !');
    }
  }
getTotalRecBookPageNumber(): string {
  if (Array.isArray(this.voucher1.voucherEntries)) {
    const total = this.voucher1.voucherEntries.reduce((sum: number, entry: any) => {
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
  if (Array.isArray(this.voucher1.voucherEntries)) {
    const total = this.voucher1.voucherEntries.reduce((sum: number, entry: any) => {
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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params:any) => {
      const id = params['id']; 
      const typeVoucher = params['typeVoucher']; 
      if (id ) {
        this.viewVoucher(id); 
      }
    });
    this.getAll();
   
  }
  openVoucher(){
    this.voucher1={
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
        "branch": {"id": "0","name": ""},
        "account": { code: "0"},
        "narration": "",
        "chequeNumber": "",
        "recBookPageNumber": 0,
        "invoiceNumber": 0,
        "recBookNumber": 0,
      },
      {
        "id": 0,
        "sequence": 2,
        "lockLine": false,
        "branch":{"id": "0", "name": ""},
        "account": {code: "0"},
        "narration": "",
        "chequeNumber": "",
        "recBookPageNumber": 0,
        "invoiceNumber": 0,
        "recBookNumber": 0
      }
        
      ]
    }
    this.isEditMode = false;
  }
  viewVoucher(id:any){
    debugger
    this.apiService.getObservable(`app/vouchers/${id}`).subscribe(
      (res: any) => {
          console.log('voucher1::', res);
          document.getElementById('view-vouche')?.click();
          this.voucher1=res 
      },
      error => {
          console.error('Error fetching vouchers:', error);
      }
  );
  }
  view(data:any){
    document.getElementById('view-vouche')?.click();
    this.voucher1=data;
    this.totalDebit = this.voucher1.voucherEntries.reduce((sum: any, entry: any) => sum + entry.debit, 0);
    this.totalCredit = this.voucher1.voucherEntries.reduce((sum: any, entry: any) => sum + entry.credit, 0);
    console.log('item',data)
  }
  filteredItems(): any[] {
    const filterValue = this.searchControl.value?.toLowerCase();
    return this.itemDefs.filter(item => 
      item.name.toLowerCase().includes(filterValue)
    );
  }

  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  public filter = false;
  openFilter() {
    this.filter = !this.filter;
  }
  isEditMode: boolean = false;
  edit(data:any){
    document.getElementById('edit-vouche')?.click();
    this.voucher1=data;
    this.isEditMode = true;
    console.log('edit voucher',this.voucher1);
  }
  totalDebit = 0;
  totalCredit = 0;
  cancel(){

  }
  getAll(){
    
    let items: any = localStorage.getItem('itemDefs');
    let parties: any = localStorage.getItem('parties');
    let mills: any = localStorage.getItem('mills');
    let getBranches: any = localStorage.getItem('branch');
    let getCompanies: any = localStorage.getItem('companies');
    let financialYear: any = localStorage.getItem('financialYear');
    // console.log(getCompanies,'compnayyyy====8')
    if (items && parties && mills && getBranches && getCompanies && financialYear
       != null && JSON.parse(items).length != 0) {
      this.itemDefs = JSON.parse(items);
      this.parties =JSON.parse(parties);
      this.mills = JSON.parse(mills); 
      this.getBranches = JSON.parse(getBranches);
      this.getCompanies = JSON.parse(getCompanies);
      this.financialYear = JSON.parse(financialYear);
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
  }
   
  search() {
   
    this.apiService.post<any[]>('vouchers/voucher_detail_list', this.obj).subscribe(
      (res: any[]) => {
        this.voucherList = res;
        console.log(res, 'voucher===list');
  
       
      },
    );
  }
  getTotalCredit(): number {
     const totalCredit =  this.voucherList.reduce((total, voucher) => {
      return total + voucher.voucherEntries.reduce((sum:any, item:any) => sum + (item.credit || 0),0);
    }, 0);
    return totalCredit.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  // Calculate total debit
  getTotalDebit(): number {
    const totalDebit = this.voucherList.reduce((total, voucher) => {
      return total + voucher.voucherEntries.reduce((sum: any, item: any) => sum + (item.debit || 0), 0);
    }, 0);
  
    // Format with commas and no decimal places
    return totalDebit.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  deleteRow(i: number): void {
    if (this.voucher1.voucherEntries.length > 2) {
      this.voucher1.voucherEntries.splice(i, 1);
    }
  }
  
  addNewRow(data: any, index: number): void {
    const newEntry = {
        id: 0,
        sequence: this.voucher1.voucherEntries.length + 1, // Set sequence based on current length
        lockLine: false,
        branch: { id: "0" },
        account: { code: "0" },
        narration: "",
        chequeNumber: "",
        recBookPageNumber: "0",
        invoiceNumber: "0",
        recBookNumber: 0,
    };
    
    this.voucher1.voucherEntries.push(newEntry);
}
}
