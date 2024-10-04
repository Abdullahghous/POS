import { Component } from '@angular/core';
import { HttpService, SidebarService } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent {
  activity:any=[];
  
  constructor(private apiService:HttpService,
    private sidebar:SidebarService,
    private snackBarService: SnackBarService
  ){
    this.getActivity();
  }
  obj={
    id:0,
    name:"",
    data:""
  }
  
 getActivity(){
  debugger
  this.apiService.getObservable('activity/getAll').subscribe(
    (res) =>{
      console.log(res,'accccttttvittyyyy')
      this.activity=res;
    }
  )
 }
 addActivity(){
  if (!this.obj.name) {
    this.snackBarService.showError('Please fill name the required fields!');
    return; // Exit the method if validation fails
  }
  this.apiService.post('activity/addOrUpdate' ,this.obj).subscribe(
    (res) =>{
      document.getElementById('close')?.click();
      if (res) {
        this.snackBarService.showSuccess('Record Added Successfully!');
        setTimeout(() => {
          this.getActivity();
        }, 1000); // Add a small delay to allow the user to see the success message
      } else {
        this.snackBarService.showError('Please fill all the required fields!');
      }
    },
    (_error) => {
      this.snackBarService.showError('An error occurred while adding the record!');
    }
  )
 }
 cancel(){
  this.obj={
    id:0,
    name:"",
    data:""
  }
 }
 editActivity(data:any){
  this.obj=data;
 }
 isCollapsed: boolean = false;
 toggleCollapse() {
   this.sidebar.toggleCollapse();
   this.isCollapsed = !this.isCollapsed;
 }
}
