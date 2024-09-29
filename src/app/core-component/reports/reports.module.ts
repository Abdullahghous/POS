import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { CustomerReportComponent } from './customer-report/customer-report.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { IncomeReportComponent } from './income-report/income-report.component';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { InvoiceReportComponent } from './invoice-report/invoice-report.component';
import { ProfitAndLossComponent } from './profit-and-loss/profit-and-loss.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { SupplierReportComponent } from './supplier-report/supplier-report.component';
import { TaxReportComponent } from './tax-report/tax-report.component';
import { sharedModule } from 'src/app/shared/shared.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { GeneralLedgerComponent } from './general-ledger/general-ledger.component';
import { PrePurchaseReportComponent } from './pre-purchase-report/pre-purchase-report.component';
import { PrePurchaseFormComponent } from './pre-purchase-form/pre-purchase-form.component';



@NgModule({
  declarations: [
    ReportsComponent,
    CustomerReportComponent,
    ExpenseReportComponent,
    IncomeReportComponent,
    InventoryReportComponent,
    InvoiceReportComponent,
    ProfitAndLossComponent,
    PurchaseReportComponent,
    SalesReportComponent,
    SupplierReportComponent,
    TaxReportComponent,
    GeneralLedgerComponent,
    PrePurchaseReportComponent,
    PrePurchaseFormComponent
  ],
  imports: [CommonModule,
     ReportsRoutingModule, 
     sharedModule,
     NzSelectModule,
     NzTableModule,
    NzFormModule,
    NzInputModule
    ],
})
export class ReportsModule {}
