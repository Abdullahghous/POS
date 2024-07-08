import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { sharedModule } from 'src/app/shared/shared.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminDashboardComponent,
    SalesDashboardComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, sharedModule, NzAlertModule, NzButtonModule],
})
export class DashboardModule {}
