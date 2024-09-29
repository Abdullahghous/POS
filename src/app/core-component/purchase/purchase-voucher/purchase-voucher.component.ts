import { Component ,OnInit ,Directive, HostListener, ElementRef} from '@angular/core';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { VoucherService } from 'src/app/core/service/voucher/voucher.service';
import {HttpService} from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-purchase-voucher',
  templateUrl: './purchase-voucher.component.html',
  styleUrl: './purchase-voucher.component.scss'
})
export class PurchaseVoucherComponent implements OnInit  {
  isButtonDisabled = false;
  itemDefs: any[] = [];
  parties:any[]= [];
  getBranches:any[]= [];
  selectedItemId: any;  // Property bound to the nz-select
  //itemDefs = [];  // Populate this with your items
    itemDefId:any = 1;
  constructor(
    private allApiService:AllApiService,
    private voucherService:VoucherService,
    private apiService: HttpService,
    private snackBarService:SnackBarService,
    private el: ElementRef
  ){
    // const itemDefId = 1;
     this.getItemById(this.itemDefId);
    this.newVoucher();
   
  }
  @HostListener('focus') onFocus() {
    this.el.nativeElement.select();
  }
  ngOnInit(): void {
    this.newVoucher();
   
    this.getItemById(this.itemDefId);
    this.getAll()
  }
  public filter = false;
  openFilter() {
   
    this.filter = !this.filter;
  }
  pjvVoucher:any= null;

  public getItemById(itemDefId: any) {
    console.log('Selected ItemDefId:', itemDefId); // Log the selected ID
    debugger;
  
    this.apiService.getObservable(`app/item_def_detail?itemDefId=${itemDefId}&branchId=0&companyId=0&voucherStatusId=0`).subscribe(
      (res: any) => {
          this.pjvVoucher.itemStock.itemStockEntries[0].itemDef = res;
        
      },
      (error) => {
        console.error('Error fetching item details:', error);
      }
    );
  }
  
  
  calculcate(): void {
    
    this.voucherService.calculateVoucher(this.pjvVoucher);
    
    this.pjvVoucher=this.voucherService.voucher1;
    debugger
  }
  submitVoucher(){
    this.isButtonDisabled = true;
    this.apiService.post('app/add_or_update_voucher', this.pjvVoucher).subscribe(
        (res) => {
            console.log(res, 'looooog');
            if (res) {
              this.snackBarService.showSuccess('Order Added Successfully!');
              // Reload the page after showing the success message
              setTimeout(() => {
                window.location.reload();
              }, 1000); // Add a small delay to allow the user to see the success message
            } else {
              this.snackBarService.showError('Please fill all the required fields!');
            }
          },
          (error) => {
            this.isButtonDisabled = false;
            this.snackBarService.showError('An error occurred while adding the record!');
          }
    );
  }
  newVoucher(){
    this.isButtonDisabled = true;
    this.apiService.getObservable('app/new_voucher/pjv').subscribe(
        (res:any) => {
          this.pjvVoucher = res; 
            console.log(res, 'looooog');
           
             if (res.itemStock) {
              res.itemStock.account = res.itemStock.account || { code: 0 };
              
            }
        },
      
    );
  }
  getAll(){
  
    let items: any = localStorage.getItem('itemDefs');
    let parties: any = localStorage.getItem('parties');
    let getBranches: any = localStorage.getItem('branch');
    // console.log(getCompanies,'compnayyyy====8')
    if (items && parties && getBranches 
       != null && JSON.parse(items).length != 0) {
      this.itemDefs = JSON.parse(items);
      this.parties =JSON.parse(parties);
      this.getBranches = JSON.parse(getBranches);
      // debugger
    }
    else{
      this.allApiService.getItemDefs();
      items = localStorage.getItem('itemDefs');
      this.itemDefs = JSON.parse(items);
      this.allApiService.getParties();
      parties = localStorage.getItem('parties');
      this.parties = JSON.parse(parties);
      this.allApiService.getBranches();
      getBranches = localStorage.getItem('branch');
      this.getBranches = JSON.parse(getBranches);
     
     
    }
  }
}
