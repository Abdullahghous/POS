import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/core.index';
import { AllApiService } from 'src/app/core/service/allApi/all-api.service';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrl: './utilities.component.scss'
})
export class UtilitiesComponent {
  list : any = [];
  moduleList : any =[]
  sidebarData1:any=[]
  constructor(
    private apiService : HttpService,
    private snackBarService:SnackBarService
  ){
     this.getMenu();
  }
  obj:any={
    name:"",
    icon:"",
    tittle:"",
    showSubRoute:false,
    hasSubRoute:false,
    menu:[{
      name:"",
      tittle:"",
      route:"",
    }]
  }
  side:any=[{
      "tittle": "Main",
      "showAsTab": false,
      "separateRoute": false,
      "hasSubRoute": false,
      "showSubRoute": true,
      "expand": false,
      "menu": [
        {
          "tittle": "Dashboard",
          "hasSubRoute": true,
          "showSubRoute": true,
          "icon": "grid",
          "base1": "dashboard",
          "expand": false,
          "subMenus": [
            {
              "tittle": "Chat",
              "route": "your/chat/route/here",  // replace with actual route
              "hasSubRoute": false,
              "showSubRoute": false,
              "customSubmenuTwo": false
            }
          ]
        }
      ]
    }]
  
  getMenu(){
    // this.apiService.getObservable('auth/get-all-menu').subscribe((res:any)=>{
    //   console.log('get all Menu ::',res)
    //   this.list=res;
    // })
    // this.apiService.getObservable('auth/get-all-module').subscribe((res:any)=>{
    //   this.moduleList=res.map((fild:any)=>({
    //     ...fild,
    //     expand:false,
    //   }))
    //   console.log('get all -module ::',this.moduleList)
    // })
    this.apiService.getObservable('bar/getSideBarOneList').subscribe((res:any)=>{
      console.log('side bar',res);
      this.sidebarData1=res
    })
  
    
  }

  edit(data:any){
    document.getElementById('openu')?.click()
    console.log('edit Data::',data);
    this.obj=data;
  }
  editModule(data:any){
    debugger
    this.obj=data
    document.getElementById('edit-units')?.click()
    console.log('edit Data::',this.obj);
  }
  setSideBar(){
    this.apiService.post('bar/addOrUpdateSideBarOneList',this.sidebarData1).subscribe((res:any)=>{
      console.log('setMenu',res);
      
      document.getElementById('closeMenu')?.click();
      this.snackBarService.showSuccess('Menu Add or Update Sucseusfull')
    },
    error => {
      this.snackBarService.showError('An error occurred while adding the record!');
    })
  }
  setModule(){
    this.apiService.post('auth/add-or-update-module',this.obj).subscribe((res:any)=>{
      console.log('setModule',res,this.obj);
      document.getElementById('closeMenu')?.click();
      this.snackBarService.showSuccess('Module Add or Update Sucseusfull')
    },
    error => {
      this.snackBarService.showError('An error occurred while adding the record!');
    })
  }
  addGrandRow(data: any) {
    const newGrand = {
      tittle: '',
      icon: '',
      showAsTab: false,
      showSubRoute: true,
      menu: [{
        tittle: '',
        hasSubRoute: true,
        showSubRoute:true,
        icon: '',
        subMenus: [{
          tittle: '',
          route: '',
          CustomSubmenuTwo: ''
        }],
        expand: false
      }],
      hasSubRoute: false,

      expand: false
    };
    this.sidebarData1.push(newGrand);
  }
  addParentRow(module: any) {
    const newParent = {
      tittle: '',
      hasSubRoute: true,
      showSubRoute:true,
      icon: '',
      subMenus: [{
        tittle: '',
        route: '',
        CustomSubmenuTwo: ''
      }],
      expand: false
    };
    this.sidebarData1.menu.push(newParent);
  }
  
  addChildRow(menu: any) {
    const newChild = {
      tittle: '',
      route: '',
      CustomSubmenuTwo: ''
    };
    this.sidebarData1.menu.subMenus.push(newChild);
  }
  
}
