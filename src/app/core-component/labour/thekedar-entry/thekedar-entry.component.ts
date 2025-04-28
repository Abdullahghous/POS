import {Component, OnInit} from '@angular/core';
import { HttpService, SidebarService, routes  } from 'src/app/core/core.index';
import { SnackBarService } from 'src/app/core/service/snackBar/snack-bar.service';
import Swal from 'sweetalert2';
import {AllApiService} from "../../../core/service/allApi/all-api.service";


@Component({
  selector: 'app-thekedar-entry',
  templateUrl: './thekedar-entry.component.html',
  styleUrl: './thekedar-entry.component.scss'
})
export class ThekedarEntryComponent implements OnInit {
  thekedarList:any=[];
  itemDefs:any=[];
  loading: any[] = [];
  activity:any=[] 
  subCategory:any=[]
  public routes = routes;
  constructor(private sidebar: SidebarService,
    private apiService: HttpService,
    private  allApiService:AllApiService,
    private snackBarService: SnackBarService
  ){
   console.log(this.thekedar,"sdsdsdsdsdd");
  }
  ngOnInit(): void {
    this. getThekedarData();
    debugger
    this.itemDefs= this.allApiService.getItems();
      console.log(this.itemDefs ,'itttttem');
      this.getActivty();
      this.subSearch()
  }
  thekedar = {
    id: 0,
    expand: false,
    thekedarEntries: [{
      showRate: "0",
      hiddenRate: 0,
      itemSubCategory: {id:0},
      activity:{id:0},
      name: "",
      expand: false,
      date: new Date().toISOString().substring(0, 10),
      
    }],
    name: '',
    address: '',
    mobile: ''
  };


  getThekedarData(){
    debugger
    this.apiService.getObservable('thekedar/getAll').subscribe(
      (res:any) => {
  const  result =     res.map((item: any) => ({
          ...item,
          expand: false,
         
        }));
      console.log(result,('entriesss'))
        this.thekedarList=result;
      }
    );
  }
  getActivty(){
    this.apiService.getObservable('activity/getAll').subscribe(
      (res) =>{
        console.log(res,'accccttttvittyyyy')
        this.activity=res;
      }
    )
  }
  subSearch(){
    this.apiService.getObservable('item/get-all-item-sub-category').subscribe(
      (res) =>{
        console.log(res ,'subCategree====+++');
        this.subCategory=res;
      }
    )
  }
  expandBtnClicked(data:any){}
  addThekedar() {
    if (!this.thekedar.name ) {
      this.snackBarService.showError('plz fill Thekedar Name');
      return; // Exit the method if validation fails
    }
    const invalidEntry = this.thekedar.thekedarEntries.find(entry => 
      entry.hiddenRate === 0 ||
      entry.itemSubCategory?.id === 0 ||
      entry.activity?.id === 0 
    );
  
    if (invalidEntry) {
      this.snackBarService.showError('Please fill all required fields in the Thekedar entry');
      return;
    }

    this.apiService.post('thekedar/addOrUpdate', this.thekedar).subscribe(
      (res) => {
        document.getElementById('cancelbtn')?.click();
        if (res) {
          this.snackBarService.showSuccess('Record Added Successfully!');
          this.getThekedarData();
          // Reload the page after showing the success message
          // Add a small delay to allow the user to see the success message
        } else {
          this.snackBarService.showError('Please fill all the required fields!');
        }
      },
      (_error) => {
        this.snackBarService.showError('An error occurred while adding the record!');
      }
    );
  }
  cancel(){
    debugger
    this.thekedar = {
      id: 0,
      expand: false,
      thekedarEntries: [{
        showRate: "0",
        hiddenRate: 0,
        itemSubCategory: {id:0},
        activity:{id:0},
        name: "",
        expand: false,
        date: new Date().toISOString().substring(0, 10),
        
      }],
      name: '',
      address: '',
      mobile: ''
    };
  }
  editThekedar(edit:any){
    debugger
    this.thekedar =edit;
  //   this.thekedar.thekedarEntries = this.thekedar.thekedarEntries ?? [];
  //   if (!edit.thekedarEntries.itemSubCategory) {
  //     this.thekedar.thekedarEntries[0].itemSubCategory = { id: 0 }; // Initialize if null
  // }
  // if (!edit.thekedarEntries.activity) {
  //     this.thekedar.thekedarEntries[0].activity = { id: 0 }; // Initialize if null
  // }
  //   if(this.thekedar.thekedarEntries?.length>0){
  //     console.log('edit::', edit);
  //   }
  //   else{
  //     console.log(this.thekedar.thekedarEntries,"ssssss");
  //     this.thekedar.thekedarEntries.push({
  //       showRate: "0",
  //       hiddenRate: 0,
  //       itemSubCategory:{id:0},
  //       activity:{id:0},
  //       name: "asif idr",
  //       expand: false,
  //       date: new Date().toISOString().substring(0, 10),
  //       // isEditing: false
  //     })
  //   }

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
  deleteRow(i: number): void {
    if (this.thekedar.thekedarEntries.length > 1) {
      this.thekedar.thekedarEntries.splice(i, 1);
    }
  }

  addNewRow(data: any, i: number) {
    this.thekedar.thekedarEntries.push({
      showRate: "0",
      hiddenRate: 0,
      itemSubCategory: {id:0},
      activity:{id:0},
      name: "asif idr",
      expand: false,
      date: new Date().toISOString().substring(0, 10)
      })
  }
}

