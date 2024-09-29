import { Component,HostListener,ElementRef ,OnInit } from '@angular/core';
import { VoucherService } from 'src/app/core/service/voucher/voucher.service'; 
import { HttpService ,routes, SidebarService} from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-sale-voucher',
  templateUrl: './sale-voucher.component.html',
  styleUrl: './sale-voucher.component.scss'
})
export class SaleVoucherComponent implements OnInit{
  isButtonDisabled = false;
  public routes = routes;
  itemDefs: any[] = [];
  parties:any[]= [];
  getBranches:any[]= [];
  itemDefId:any = 1;
  saleVoucher: any;
  constructor(
    private voucherService: VoucherService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private snackBarService:SnackBarService,
    private sidebar: SidebarService,
    private el: ElementRef
  ){
    this.getItemById(this.itemDefId);
    this.newVoucher();
  }

  @HostListener('focus') onFocus() {
    this.el.nativeElement.select();
  }
  ngOnInit(): void {
    this.getAll();
    this.saleVoucher = {
      voucherNumber: ''
      // Other properties
    };
  }
  calculcate(): void {
    debugger
    this.voucherService.calculateVoucher(this.sjvVoucher);
    
    this.sjvVoucher=this.voucherService.voucher1;
    debugger
  }
  // addVoucher(){}
  sjvVoucher:any= null;

  public getItemById(itemDefId: any) {
    console.log('Selected ItemDefId:', itemDefId); // Log the selected ID
    debugger;
  
    this.apiService.getObservable(`app/item_def_detail?itemDefId=${itemDefId}&branchId=0&companyId=0&voucherStatusId=0`).subscribe(
      (res: any) => {
        
          this.sjvVoucher.itemStock.itemStockEntries[0].itemDef = res;
        
      },
      (error) => {
        console.error('Error fetching item details:', error);
      }
    );
  }
  newVoucher(){
    this.isButtonDisabled = true;
    this.apiService.getObservable('app/new_voucher/sjv').subscribe(
        (res:any) => {
          this.sjvVoucher = res; 
            console.log(res, 'looooogSjv');
           
             if (res.itemStock) {
              res.itemStock.account = res.itemStock.account || { code: 0 };
              
            }
        },
      
    );
  }
  addVoucher() {
    this.isButtonDisabled = true;
    this.apiService.post('app/add_or_update_voucher', this.sjvVoucher).subscribe(
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
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
}
