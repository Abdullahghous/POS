import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  Event as RouterEvent,
} from '@angular/router';
import {
  CommonService,
  SettingsService,
  SidebarService,
} from '../core/core.index';
import { url } from '../shared/model/sidebar.model';
import { BehaviorSubject } from 'rxjs';
import { AuthServiceService } from '../core/service/http/auth-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-core-component.',
  templateUrl: './core-component.component.html',
  styleUrls: ['./core-component.component.scss'],
})
export class CoreComponentComponent implements OnInit {
  public miniSidebar = false;
  public expandMenu = false;
  public mobileSidebar = false;
  public sideBaractivePath = false;
  public themeMode: string = '';
  public layoutMode: string = '';
  public navigationColor: string = '';
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();
  
  public loginUserData: any;
  public firstname: any;
  public lastname: any;
  msgToDisplay = '';

  base = '';
  page = '';
  last = '';

  constructor(
    private Router: Router,
    private settings: SettingsService,
    private sidebar: SidebarService,
    private common: CommonService,
    private renderer: Renderer2,
    private authService: AuthServiceService
  ) {
    this.sidebar.toggleMobileSideBar.subscribe((res: string) => {
      if (res == 'true' || res == 'true') {
        this.mobileSidebar = true;
      } else {
        this.mobileSidebar = false;
      }
    });
    this.sidebar.expandSideBar.subscribe((res: boolean) => {
      this.expandMenu = res;
    });
    this.Router.events.subscribe((data: RouterEvent) => {
      if (data instanceof NavigationStart) {
        this.getRoutes(data);
      }
      if (data instanceof NavigationEnd) {
        localStorage.removeItem('isMobileSidebar');
        this.mobileSidebar = false;
      }
      if (this.page === 'pos') {
        localStorage.removeItem('sideBarPosition');
      }
    });
    this.sidebar.sideBarPosition.subscribe((res: string) => {
      if (res == 'true' && this.page !== 'pos') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
    this.settings.themeMode.subscribe((mode) => {
      this.themeMode = mode;
    });
    this.settings.layoutMode.subscribe((layout) => {
      this.layoutMode = layout;
    });
    this.settings.navigationColor.subscribe((color) => {
      this.navigationColor = color;
    });
    this.settings.themeMode.subscribe((res: string) => {
      if (res == 'dark_mode') {
        this.renderer.addClass(document.body, 'dark-select');
      } else {
        this.renderer.removeClass(document.body, 'dark-select');
      }
    });
    this.getRoutes(this.Router);
  }

  private getRoutes(data: url): void {
    const splitVal = data.url.split('/');
    this.base = splitVal[1];
    this.page = splitVal[2];
    this.last = splitVal[3];
    this.common.base.next(splitVal[1]);
    this.common.page.next(splitVal[2]);
    this.common.last.next(splitVal[3]);
    if (
      data.url.split('/')[1] === 'errorpages' ||
      data.url.split('/')[2] === 'pos' ||
      data.url.split('/')[1] === 'auth'
    ) {
      this.sideBaractivePath = true;
    } else {
      this.sideBaractivePath = false;
    }
    if (data.url.split('/')[2] === 'pos') {
      this.sideBaractivePath = true;
    }
    if (this.page === 'pos') {
      this.miniSidebar = false;
    }
  }

  isCollapsed: boolean = false;

  ngOnInit(): void {
    this.sidebar.collapse$.subscribe((collapse: boolean) => {
      this.isCollapsed = collapse;
    });

    const logInUserInfo = this.authService.getLoggedInUserInfo()?.Success;
    if(logInUserInfo) {
      this.firstname = logInUserInfo?.firstName;
      this.lastname = logInUserInfo?.lastName;
      this.msgToDisplay = `Hello ${ this.firstname ? this.firstname : environment.PRODUCT_NAME } ${ this.lastname ? this.lastname : '' }, All menus on the sidebar are now functional. Once the other features are completed, you will also be able to access those menus on the sidebar. In case of any issues or bugs, please report them to us.`
    }
  }

  showLoader() {
    this._loading.next(true);
  }

  hideLoader() {
    setTimeout(() => {
      this._loading.next(false);
      window.scrollTo(0, 0);
    }, 1200);
  }
}
