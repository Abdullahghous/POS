import { Component } from '@angular/core';
import { HttpService, SidebarService, routes  } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-monshi-entry',
  templateUrl: './monshi-entry.component.html',
  styleUrl: './monshi-entry.component.scss'
})
export class MonshiEntryComponent {
  monshiList:any=[]
  successMessage: any = '';
  isButtonDisabled = false;
  public routes = routes;
  constructor(private sidebar: SidebarService,
    private apiService: HttpService,
    private snackBarService: SnackBarService
  ){
   this. getMonshiData();
  }
  obj:any={
    name:'',
    address:'',
    mobile:''
  }
  veiw:any={

  }
  getMonshiData(){
    this.apiService.getObservable('monshi/getAll').subscribe(
      (res) => {
          console.log(res, 'mooonhi');
          this.monshiList=res;
      }
    );
  }
  addMunshi() { 
    this.isButtonDisabled = true;
    this.apiService.post('monshi/addOrUpdate', this.obj).subscribe(
      (res) => {
        if (res) {
          this.snackBarService.showSuccess('Record Added Successfully!');
          // Reload the page after showing the success message
          setTimeout(() => {
            window.location.reload();
          }, 1000); // Add a small delay to allow the user to see the success message
        } else {
          this.snackBarService.showError('Please fill all the required fields!');
        }
      },
      (_error) => {
        this.isButtonDisabled = false;
        this.snackBarService.showError('An error occurred while adding the record!');
      }
    
    );
  }
  editMunshi(edit:any){ 
 
    this.obj =edit;
    console.log(this.obj,"dsddsdsdas");
  }
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
}
