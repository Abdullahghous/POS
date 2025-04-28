import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { SalesReturnsComponent } from './sales-returns/sales-returns.component';
import { QuotationListComponent } from './quotation-list/quotation-list.component';
import { PosComponent } from './pos/pos.component';
import { SalesListComponent } from './sales-list/sales-list.component';
import { sharedModule } from 'src/app/shared/shared.module';
import { CustmorStatusReportComponent } from './custmor-status-report/custmor-status-report.component';
import { DirectSalesComponent } from './direct-sales/direct-sales.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SalesOrderFormComponent } from './sales-order-form/sales-order-form.component';
import { SaleVoucherComponent } from './sale-voucher/sale-voucher.component';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SalesComponent,
    SalesReturnsComponent,
    QuotationListComponent,
    PosComponent,
    SalesListComponent,
    SalesListComponent,
    CustmorStatusReportComponent,
    DirectSalesComponent,
    SalesOrderComponent,
    SalesOrderFormComponent,
    SaleVoucherComponent,
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    sharedModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    UpperCasePipe,
    FormsModule
    

  ],
 
})
export class SalesModule { }
