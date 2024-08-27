import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagementAddEditComponent } from './account-management-add-edit.component';

describe('AccountManagementAddEditComponent', () => {
  let component: AccountManagementAddEditComponent;
  let fixture: ComponentFixture<AccountManagementAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountManagementAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountManagementAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
