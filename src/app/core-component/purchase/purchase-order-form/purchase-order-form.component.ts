import { Component ,OnInit , ElementRef} from '@angular/core';
import { User } from 'angular-feather/icons';
import { HttpService,routes,SidebarService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrl: './purchase-order-form.component.scss'
})
export class PurchaseOrderFormComponent implements OnInit {
  
  isButtonDisabled = false;
  saleOrderIsReadyToSubMit = true;
  itemDefs: any[] = [];
  parties: any[] = [];
  mills: any[] = [];
  // allParties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  public routes = routes;
  isCollapsed: boolean = false;
  

  constructor(
    private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private el: ElementRef,
    private snackBarService: SnackBarService
  ) {}
 
  
  purchaseOrder ={
    "id": 0,
    "company":
       {
           "id":  0,
       },
   "branch":
       {
           "id": 0,
       },
   financialYear:
       {
           "id":  0,
       },
    purchaseOrderDate:new Date().toISOString().substring(0, 10),
    purchaseOrderEntries:[
      {"id": 0,
       "rate": 0,
        "kg": 0,
        "vehical": 0,
          "paymentDate": new Date().toISOString().substring(0, 10),
        "itemDef":
       {
           "id": 0,
           },
      "supplierAccount" :{ 
           "code": 0,
      },
       "millKhata":
                {
                    "id": 0, 
                    
                },
               
         "paymentType": "routine"
      }
    ]
  }

  onSave() {
    // Log the purchaseOrder to see its current state
    console.log("Current purchaseOrder:", this.purchaseOrder);
  
    // Validate required fields
    const isValidPurchaseOrder = this.purchaseOrder.company.id !== 0 &&
                                 this.purchaseOrder.branch.id !== 0 &&
                                 this.purchaseOrder.financialYear.id !== 0 && // Check financialYear
                                 this.purchaseOrder.purchaseOrderEntries.every(entry =>
                                   entry.rate !== 0 &&
                                   entry.kg !== 0 &&
                                   entry.itemDef.id !== 0 &&
                                   entry.millKhata.id !== 0 &&
                                   entry.supplierAccount.code !== 0);
  
    // Log validation result
    console.log("Is purchase order valid?", isValidPurchaseOrder);
  
    if (isValidPurchaseOrder) {
      console.log("Purchase Order is valid:", this.purchaseOrder);
      debugger
      this.apiService.post('app/add_or_update_purchase_order', this.purchaseOrder).subscribe(
        (res) => {
          console.log(res, 'purchaseOrder=======');
          if (res) {
            this.snackBarService.showSuccess('Order Added Successfully!');
            this.cancel();
          } else {
            this.snackBarService.showError('Please fill all the required fields!');
          }
        },
        (error) => {
          this.isButtonDisabled = false;
          this.snackBarService.showError('An error occurred while adding the record!');
        }
      );
  
    } else {
      console.error("Purchase Order is missing required fields.");
      this.snackBarService.showError('Please fill all the required fields!');
    }
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
  cancel(){
    this.purchaseOrder ={
      "id": 0,
      "company":
         {
             "id":  0,
         },
     "branch":
         {
             "id": 0,
         },
     financialYear:
         {
             "id":  0,
         },
      purchaseOrderDate:new Date().toISOString().substring(0, 10),
      purchaseOrderEntries:[
        {"id": 0,
         "rate": 0,
          "kg": 0,
          "vehical": 0,
            "paymentDate": new Date().toISOString().substring(0, 10),
          "itemDef":
         {
             "id": 0,
             },
        "supplierAccount" :{ 
             "code": 0,
        },
         "millKhata":
                  {
                      "id": 7, 
                      
                  },
                 
           "paymentType": "routine"
        }
      ]
    }
  }
  deleteRow(i: any) {
    if (this.purchaseOrder.purchaseOrderEntries.length > 1) {
      this.purchaseOrder.purchaseOrderEntries.splice(i, 1);
    }
  }

  addNewRow(data: any, i: any) {
    // console.log(data, 'ddddddddddddd');
    // console.log(i, 'iiiiiiiiiiii');
    this.purchaseOrder.purchaseOrderEntries.splice(
      i + 1,
      0,
      JSON.parse(
        JSON.stringify( {"id": 0,
          "rate": 0,
           "kg": 0,
           "vehical": 0,
             "paymentDate": new Date().toISOString().substring(0, 10),
           "itemDef":
          {
              "id": 0,
              },
         "supplierAccount" :{ 
              "code": 0,
         },
          "millKhata":
                   {
                       "id": 7, 
                       
                   },
                  
            "paymentType": "routine"
         })
      )
    );
  }
}

