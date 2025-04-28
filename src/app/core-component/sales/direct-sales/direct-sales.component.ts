import { Component } from '@angular/core';
import { VoucherService } from 'src/app/core/service/voucher/voucher.service'; 
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { HttpService } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { ActivatedRoute } from '@angular/router';



interface ItemEntry {
  bags: number;
  amount: number;
  totalKg: number;
  itemDef?: { id: number };
}

@Component({
  selector: 'app-direct-sales',
  templateUrl: './direct-sales.component.html',
  styleUrl: './direct-sales.component.scss'
})
export class DirectSalesComponent {
  itemDefs: any[] = [];
  parties:any[]= [];
  getBranches:any[]= [];
  financialYear:any[]= [];
  mills: any[] = [];
  getCompanies:any[]= [];
  itemDefId:any = 1;
  saleVoucher: any;
  voucher:any=null;
  viewo:any =null;
 
 
 
  constructor(
    private voucherService: VoucherService,
    private allApiService:AllApiService,
    private apiService:HttpService,
    private snackBarService:SnackBarService,
    private route: ActivatedRoute
  ) { 
    // debugger
    this.route.queryParams.subscribe(params => {
      const id = params['id']; 
      // const typeVoucher = params['typeVoucher']; 
      console.log('view parms',id)
      if (id) {
        this.viwoVoucher(id);
        console.log('view parms console true',id) 
      }else{
        this.newVoucher();
        console.log('view parms console false',id)
      }

    });
    
  }
  
  ngOnInit(): void {
  this.getAll();
  } 

  newVoucher(){
    debugger
    this.apiService.getObservable('app/new-combine-voucher').subscribe((res:any)=>{
      console.log('new Form',res);
      this.voucher = res;
      if (res.sjvVoucher?.itemStock) {
        res.sjvVoucher.itemStock.account = res.sjvVoucher.itemStock.account || { code: 0 };
        res.pjvVoucher.itemStock.account = res.pjvVoucher.itemStock.account || { code: 0 };
        // res.pjvVoucher.itemStock.itemStockEntries[0].itemDef = res.pjvVoucher.itemStock.itemStockEntries[0].itemDef || {id:0}
        // const itemStockEntries = res.pjvVoucher.itemStock.itemStockEntries;
          // if (itemStockEntries && itemStockEntries.length > 0) {
          //   itemStockEntries[0].prePurchaseEntry = itemStockEntries[0].prePurchaseEntry || { paymentType: '',prePurchaseCode: '' };
           
          // } else {
          //   res.pjvVoucher.itemStock.itemStockEntries.push({
          //     id: '0',
          //     voucherDate: '',
          //     purchaseOrderEntry: '', 
          //     itemDef: {id:0},
          //     prePurchaseEntry: { paymentType: '',prePurchaseCode: '' } 
          //   });
          // }
        }
      },
      
      (error) => {
        console.error('Error fetching new voucher:', error);
        // Handle error accordingly
    }
  )
  }
  public getItemById(itemDefId: any) {
    console.log('Selected ItemDefId:', itemDefId); // Log the selected ID
    // debugger;
  
    this.apiService.getObservable(`app/item_def_detail?itemDefId=${itemDefId}&branchId=0&companyId=0&voucherStatusId=0`).subscribe(
      (res: any) => {
        // debugger
        this.voucher.pjvVoucher.itemStock.itemStockEntries[0].itemDef.id = res.id;
          this.voucherService.weightParBag =res.weightParBag;
          // this.calculcate();
      },
      (error) => {
        console.log('Error fetching item details:', error);
      }
    );
    this.calculcate()
  }
  saveVoucher(){
    // debugger
  
    const pjvAccountCode = this.voucher.pjvVoucher.itemStock.account.code;
    const sjvAccountCode = this.voucher.sjvVoucher.itemStock.account.code;

    // Check if both account codes are zero
    if ((pjvAccountCode === 0 || pjvAccountCode === null) && 
        (sjvAccountCode === 0 || sjvAccountCode === null)) {
        this.snackBarService.showError('Please select Party for both vouchers!');
        return; 
    }

    // Combine itemStockEntries from both vouchers
    const combinedItemStockEntries = [
        ...this.voucher.pjvVoucher.itemStock.itemStockEntries,
        ...this.voucher.sjvVoucher.itemStock.itemStockEntries
    ];

    // Validate combined entries
    const isValid = combinedItemStockEntries.every((item: ItemEntry) => {
        const { bags, amount, totalKg } = item;

        return (
            bags > 0 &&   
            amount > 0 &&   
            totalKg > 0 &&  
            amount !== Infinity && 
            !Number.isNaN(amount)
        );
    });

    if (!isValid) {
        this.snackBarService.showError('Please fill in all required fields!');
        return;
    }
    this.apiService.post('app/combine-voucher-add-or-update',this.voucher).subscribe(
      (res) =>{
        console.log(res, 'looooog');
        if (res) {
          this.snackBarService.showSuccess('Voucher Added Successfully!');
          this.newVoucher();
        } else {
          this.snackBarService.showError('Please fill all the required fields!');
        }
      },
      (error) => {
        this.snackBarService.showError('An error occurred while adding the record!');
      }
     )
    }
  
  viwoVoucher(id:any){
    // debugger
    
    document.getElementById('viewComine')?.click();
    console.log('view model');
    this.apiService.getObservable('app/view-combine-voucher/'+id).subscribe((res:any)=>{
      console.log('view Form',res);
      this.viewo = res;
    })
  }
  taxRate(){}
  calculcate(): void {
    // debugger //117322
    this.voucherService.calculateVoucher(this.voucher);
    this.voucher.pjvVoucher=this.voucherService.voucher1;
    this.voucherService.pjvVoucher(this.voucher.sjvVoucher);
    this.voucher.sjvVoucher=this.voucherService.voucher2;
    console.log('voucher sjv',this.voucherService.voucher2);
    console.log('voucher pjv',this.voucherService.voucher1)
    // debugger.000
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
  public filter = false;
  openFilter() {
    this.filter = !this.filter;
  }
}
