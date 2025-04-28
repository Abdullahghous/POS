import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  DataService,
  pageSelection,
  apiResultFormat,
  routes,
  HttpService,
} from 'src/app/core/core.index';
import { AuthServiceService } from 'src/app/core/service/http/auth-service.service';
import { SidebarService } from 'src/app/core/service/sidebar/sidebar.service';
import { rolesPermissions } from 'src/app/shared/model/page.model';
import { PaginationService, tablePageSize } from 'src/app/shared/shared.index';
import Swal from 'sweetalert2';
interface data {
  value: string;
}

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrl: './roles-permissions.component.scss',
})
export class RolesPermissionsComponent {
  initChecked = false;
  public routes = routes;
  isCollapsed: boolean = false;
  user:any={};
  // roule:any=[]
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  userData:any=[]

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
    private sidebar: SidebarService,
    private apiService: HttpService,
    private authService: AuthServiceService
  ) {
    const raw = this.authService.getLoggedInUserInfo();
    this.userData=[raw]
    // Safely access moduleList and flatten if nested
    let flatUsers = Array.isArray(raw?.moduleList) ? raw.moduleList.flat(Infinity) : [];
  
    // Add expanded flags
    this.user = flatUsers.map((user: any) => ({
      ...user,
      expandedUser: false,
      detail: user.detail?.map((detail: any) => ({
        ...detail,
        expandedDetail: false
      })) ?? []
    }));
    this.getAll();
    console.log('Processed user list:', this.user);
    console.log(' user data:', this.userData);
  }
  

  getAll(){
    this.apiService.getObservable('auth/get-all-users').subscribe((res:any)=>{
      console.log('get All User ::',res)
    })
    
  }

 
  public filter = false;
  openFilter() {
    this.filter = !this.filter;
  }
  // selectAll(initChecked: boolean) {
  //   if (!initChecked) {
  //     this.tableData.forEach((f) => {
  //       f.isSelected = true;
  //     });
  //   } else {
  //     this.tableData.forEach((f) => {
  //       f.isSelected = false;
  //     });
  //   }
  // }
  
  confirmColor() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: ' btn btn-success',
        cancelButton: 'me-2 btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        confirmButtonText: 'Yes, delete it!',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          );
        }
      });
  } 

  // Function to toggle expand/collapse for the user (parent) table
  toggleUser(row: any) {
    row.expandedUser = !row.expandedUser;
  }

  // Function to toggle expand/collapse for the detail (child) table
  toggleDetail(detail: any) {
    detail.expandedDetail = !detail.expandedDetail;
  }
   // this.userData:any = [
  //   {
  //     name: 'ASIF',
  //     expandedUser: false, // Flag to control visibility of details for the parent
  //     detail: [
  //       {
  //         adress: 'KASRU',
  //         phone: '03001234567',
  //         expandedDetail: false, // Flag to control visibility of list for the detail
  //         list: [
  //           { adress: 'rajowal', pho: '1' }
  //         ]
  //       },
  //       {
  //         adress: 'lahore',
  //         phone: '03004243709',
  //         selected: false,
  //         expandedDetail: false, // Flag to control visibility of list for the detail
  //         list: [
  //           { adress: '3333', pho: '2' },
  //           { adress: '4444', pho: '33' },
  //           { adress: '3333', pho: '2' }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'SALEEM',
  //     expandedUser: false, // Flag to control visibility of details for the parent
  //     detail: [
  //       {
  //         adress: 'rajowal',
  //         phone: '03001234567',
  //         expandedDetail: false, // Flag to control visibility of list for the detail
  //         list: [
  //           { adress: 'rajowal', pho: '1' }
  //         ]
  //       },
  //       {
  //         adress: 'lahore',
  //         phone: '03004243709',
  //         selected: false,
  //         expandedDetail: false, // Flag to control visibility of list for the detail
  //         list: [
  //           { adress: 'level-3', pho: '2' }
  //         ]
  //       }
  //     ]
  //   }
  // ];
}
 