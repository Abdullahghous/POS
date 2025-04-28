import { Component,OnInit } from '@angular/core';
import { HttpService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-mill-rate',
  templateUrl: './mill-rate.component.html',
  styleUrl: './mill-rate.component.scss'
})
export class MillRateComponent implements OnInit {
  itemDefs: any[] = [];
  parties: any[] = [];
  mills: any[] = [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  financialYear:any[]= [];
  millRate:  any[] = [];
  list:any=[];
  millRateEntry: any = {
    key: 0,
    supplierAccount: { code: 0 },
    rate: 0,
    qty: 0,

  };
  newObj: any = {
    key: 0,
    sellerAccount: { code: 0 },
    millRate: 0,
    saleRate: 0,
    moisture: 0,
    cashRate: 0,
    entryDate:"",
    mill:{id:1},
    itemDef: { id: 0 },
    expand: false,
    millRateEntries: [this.millRateEntry],
  }
  obj:any={
    itemDefId:0,
    millId:0,
    fromDate:new Date().toISOString().substring(0, 10),
    toDate:new Date().toISOString().substring(0, 10),
  }
  constructor(
    private allApiService: AllApiService ,
    private api:HttpService,
    private snackBarService: SnackBarService
  ){}
  ngOnInit(): void {
   this.millRate.push(this.newObj) ;
   this.getAll();
   const today = new Date();
   this.millRate[0].entryDate = today.toISOString().split('T')[0];
  }
  onSave() {
    const isValid = this.millRate.every(entry => {
      return entry.millRate !== 0 &&  // Check if millRate is not 0
             entry.saleRate !== 0 &&  // Check if saleRate is not 0
             entry.moisture !== 0 &&  // Check if moisture is not 0
             entry.cashRate !== 0 &&  // Check if cashRate is not 0
             entry.mill && entry.mill.id !== undefined && entry.mill.id !== null && // Check if mill id exists
             entry.itemDef && entry.itemDef.id !== undefined && entry.itemDef.id !== null;  // Check if itemDef id exists
    });
  
    if (!isValid) {
      this.snackBarService.showError('Please fill all the required fields!');
      return;  
    }
  
    this.api.post('stock/mill-rates', this.millRate).subscribe(
      (res: any) => {
        this.snackBarService.showSuccess('Record Updated Successfully!');
        this.back(); 
      },
      (error) => {
        console.error('Error:', error);
        this.snackBarService.showError('An error occurred while saving data.');
      }
    );
  }
  
  onSrech(){
    this.api.post('stock/mill-rates-view',this.obj).subscribe((res:any)=>{
      this.list=res;
      console.log('ressponce',res)
    })
  }
  edit(data: any) {
    data.itemDef = { id: data.itemDefId };
    data.mill = { id: data.millId };
    delete data.itemDefId;
    delete data.millId;
    this.millRate = [data]; 
    document.getElementById('open-mill')?.click();
    console.log(data, 'edit');
  }
  
  back() {
      this.millRate = [{
        key: 0,
        sellerAccount: { code: 0 },
        millRate: 0,
        saleRate: 0,
        moisture: 0,
        cashRate: 0,
        entryDate: new Date(),
        mill:{id:1},
        itemDef: { id: 0 },
        expand: false,
        millRateEntries: [this.millRateEntry],
      }]; 
      console.log('wwwwwwwwwwwww',this.millRate)
    document.getElementById('cancelButton')?.click(); 
  }
  expandBtnClicked(parentData: any) {
    // console.log(parentData, "parentdata");
    console.log("ecapnce function calling");
  }
  addChaildRow(chRow: any, Cindex: any, parentRow: any) {
    debugger
      parentRow.millRateEntries.splice(Cindex + 1, 0, JSON.parse(JSON.stringify({
  
        key: 0,
        supplierAccount: { code: 0 },
         qty: 0,
        rate: 0,
        type: 'Limited',
      })));
  
    }
    deleteParentRow(Cindex: any) {
      if (this.millRate.length>1) {
        this.millRate.splice(Cindex, 1);
        console.log(this.millRate.length,'millsEntry');
      }
  
    }
    deleteChaildRow(chRow: any, Cindex: any, parentRow: any) {
      // parentRow.millRateEntries.splice(Cindex, 1);
      if (parentRow.millRateEntries.length>1) {
        parentRow.millRateEntries.splice(Cindex, 1);
      }
    }
    addParentRow(row: any, index: any) {
  
     // console.log(JSON.parse(JSON.stringify(this.newLaodingObj)), "llll")
      this.millRate.splice(index + 1, 0, JSON.parse(JSON.stringify({
  
          key: 0,
          millRate: 0,
          saleRate: 0,
          mill:{id:0},
          moisture: 0,
          cashRate: 0,
          itemDef: { id: 0 },
          expand: false,
          millRateEntries: [ {
            key: 0,
            supplierAccount: { code: 0 },
            qty: 0,
            rate: 0,
            type: 'Limited',
          }],
  
      })));
    }
    limitOrUnLimit(childRow: any): boolean {
      console.log(childRow.type === 'UnLimited')
      return childRow.type === 'UnLimited'; // Change 'Limited' to any value that should trigger readonly
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
}
