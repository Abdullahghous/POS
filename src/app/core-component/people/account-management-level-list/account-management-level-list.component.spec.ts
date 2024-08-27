import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagementLevelListComponent } from './account-management-level-list.component';

describe('AccountManagementLevelListComponent', () => {
  let component: AccountManagementLevelListComponent;
  let fixture: ComponentFixture<AccountManagementLevelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountManagementLevelListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountManagementLevelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
