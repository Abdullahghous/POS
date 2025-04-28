import { Component,OnInit , ElementRef } from '@angular/core';
import { HttpService,routes,SidebarService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-pre-purchase-form',
  templateUrl: './pre-purchase-form.component.html',
  styleUrl: './pre-purchase-form.component.scss'
})
export class PrePurchaseFormComponent implements OnInit {
  
  isButtonDisabled = false;
  saleOrderIsReadyToSubMit = true;
  itemDefs: any[] = [];
  parties: any[] = [];
  mills: any[] = [];
  allParties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  public routes = routes;
  isCollapsed: boolean = false;
  constructor(
    private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private snackBarService: SnackBarService,
  ) {}
  

  pre:any={
    "id": 0,
    company: { id: 1 },
    branch: { id: 1 },
    financialYear: { id: 0 },
    "prePurchaseEntries": [
      {
        "id": null,
        "prePurchaseCode": null,
        "prePurchaseNumber": 0,
        "entryDate": new Date().toISOString().substring(0, 10),
        "itemDef": "",
        "supplierAccount": {
          "code": ""
        },
        "millKhata": {
          "id": ""
        },
        "vehicalNo": "",
        "bag": 0,
        "paymentType": "cash",
        "kg": 0,
        "freight": 0,
        "rate": 0,
        "remarks": ""
      }
    ]
  }
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  ngOnInit(): void {
    this.getAll();
   
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
       debugger
    }
  }
  add(data:any){
    console.log(data , 'paaaaaaac')
    
    
      // debugger
  }
  onSave() {
   
    this.apiService.post('payables/add_or_update_pre_purchase', this.pre).subscribe(
        (res) => {
            console.log(res, 'preeeeeeechsaaa');
            if (res) {
              if (res) {
                // debugger
                document.getElementById('cancelButton')?.click();
                this.snackBarService.showSuccess('Record Update Successfully!');
                
              } else {
                this.snackBarService.showError('Please fill all the required fields!');
              }
            }
        },
        (error) => {
            this.isButtonDisabled = false;
        }
    );
  }
  
  deleteRow(i: any) {
    if (this.pre.prePurchaseEntries.length > 1) {
      this.pre.prePurchaseEntries.splice(i, 1);
    }
  }

  addNewRow(data: any, i: any) {
    this.pre.prePurchaseEntries.splice(
      i + 1,
      0,
      JSON.parse(
        JSON.stringify({
          "id": null,
          "prePurchaseCode": null,
          "prePurchaseNumber": 0,
          "entryDate": new Date().toISOString().substring(0, 10),
          "itemDef": { id: 0 },
          "supplierAccount": {
            "code": "11111011001"
          },
          "millKhata": {
            "id": 6
          },
          "vehicalNo": "12",
          "bag": 1,
          "paymentType": "cash",
          "kg": 2500,
          "freight": 0,
          "rate": 1500,
          "remarks": "koi nai"
        })
      )
    );
  }
  
  singleFile: File[] = [];
  multipleFiles: File[] = [];

  onSingleSelect(event: { addedFiles: File[] }) {
    this.singleFile = [];
    this.singleFile.push(...event.addedFiles);
  }

 

  onRemoveSingle(event: File) {
    this.singleFile.splice(this.singleFile.indexOf(event), 1);
  }

 
}
