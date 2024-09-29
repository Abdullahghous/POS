import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales.component';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SalesReturnsComponent } from './sales-returns/sales-returns.component';
import { QuotationListComponent } from './quotation-list/quotation-list.component';
import { PosComponent } from './pos/pos.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { CustmorStatusReportComponent } from './custmor-status-report/custmor-status-report.component';
import { DirectSalesComponent } from './direct-sales/direct-sales.component';
import { SalesOrderFormComponent } from './sales-order-form/sales-order-form.component';
import { SaleVoucherComponent } from './sale-voucher/sale-voucher.component';

const routes: Routes = [{ path: '', component: SalesComponent,
children: [
  {
    path: 'sales-list',
    component: SalesListComponent
  },
  {
    path: 'sales-return',
    component: SalesReturnsComponent
  },
  {
    path: 'quotation-list',
    component: QuotationListComponent
  },
  {
    path: 'pos',
    component: PosComponent
  },
  {
    path: 'sales-order',
    component: SalesOrderComponent
  },
  {
    path: 'custmor-status-report',
    component: CustmorStatusReportComponent
  },
  {
    path: 'direct-sales',
    component: DirectSalesComponent
  },
  {
    path: 'sales-order-form',
    component: SalesOrderFormComponent
  },
  {
    path: 'sale-voucher',
    component: SaleVoucherComponent
  },

]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
