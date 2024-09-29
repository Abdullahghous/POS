import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KantaComponent } from './kanta.component';
import { CompleteWeightEntryComponent } from './complete-weight-entry/complete-weight-entry.component';

const routes: Routes = [
  {
    path: '',
    component: KantaComponent,
    children: [
      { path: 'complete-weight-entry', component:CompleteWeightEntryComponent  },
      // { path: 'product-location-entry', component: ProductLocationEntryComponent },
      // { path: 'product-activity', component:ProductActivityComponent },
      // { path: 'thekedar-entry', component: ThekedarEntryComponent},
      // { path: 'monshi-entry', component: MonshiEntryComponent },
      // { path: 'purchase-returns', component: PurchaseReturnsComponent },
      // { path: 'purchase-voucher', component: PurchaseVoucherComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KantaRoutingModule { }
