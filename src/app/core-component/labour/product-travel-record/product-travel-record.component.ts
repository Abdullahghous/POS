import { Component } from '@angular/core';
import { HttpService,SidebarService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-product-travel-record',
  templateUrl: './product-travel-record.component.html',
  styleUrl: './product-travel-record.component.scss'
})
export class ProductTravelRecordComponent {
  getLocation:any=[];
  itemDefs:any=[];
  travel:any=[];
  activity:any=[];
  thekedarList:any=[]
  thekedarEntryList:any=[]

  constructor(
    private api :HttpService,
    private allApiService:AllApiService,
    private sidebar:SidebarService,
    private snackBarService:SnackBarService
  ){
    this.dropDownsList();
    this.getItem();
  }
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  
  obj:any=[
      {location :{id:0} ,
      // mazodory:{id:0},
      // monshi: {id:1},
      activity: {id:0},
      thekedar:{id:0},
      // thekedarEntry:{id:0},
      itemDef:{id:0},
      remarks: "",
      status:true,
      bags: 0,
      rate:0
      }
  ]
  list={location :{id:0} ,
  mazodory:{id:0},
  monshi: {id:0},
  activity: {id:0},
  thekedar:{id:0},
  itemDef:{id:0},
  fromDate: new Date().toISOString().substring(0, 10),
  toDate: new Date().toISOString().substring(0, 10),
  
  }


  search(){
    debugger
    console.log(this.list);
    this.api.post('travel/getAll',this.list).subscribe(
      (res:any) =>{
      //   let total = 0;
      // res.forEach((item: any) => {
      //   if (item.hiddenRate && item.bags) {
      //     total = item.hiddenRate * item.bags;
      //   }
      // });
        console.log(res,'trrrrrvll');
        this.travel=res;
      }
    )
  }
  addTravel() {
    // Function to check if any field in the object is null or has a value of 0
    const isValid = this.obj.every((item: any) => {
      return (
        item.location.id !== null &&
        item.location.id !== 0 &&
        // item.monshi.id !== null &&
        // item.monshi.id !== 0 &&
        item.activity.id !== null &&
        item.activity.id !== 0 &&
        item.thekedar.id !== null &&
        item.thekedar.id !== 0 &&
        item.itemDef.id !== null &&
        item.itemDef.id !== 0 &&
        item.bags !== null &&
        item.bags !== 0
      );
    });
  
    // If validation fails, show an error message and exit the function
    if (!isValid) {
      this.snackBarService.showError('Please fill all the required fields!');
      return;
    }
  
    // If validation passes, proceed with the API call
    this.api.post('travel/addOrUpdate', this.obj).subscribe(
      (res) => {
        console.log(res, 'trrrrravrllll');
        if (res) {
          // debugger
          document.getElementById('cancelButton')?.click();
          this.snackBarService.showSuccess('Record Update Successfully!');
          
        } else {
          this.snackBarService.showError('Please fill all the required fields!');
        }
      },
      (_error) => {
        this.snackBarService.showError('An error occurred while adding the record!');
      }
    );
  }
  editTravel(data:any){ 
    console.log(data,"jjjjkkkk");  
    this.obj =[data];
    console.log(this.obj,"edit====travel");
  }
  
  dropDownsList(){
  this.api.getObservable('location/getAll').subscribe(
    (res) => {
    console.log(res,'loctionmmmmmm')
    this.getLocation = res;
    });
    this.api.getObservable('activity/getAll').subscribe(
      (res) =>{
        console.log(res,'accccttttvittyyyy')
        this.activity=res;
      }
    );
    this.api.getObservable('thekedar/getAll').subscribe(
      (res) => {
          console.log(res, 'fnnnnnew');
          this.thekedarList=res;
          this.thekedarList.forEach((thekedar:any) => {
              thekedar.thekedarEntries.forEach((entry:any)=>{
               this.thekedarEntryList.push({...entry,name:thekedar.name})
               console.log(this.thekedarEntryList,"thekedarEntry==5====");
              });
          });
      }
    );
  }
  cancel(){
    this.obj = [{location :{id:0} ,
      // mazodory:{id:0},
      // monshi: {id:1},
      activity: {id:0},
      thekedar:{id:0},
      // thekedarEntry:{id:0},
      itemDef:{id:0},
      remarks: "",
      status:true,
      bags: 0,
      rate:0
      }];
    document.getElementById('cancelButton')?.click();
  }
  getEntries(index:number){
    console.log(index,'indexxxx')
    // this.api.getObservable('thekedar/getById').subscribe(
    //   (res) =>{ 
    //     console.log(res,'identryess')
    //   }
    // )
  }
  getItem(){
    let items: any = localStorage.getItem('itemDefs');
    if (items != null && JSON.parse(items).length != 0) {
     this.itemDefs = JSON.parse(items);
    //  debugger
    }else{
      this.allApiService.getItemDefs();
      items = localStorage.getItem('itemDefs');
      this.itemDefs = JSON.parse(items);
    }

  } 
  deleteRow(i: number): void {
    if (this.obj.length > 1) {
      this.obj.splice(i, 1);
    }
  }
  
  addNewRow(data: any, i: number) {
    this.obj.splice(
      i + 1,
      0,
      JSON.parse(
        JSON.stringify({location :{id:0} ,
          // mazodory:{id:0},
          // monshi: {id:1},
          activity: {id:0},
          thekedar:{id:0},
          // thekedarEntry:{id:0},
          itemDef:{id:0},
          remarks: "",
          status:true,
          bags: 0,
          rate:0
          })
    )
   );
  }
  public filter = false;
  openFilter() {
   
    this.filter = !this.filter;
  }
}
