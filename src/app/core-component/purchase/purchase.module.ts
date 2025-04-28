import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseComponent } from './purchase.component';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import { PurchaseOrderReportComponent } from './purchase-order-report/purchase-order-report.component';
// import { PurchaseReturnsComponent } from './purchase-returns/purchase-returns.component';
import { sharedModule } from 'src/app/shared/shared.module';
// import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { PurchaseOrderFormComponent } from './purchase-order-form/purchase-order-form.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { PurchaseVoucherComponent } from './purchase-voucher/purchase-voucher.component';
import { TradingReportComponent } from './trading-report/trading-report.component';


@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseListComponent,
    PurchaseOrderReportComponent,
    // PurchaseReturnsComponent,
    // PurchaseReportComponent,
    PurchaseOrderFormComponent,
    PurchaseOrderListComponent,
    PurchaseVoucherComponent,
    TradingReportComponent
    
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    sharedModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule
  ]
})
export class PurchaseModule { }
