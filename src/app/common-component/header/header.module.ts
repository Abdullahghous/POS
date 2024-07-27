import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { User, Settings} from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';
import { NzSpaceModule } from 'ng-zorro-antd/space';

const icons = {
  User,
  Settings
};

@NgModule({
  declarations: [],

  imports: [
    CommonModule,
    NzAlertModule,
    NzButtonModule,
    NzSpaceModule,
    FeatherModule.pick(icons),
  ]
})
export class HeaderModule { }
