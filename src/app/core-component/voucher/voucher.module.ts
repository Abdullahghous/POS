import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoucherRoutingModule } from './voucher-routing.module';
import { VoucherComponent } from './voucher/voucher.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { VoucherDetailListComponent } from './voucher-detail-list/voucher-detail-list.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { NewVoucherComponent } from './new-voucher/new-voucher.component';


@NgModule({
  declarations: [
    VoucherComponent,
    VoucherDetailListComponent,
    VoucherListComponent,
    ProfitLossComponent,
    NewVoucherComponent
  ],
  imports: [
    CommonModule,
    VoucherRoutingModule,
    NzTableModule,
    NzSelectModule,
    FormsModule
  ]
})
export class VoucherModule { }
