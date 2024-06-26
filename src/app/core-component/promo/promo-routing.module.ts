import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromoComponent } from './promo.component';

const routes: Routes = [
  { path: '', component: PromoComponent ,children:[{
    path: 'coupons',
    loadChildren: () =>
      import('./coupons/coupons.module').then((m) => m.CouponsModule),
  },]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromoRoutingModule {}
