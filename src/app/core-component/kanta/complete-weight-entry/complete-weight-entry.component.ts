
// declare var bootstrap: any;
import { Component , ElementRef, OnInit ,Input, ViewChild} from '@angular/core';
import {SidebarService,HttpService,routes} from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import { Router } from '@angular/router';
import { elementAt, from } from 'rxjs';
import 'bootstrap'; 

// Declare the bootstrap variable to avoid TypeScript errors
declare var bootstrap: any;


@Component({
  selector: 'app-complete-weight-entry',
  templateUrl: './complete-weight-entry.component.html',
  styleUrl: './complete-weight-entry.component.scss',
})
export class CompleteWeightEntryComponent implements OnInit {
   
 
  public routes = routes;
   

  itemDefs: any[] = [];
  parties:any[]= [];
  getBranches:any[]= [];
  getCompanies:any[]= [];
  thekedar:any=[];
  location:any=[];
  monshi:any=[];
  kanta:any=[];
  // searchQuery: string = ''; // Holds search input
  // filteredReport: any[] = [];
 
  public searchDataValue = '';
  constructor(
    private sidebar: SidebarService,
    private apiService: HttpService,
    private allApiService:AllApiService,
    private snackBarService:SnackBarService,
    private router: Router
  ){
    const today = new Date();
    this.obj.fromDate = today.toISOString().split('T')[0];
    this.obj.toDate = today.toISOString().split('T')[0];
  }
  ngOnInit(): void {
    this.getAll();
    this.getThekedarData();
    this.getLocationData()
  }
  obj={
    "supplierAccount": {
        "id": "0",
        "name": ""
    },
    "itemDef": {
        "id": "0",
        "name": ""
    },
    "fromDate": "2024-09-19",
    "toDate": "2024-09-19"
}
  search(){
   this.apiService.post('kanta/complete_weight_entry', this.obj).subscribe((res:any) => {
    if (res) {
      const transformedItems= res.map((item: any) => ({
        ...item,
        dummyFirstDate: this.allApiService.formatDateDayMonthYear(item.firstDate),
        dummySecondDate: this.allApiService.formatDateDayMonthYear(item.secondDate)
    }));
      // res.forEach((element:any) => {
      //   element.firstDate =  this.allApiService.formatDateDayMonthYear(element.firstDate);
      //   element.secondDate = this.allApiService.formatDateDayMonthYear(element.secondDate);
      // });
      this.kanta = transformedItems;
      // this.filteredReport = transformedItems;
      console.log(res ,'kantaaaaaaa====')
    //
    }
   });
  }
  entry={
    "id": "0",
    "deduction": "0",
    "location": {
      "id": "0"
    },
    "monshi": {
      "id": "0"
    },
    // thekedar:0,
    "thekedar": {
      "id": "0",
    },
    "moisture": "0",
    monshiRemarks:"",
    juteBag:0,
    plasticBag:0,
    bags:0,

    // "rate": "0"
  }
   totalBags(){
    this.entry.bags=this.entry.juteBag + this.entry.plasticBag
   }
   editSave(){
    this.apiService.post('kanta/addExtaraInfo', this.entry).subscribe((res) => {
      // debugger
      if (res) {
        document.getElementById('cancelButton')?.click();
        this.snackBarService.showSuccess('Record Update Successfully!');
         
      } else {
        
        this.snackBarService.showError('Please fill all the required fields!');
      }
    },
    (_error) => {
      // const cancelButton = document.getElementById('cancelButton');
      // if (cancelButton) {
      //   cancelButton.click();
      // } 
      this.snackBarService.showError('An error occurred while adding the record!');
      

    });
   }
  editWeight(edit:any){ 
    edit.thekedar={id:0};
    this.entry =edit;
    console.log(this.entry,"edidttttttt");
  }
  getThekedarData(){
    this.apiService.getObservable('thekedar/getAll').subscribe(
      (res) => {
          this.thekedar=res;
      }
    );
    this.apiService.getObservable('monshi/getAll').subscribe(
      (res) => {
          // console.log(res, 'mooonhi');
          this.monshi=res;
      }
    );
  }
  // filterByName() {
  //   if (this.searchQuery) {
  //     this.filteredReport = this.kanta.filter((data: any) =>
  //       data.supplierAccount && data.supplierAccount.toLowerCase().includes(this.searchQuery.toLowerCase())
  //     );
  //   } else {
  //     this.filteredReport = this.kanta;
  //   }
  // }
  getLocationData(){
    this.apiService.getObservable('location/getAll').subscribe(
      (res) => {
          // console.log(res, 'mooonhi');
          this.location=res;
      }
    );
  }
  getAll(){
    let getCompanies: any = localStorage.getItem('companies');
    let items: any = localStorage.getItem('itemDefs');
    let parties: any = localStorage.getItem('parties');
    let getBranches: any = localStorage.getItem('branch');
    // console.log(getCompanies,'compnayyyy====8')
    if (items && parties && getBranches && getCompanies
       != null && JSON.parse(items).length != 0) {
      this.itemDefs = JSON.parse(items);
      this.parties =JSON.parse(parties);
      this.getBranches = JSON.parse(getBranches);
      this.getCompanies = JSON.parse(getCompanies);
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
      this.allApiService.getCompanies();
    getCompanies = localStorage.getItem('companies');
    this.getCompanies = JSON.parse(getCompanies);
     
     
    }
  }
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  public filter = false;
  openFilter() {
   
    this.filter = !this.filter;
  }
}


