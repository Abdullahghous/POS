import { Component } from '@angular/core';
import { HttpService, SidebarService, routes  } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-thekedar-entry',
  templateUrl: './thekedar-entry.component.html',
  styleUrl: './thekedar-entry.component.scss'
})
export class ThekedarEntryComponent {
  thekedarList:any=[];
  itemDefs:any=[];
 
  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  public routes = routes;
  constructor(private sidebar: SidebarService,
    private apiService: HttpService,
    private snackBarService: SnackBarService
  ){
   this. getThekedarData();
   this.getAll();
  }
  thekedar={
    id:0,
    thekedarEntries:[{showRate:"",
    hiddenRate:0,
    itemDef:0,
    name:"",
    expand:false,
    date:"",}],
    name:'',
    address:'',
    mobile:'',
    
    }
   
  getThekedarData(){
    this.apiService.getObservable('thekedar/getAll').subscribe(
      (res) => {
          console.log(res, 'fnnnnnew');
          this.thekedarList=res;
      }
    );
  }
  expandBtnClicked(data:any){}
  addThekedar() {
    this.apiService.post('thekedar/addOrUpdate', this.thekedar).subscribe(
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
        this.snackBarService.showError('An error occurred while adding the record!');
      }
    );
  }
  
  editThekedar(edit:any){ 
 
    this.thekedar =edit;
    console.log(this.thekedar,"dttttttt");
  }
  getAll(){
    let items: any = localStorage.getItem('itemDefs');
  }
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  confirmColor(itemToDelete: any) {
    this.thekedar = itemToDelete; // Rename the variable to avoid using 'delete'
    
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'me-2 btn btn-danger'
      },
      buttonsStyling: false
    });
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      confirmButtonText: 'Yes, delete it!',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Here, you can call a delete function or API to delete the object
        this.apiService.delete(`thekedar/delete/${this.thekedar.id}`).subscribe(
          (res) => {
            if (res) {
              swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your record has been deleted.',
                'success'
              );
            } else {
              swalWithBootstrapButtons.fire(
                'Error!',
                'There was an issue deleting the record.',
                'error'
              );
            }
          },
          (error) => {
            swalWithBootstrapButtons.fire(
              'Error!',
              'An error occurred while deleting the record.',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your record is safe :)',
          'error'
        );
      }
    });
  }
}

