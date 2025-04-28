import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { VoucherRoutingModule } from './voucher-routing.module';
import { VoucherComponent } from './voucher/voucher.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { VoucherDetailListComponent } from './voucher-detail-list/voucher-detail-list.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { NewVoucherComponent } from './new-voucher/new-voucher.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  declarations: [
    VoucherComponent,
    VoucherDetailListComponent,
    VoucherListComponent,
    ProfitLossComponent,
    NewVoucherComponent,
    ProfitLossComponent
  ],
  imports: [
    CommonModule,
    VoucherRoutingModule,
    NzTableModule,
    NzSelectModule,
    FormsModule,
    NzPaginationModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    ScrollingModule
  ]
})
export class VoucherModule { }
