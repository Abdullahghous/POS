import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleComponent } from './people.component';
import { CustomersComponent } from './customers/customers.component';
import { StoreListComponent } from './store-list/store-list.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { sharedModule } from 'src/app/shared/shared.module';
import { AccountManagementLevelListComponent } from './account-management-level-list/account-management-level-list.component';
import { AccountManagementAddEditComponent } from './account-management-add-edit/account-management-add-edit.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BankAccountComponent } from './bank-account/bank-account.component';

@NgModule({
  declarations: [
    PeopleComponent,
    CustomersComponent,
    StoreListComponent,
    SuppliersComponent,
    WarehouseComponent,
    AccountManagementLevelListComponent,
    AccountManagementAddEditComponent,
    BankAccountComponent,
  ],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    sharedModule,
    NzSelectModule,
    NzInputModule
  ]
})
export class PeopleModule { }
