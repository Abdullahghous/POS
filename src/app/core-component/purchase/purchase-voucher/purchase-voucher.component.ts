import { Component ,OnInit ,Directive, HostListener, ElementRef} from '@angular/core';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { VoucherService } from 'src/app/core/service/voucher/voucher.service';
import {HttpService} from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-purchase-voucher',
  templateUrl: './purchase-voucher.component.html',
  styleUrl: './purchase-voucher.component.scss'
})
export class PurchaseVoucherComponent implements OnInit  {
  private queryParamsSubscription: Subscription;
  itemDefs: any[] = [];
  parties:any[]= [];
  getBranches:any[]= [];
  selectedItemId: any;  
  financialYear :any=[];
  voucher:any=null;
    itemDefId:any = 1;
  constructor(
    private allApiService:AllApiService,
    private voucherService:VoucherService,
    private apiService: HttpService,
    private snackBarService:SnackBarService,
    private el: ElementRef,
    private route: ActivatedRoute
  ){
    // debugger
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
  }
  
  ngOnDestroy() {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }
 
  public filter = false;
  openFilter() {
   
    this.filter = !this.filter;
  }
  pjvVoucher:any= {
    createdAt: '',
    id: 0,
    voucherType: '',
    voucherStatus: '',
    branch: { id: '0' },
    financialYear: { id: '0' },
    itemStock: {
      id: 0,
      voucherStatus: '',
      financialYear: '0',
      account: { code: 0 },
      itemDef: { id: '0' },
      gateInwardNo: '',
      gateInwardDate: '',
      itemDefId: '0',
      invoiceNo: "INV-5375",
      invoiceDate: "2024-06-05",
      invoiceDueDate: "2024-06-20",
      silaiRate: '0.00',
      rate: '',
      silaiAmount: '',
      gisahi: '0.00',
      marketFee: '0.00',
      proWeight: '',
      netAmount: '0.0000',
      loadingRate: '0.00',
      loadingCharges: '0.00',
      freightRate: '0.00',
      freightCharges: '0.00',
      millTaxRate: '0.00',
      millTaxAmount: '0',
      otherExp: '0.00',
      brokriValue: '0.00',
      brokeryRate: '0.00',
      bankTaxRate: '0.00',
      builtyWeight: '',
      kantaWeight: '',
      moisture: '',
      permintNumber: '',
      bankTaxAmount: '',
      brokriRate: '0.00',
      brokriAmount: '0.00',
      bardanaRate: '0.00',
      bardanaAmount: '',
      totalAmount: '0.00',
      unloadingRate: '0.00',
      unloadingCharges: '',
      active: false,
      costing: false,
      pallyGisai: '',
      itemStockEntries: [
        {
          id: '0',
          voucherDate: '',
          purchaseOrderEntry: '',
          
          account: { code: 0 },
          itemDef: { id: '0' },
          itemQuantity: '0.00',
          transactionType: "OUT",
          returnedQuantity: '0',
          bagWeightDeduction: '0.00',
          totalBagWeightDeduction: '0.00',
          otherBagWeight: '0',
          purchaseRate: '0.00',
          totalKatoti: '0.00',
          percentage: '',
          percentage40: '0',
          saleRate: '0',
          katoti: '0',
          totalKg: '0.00',
          safiKg: '0.00',
          bags: 0.00,
          bag: '0',
          parti: '',
          stockEntryStatus: '',
          manWithKg: "0",
          discountAmount: '0.00',
          discount: '0.00',
          rem: '',
          amount: '0.00',
          openingQty: '',
          openingRate: '',
          active: true,
          netAmount: '0.00',
          man: 0,
          kg: '0.00',
          prePurchaseEntry:[{
            paymentType:"",
            prePurchaseCode:"",
          }]
        }
      ],
      createdBy: '',
      createdAt: '',
      modifiedBy: '',
      modifiedAt: '',
    },
    voucherDate: "2024-06-05",
    voucherNumber: '5375',
    voucherCode: "STV-5375",
    vehicalNumber: '0',
    bookNumber: '0',
    regNumber: '',
    typeVoucher: "STV",
    ptvNumber: '0',
    voucherNarration: '',
    paymentType: '0',
    active: false,
    posted: false
  }
  taxRate(){
    debugger
    this.pjvVoucher.itemStock.brokriRate =  
    this.pjvVoucher.itemStock.brokriValue / 100;
    this.calculcate();
  }
  public getItemById(itemDefId: any) {
    console.log('Selected ItemDefId:', itemDefId); // Log the selected ID
    // debugger;
  
    this.apiService.getObservable(`app/item_def_detail?itemDefId=${itemDefId}&branchId=0&companyId=0&voucherStatusId=0`).subscribe(
      (res: any) => {
        console.log(res,'consolekg roool');
          this.pjvVoucher.itemStock.itemStockEntries[0].itemDef = res;
          this.voucherService.weightParBag =res.weightParBag;
          
      },
      (error) => {
        console.error('Error fetching item details:', error);
      }
    );
  }
  
  
  calculcate(): void {
    
    this.voucherService.pjvVoucher(this.pjvVoucher);
    
    this.pjvVoucher=this.voucherService.voucher2;
    // debugger
  }
  submitVoucher(){
    // debugger
    const isValid = this.pjvVoucher.itemStock.itemStockEntries.every((item: any) => {
      const { bags, amount, totalKg, itemDef } = item;
      const accountCode = this.pjvVoucher.itemStock.account.code;
    
      return (
        bags != null && // Check for null or undefined
        bags > 0 &&     // bags must be greater than 0
        amount > 0 &&   // amount must be greater than 0
        totalKg > 0 &&  // totalKg must be greater than 0
        itemDef.id > 0 && // itemDef.id must be greater than 0
        accountCode > 0 && // account code must be greater than 0
        amount !== Infinity && // amount should not be Infinity
        !Number.isNaN(amount) // Check if amount is a number and not NaN
      );
    });
    if (!isValid) {
      this.snackBarService.showError('Please  required fields input!');
      return;
    }
  // debugger
    this.apiService.post('app/add_or_update_voucher', this.pjvVoucher).subscribe(
        (res) => {
            console.log(res, 'looooog');
            if (res) {
              this.snackBarService.showSuccess('Order Added Successfully!');
              this.newVoucher();
              // Add a small delay to allow the user to see the success message
            } else {
              this.snackBarService.showError('Please fill all the required fields!');
            }
          },
          (error) => {
            this.snackBarService.showError('An error occurred while adding the record!');
          }
    );
  }
  newVoucher(){
    // debugger
    this.apiService.getObservable('app/new_voucher/PJV').subscribe(
        (res:any) => {
          this.pjvVoucher = res; 
            console.log('pjv voucher', res);
           
             if (res.itemStock) {
              res.itemStock.account = res.itemStock.account || { code: 0 };
              
            }
        },
      
    );
  }
  model(){
    // debugger
    document.getElementById('viwo1')?.click();
  }
  ngOnInit(): void {
    this.getAll();
    
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        const id = params['id']; // Get accountCode from URL
         console.log('voucher++++===',id);
         this.search(id);
      }
    });
  }
  search(id:any){
    const apiUrl = `app/purchase_journal_vouchers/${id}`; // Construct the URL using accountCode
    this.apiService.getObservable(apiUrl).subscribe((res: any) => {
      console.log('voucher', res);
      this.pjvVoucher = res;
      this.voucherService.weightParBag =res.itemStock.itemStockEntries[0].itemDef.weightParBag;
    },
    error => {
      console.error('Error fetching vouchers:', error);
    });
  }
  // editVoucher(voucher: any) {
  //   console.log('Editing voucher:', voucher);
    
  //   // this.getItemById(itemDefId);
  //   this.pjvVoucher= voucher;
  //   this.voucherService.weightParBag =voucher.itemStock.itemStockEntries[0].itemDef.weightParBag;
  //   document.getElementById('close')?.click();
  //   debugger
  //   this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
  //     console.log('Query Params:', params);
  //     debugger
  //     if (params['voucher']) {
  //       const voucher = JSON.parse(decodeURIComponent(params['voucher']));
  //       console.log('Received voucher:', voucher);
  //       // Now you can use the voucher object as needed
  //     } else {
  //       this.newVoucher();
  //     }
  //   });
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
}
