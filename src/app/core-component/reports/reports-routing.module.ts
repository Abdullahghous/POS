import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { CustomerReportComponent } from './customer-report/customer-report.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { IncomeReportComponent } from './income-report/income-report.component';
import { InvoiceReportComponent } from './invoice-report/invoice-report.component';
import { ProfitAndLossComponent } from './profit-and-loss/profit-and-loss.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { SupplierReportComponent } from './supplier-report/supplier-report.component';
import { TaxReportComponent } from './tax-report/tax-report.component';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { GeneralLedgerComponent } from './general-ledger/general-ledger.component';
import { PrePurchaseReportComponent } from './pre-purchase-report/pre-purchase-report.component';
import { PrePurchaseFormComponent } from './pre-purchase-form/pre-purchase-form.component';
import { SupplierStatusReportComponent } from './supplier-status-report/supplier-status-report.component';
import { DalySummryReportComponent } from './daly-summry-report/daly-summry-report.component';

const routes: Routes = [{ path: '', component: ReportsComponent,
children: [
  {
    path: 'customer-report',
    component: CustomerReportComponent
  },
  {
    path: 'expense-report',
    component: ExpenseReportComponent
  },
  {
    path: 'income-report',
    component: IncomeReportComponent
  },
  {
    path: 'inventory-report',
    component: InventoryReportComponent
  },
  {
    path: 'invoice-report',
    component: InvoiceReportComponent
  },
  {
    path: 'profit-and-loss',
    component: ProfitAndLossComponent
  },
  {
    path: 'purchase-report',
    component: PurchaseReportComponent
  },
  {
    path: 'sales-report',
    component: SalesReportComponent
  },
  {
    path: 'general-ledger',
    component: GeneralLedgerComponent
  },
  {
    path: 'supplier-report',
    component: SupplierReportComponent
  },
  {
    path: 'tax-report',
    component: TaxReportComponent
  },
  {
    path: 'pre-purchase-form',
    component: PrePurchaseFormComponent
  },
  {
    path: 'supplier-status-report',
    component: SupplierStatusReportComponent
  },
  {
    path: 'pre-purchase-report',
    component: PrePurchaseReportComponent
  },
  {
    path: 'daly-summry-report',
    component: DalySummryReportComponent
  }
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
