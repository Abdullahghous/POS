import { Component,ElementRef ,OnInit } from '@angular/core';
import { VoucherService } from 'src/app/core/service/voucher/voucher.service'; 
import { HttpService ,routes, SidebarService} from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  financialYear:any=[]
  itemDefId:any = 1;
  saleVoucher: any;
  voucher:any=null;
  private queryParamsSubscription: Subscription;

  constructor(
    private voucherService: VoucherService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private snackBarService:SnackBarService,
    private sidebar: SidebarService,
    private el: ElementRef,
    private route: ActivatedRoute,
  ){
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
      debugger
      if (params['voucher']) {
        const voucher = JSON.parse(decodeURIComponent(params['voucher']));
        console.log('Received voucher:', voucher);
        // Now you can use the voucher object as needed
      } else {
        this.newVoucher();
      }
    });
    this.getAll();
  }
   transform(value: any): string {
    return value ? value.toUpperCase() : '';
  }

  // @HostListener('focus') onFocus() {
  //   this.el.nativeElement.select();
  // }
 
  calculcate(): void {
    debugger
    this.voucherService.pjvVoucher(this.sjvVoucher);
    
    this.sjvVoucher=this.voucherService.voucher2;
    // debugger
  }
  // addVoucher(){}
  sjvVoucher:any= null;

  public getItemById(itemDefId: any) {
    console.log('Selected ItemDefId:', itemDefId); // Log the selected ID
    // debugger;
  
    this.apiService.getObservable(`app/item_def_detail?itemDefId=${itemDefId}&branchId=0&companyId=0&voucherStatusId=0`).subscribe(
      (res: any) => {
        debugger
        this.sjvVoucher.itemStock.itemStockEntries[0].itemDef = res;
          this.voucherService.weightParBag =res.weightParBag;
          this.calculcate();
      },
      (error) => {
        console.log('Error fetching item details:', error);
      }
    );
  }
  newVoucher(){
    this.apiService.getObservable('app/new_voucher/SJV').subscribe(
        (res:any) => {
          console.log(res, 'looooogSjv');
          this.sjvVoucher = res; 
            
           
             if (res.itemStock) {
              res.itemStock.account = res.itemStock.account || { code: 0 };
              
            }
        },
      
    );
  }
  taxRate(){
    this.sjvVoucher.itemStock.brokriRate=this.sjvVoucher.itemStock.brokriValue/100;
    this.calculcate();
  }
  addVoucher() {
    const isValid = this.sjvVoucher.itemStock.itemStockEntries.every((item: any) => {
      const { bags, amount, totalKg, itemDef } = item;
      const accountCode = this.sjvVoucher.itemStock.account.code;
    
      return (
        bags != null && 
        bags > 0 &&   
        amount > 0 &&   
        totalKg > 0 &&  
        itemDef.id > 0 && 
        accountCode > 0 && 
        amount !== Infinity && // amount should not be Infinity
        !Number.isNaN(amount) // Check if amount is a number and not NaN
      );
    });
    if (!isValid) {
      this.snackBarService.showError('Please  required fields input!');
      return;
    }
    this.apiService.post('app/add_or_update_voucher', this.sjvVoucher).subscribe(
        (res) => {
            console.log(res, 'saveSucces full');
            if (res) {
              this.snackBarService.showSuccess('Order Added Successfully!');
              this.newVoucher();
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
  cancel(){

  }
  model(){
    // debugger
    document.getElementById('viwo2')?.click();
  }
  ngOnDestroy() {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    debugger
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        const id = params['id']; // Get accountCode from URL
         console.log('voucher++++===',id);
         this.search(id);
      }
    });
    
  }
  
  search(id: string): void {
    debugger
    const apiUrl = `app/purchase_journal_vouchers/${id}`;
  
    this.apiService.getObservable(apiUrl).subscribe(
      (res: any) => { // Replace with the actual response type
        console.log('voucher', res);
        this.sjvVoucher = res;
        this.voucherService.weightParBag =res.itemStock.itemStockEntries[0].itemDef.weightParBag;
        // this.model(); 
      },
      error => {
        console.error('Error fetching vouchers:', error);
      }
    );
  }
  // editVoucher(voucher: any) {
  //   console.log('Editing voucher:', voucher);
  //   document.getElementById('close')?.click();
  //   // this.getItemById(itemDefId);
  //   this.sjvVoucher= voucher
  // }
  getAll(){
  
    let items: any = localStorage.getItem('itemDefs');
    let parties: any = localStorage.getItem('parties');
    let getBranches: any = localStorage.getItem('branch');
    let financialYear: any = localStorage.getItem('financialYear');
    // console.log(getCompanies,'compnayyyy====8')
    if (items && parties && getBranches && financialYear
       != null && JSON.parse(items).length != 0) {
      this.itemDefs = JSON.parse(items);
      this.parties =JSON.parse(parties);
      this.getBranches = JSON.parse(getBranches);
      this.financialYear = JSON.parse(financialYear);
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
      this.allApiService.financialYear();
     financialYear = localStorage.getItem('financialYear');
     this.financialYear = JSON.parse(financialYear);
     
    }
  }
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
}
