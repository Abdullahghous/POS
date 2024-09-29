import { Component,OnInit , ElementRef } from '@angular/core';
import { HttpService,routes,SidebarService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sales-order-form',
  templateUrl: './sales-order-form.component.html',
  styleUrl: './sales-order-form.component.scss'
})
export class SalesOrderFormComponent implements OnInit {
  
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
    private el: ElementRef,
  ) {}
  
  saleOrder = {
   
    id: 0,
    company: { id: 1 },
    branch: { id: 1 },
    financialYear: { id: 0 },
    saleOrderCode: '',
    
    saleOrderDate: '',
    saleOrderEntries: [
      {
        id: 0,
        itemDef: { id: 0 },
        customerAccount: { code: 0 },
        millKhata: { id: 0 },
        rate: 0,
        kg: 0,
        vehical: '',
        paymentDate: '',
        paymentType: '',
      },
    ],
  };
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
   
    this.apiService.post('receivables/add_or_update_sale_order', this.saleOrder).subscribe(
      
        (res) => {
            console.log(res, 'looooog333');
            if (res) {
                setTimeout(() => {
                    const closeButton = this.el.nativeElement.querySelector('.close');
                    if (closeButton) {
                        closeButton.click();
                    }
                });
            }
            this.isButtonDisabled = false;
        },
        (error) => {
            this.isButtonDisabled = false;
        }
    );
  }
  
  deleteRow(i: any) {
    if (this.saleOrder.saleOrderEntries.length > 1) {
      this.saleOrder.saleOrderEntries.splice(i, 1);
    }
  }

  addNewRow(data: any, i: any) {
    // console.log(data, 'ddddddddddddd');
    // console.log(i, 'iiiiiiiiiiii');
    this.saleOrder.saleOrderEntries.splice(
      i + 1,
      0,
      JSON.parse(
        JSON.stringify({
          id: 0,
          itemDef: { id: 0 },
          customerAccount: { code: 0 },
          millKhata: { id: 0 },
          rate: 0,
          kg: 0,
          vehical: '',
          paymentDate: '',
          paymentType: '',
          amount:0,
          
        })
      )
    );
  }
}
