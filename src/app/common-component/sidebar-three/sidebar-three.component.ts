import { Component } from '@angular/core';
import { NavigationStart, Router, Event as RouterEvent } from '@angular/router';
import { HttpService, SidebarService } from 'src/app/core/core.index';
import { AuthServiceService } from 'src/app/core/service/http/auth-service.service';

@Component({
  selector: 'app-sidebar-three',
  templateUrl: './sidebar-three.component.html',
  styleUrls: ['./sidebar-three.component.scss'],
})
export class SidebarThreeComponent {
  opendSubMenu: Array<string | number> = [];
  public activePath = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public sidebarData: Array<any> = [];
  userData : any = null
  constructor(private sidebar: SidebarService, private router: Router,
    private authService : AuthServiceService,
    private apiService : HttpService
  ) {
    this.activePath = this.router.url.split('/')[1];
    this.router.events.subscribe((data: RouterEvent) => {
      if (data instanceof NavigationStart) {
        this.activePath = data.url.split('/')[1];
      }
      this.opendSubMenu[0] = ''
    });
    // this.apiService.getObservable('bar/getSideBarOneList').subscribe((res:any)=>{
    //   console.log('side bar',res);
    //   this.sidebarData=res
    // })
     this.sidebarData = this.sidebar.sidebarData3;
    //  debugger
    // this.userData = this.authService.getLoggedInUserInfo();
    // this.sidebarData = this.userData.moduleList;
    // console.log('sidebar3',this.sidebarData)
   
  }

  showMenu(val: string): void {
    if (this.opendSubMenu[0] != val) {
      this.opendSubMenu[0] = val;
    } else {
      this.opendSubMenu[0] = '';
    }
  }

  showSubMenu(val: string): void {
    if (this.opendSubMenu[1] != val) {
      this.opendSubMenu[1] = val;
    } else {
      this.opendSubMenu[1] = '';
    }
  }
}
