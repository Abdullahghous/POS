import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KantaRoutingModule } from './kanta-routing.module';
import { KantaComponent } from './kanta.component';
import { CompleteWeightEntryComponent } from './complete-weight-entry/complete-weight-entry.component';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AdvancedUiRoutingModule } from '../advanced-ui/advanced-ui-routing.module';
import { AdvancedUiComponent } from '../advanced-ui/advanced-ui.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
// import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    KantaComponent,
    CompleteWeightEntryComponent,
     
  ],
  imports: [
    CommonModule,
    KantaRoutingModule,
    FormsModule,
    NzTableModule,
    NzSelectModule,
    NzInputModule,
    // AdvancedUiRoutingModule,
    ScrollingModule,
    // BrowserModule,
  ]
})
export class KantaModule { }
