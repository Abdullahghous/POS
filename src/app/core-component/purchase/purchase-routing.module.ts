import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseComponent } from './purchase.component';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import { PurchaseOrderReportComponent } from './purchase-order-report/purchase-order-report.component';
import { PurchaseReturnsComponent } from './purchase-returns/purchase-returns.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { PurchaseOrderFormComponent } from './purchase-order-form/purchase-order-form.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { PurchaseVoucherComponent } from './purchase-voucher/purchase-voucher.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseComponent,
    children: [
      { path: 'purchase-list', component: PurchaseListComponent },
      { path: 'purchase-order-report', component: PurchaseOrderReportComponent },
      { path: 'purchase-order-form', component: PurchaseOrderFormComponent },
      { path: 'purchase-order-list', component: PurchaseOrderListComponent },
      { path: 'purchase-report', component: PurchaseReportComponent },
      { path: 'purchase-returns', component: PurchaseReturnsComponent },
      { path: 'purchase-voucher', component: PurchaseVoucherComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRoutingModule {}
