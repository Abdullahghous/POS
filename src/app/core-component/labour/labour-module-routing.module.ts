import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabourComponent } from './labour/labour.component';
// import { LoadingUnloadingEntryComponent } from './loading-unloading-entry/loading-unloading-entry.component';
import { ProductLocationEntryComponent } from './product-location-entry/product-location-entry.component';
import { ActivityComponent } from './activity/activity.component';
import { ThekedarEntryComponent } from './thekedar-entry/thekedar-entry.component';
import { MonshiEntryComponent } from './monshi-entry/monshi-entry.component';
import { ProductTravelRecordComponent } from './product-travel-record/product-travel-record.component';



const routes: Routes = [
  {
    path: '',
    component: LabourComponent,
    children: [
      // { path: 'loading-unloading-entry', component: LoadingUnloadingEntryComponent },
      { path: 'product-location-entry', component: ProductLocationEntryComponent },
      { path: 'activity', component:ActivityComponent },
      { path: 'thekedar-entry', component: ThekedarEntryComponent},
      { path: 'monshi-entry', component: MonshiEntryComponent },
      { path: 'product-travel-record', component: ProductTravelRecordComponent },
      // { path: 'purchase-voucher', component: PurchaseVoucherComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabourModuleRoutingModule { }
