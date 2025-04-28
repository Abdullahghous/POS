import { Component } from '@angular/core';
import { HttpService, SidebarService, routes  } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';

@Component({
  selector: 'app-monshi-entry',
  templateUrl: './monshi-entry.component.html',
  styleUrl: './monshi-entry.component.scss'
})
export class MonshiEntryComponent {
  monshiList:any[]=[]
  successMessage: any = '';
  searchQuery: string = '';
  filteredReport: any[] = [];
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
      (res:any) => {
          console.log(res, 'mooonhi');
          this.monshiList=res;
          this.filteredReport = res;
      }
    );
  }
  addMunshi() { 
    this.isButtonDisabled = true;
    this.apiService.post('monshi/addOrUpdate', this.obj).subscribe(
      (res) => {
        debugger
        document.getElementById('close')?.click();
        if (res) {
          this.snackBarService.showSuccess('Record Added Successfully!');
          
          setTimeout(() => {
            this.getMonshiData();
          }, 100); // Add a small delay to allow the user to see the success message
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
  filterByName() {
    console.log('Search Query:', this.searchQuery);
    if (this.searchQuery) {
        this.filteredReport = this.monshiList.filter((item) => 
            item.name && item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        console.log('Filtered Results:', this.filteredReport);
    } else {
        this.filteredReport = this.monshiList;
    }
}

  cancel(){
    this.obj={
      name:'',
      address:'',
      mobile:''
    }
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
