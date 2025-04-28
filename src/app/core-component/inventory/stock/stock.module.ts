import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import { LowStocksComponent } from './low-stocks/low-stocks.component';
import { sharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [
    StockComponent,
    LowStocksComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    sharedModule,
    MatInputModule,
    NzSelectModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
  ]
})
export class StockModule { }
