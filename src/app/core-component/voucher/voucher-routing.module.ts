import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoucherComponent } from './voucher/voucher.component';
import { VoucherDetailListComponent } from './voucher-detail-list/voucher-detail-list.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { NewVoucherComponent } from './new-voucher/new-voucher.component';

const routes: Routes = [{ path: '', component: VoucherComponent, 
    children: [
     
      {
        path: 'voucher-detail-list', 
        component: VoucherDetailListComponent, 
      },
      {
        path: 'voucher-list', 
        component: VoucherListComponent, 
      },
      {
        path: 'profit-loss', 
        component: ProfitLossComponent, 
      },
      {
        path: 'new-voucher', 
        component:NewVoucherComponent 
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoucherRoutingModule {}
