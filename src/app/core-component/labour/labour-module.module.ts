import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabourModuleRoutingModule } from './labour-module-routing.module';
import { LabourComponent } from './labour/labour.component';
import { ActivityComponent } from './activity/activity.component';
import { ProductLocationEntryComponent } from './product-location-entry/product-location-entry.component';
import { ThekedarEntryComponent } from './thekedar-entry/thekedar-entry.component';
// import { LoadingUnloadingEntryComponent } from './loading-unloading-entry/loading-unloading-entry.component';
import { MonshiEntryComponent } from './monshi-entry/monshi-entry.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductTravelRecordComponent } from './product-travel-record/product-travel-record.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { sharedModule } from 'src/app/shared/shared.module';




@NgModule({
  declarations: [
    LabourComponent,
    // LoadingUnloadingEntryComponent,
    ActivityComponent,
    ProductLocationEntryComponent,
    ThekedarEntryComponent,
    MonshiEntryComponent,
    ProductTravelRecordComponent,
    
  ],
  imports: [
    CommonModule,
    LabourModuleRoutingModule,
    NzTableModule,
    FormsModule,
    NzSelectModule,
    ReactiveFormsModule,
    sharedModule
  ]
})
export class LabourModuleModule { }
