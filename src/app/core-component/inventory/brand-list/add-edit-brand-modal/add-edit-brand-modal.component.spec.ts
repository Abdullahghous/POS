import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBrandModalComponent } from './add-edit-brand-modal.component';

describe('AddEditBrandModalComponent', () => {
  let component: AddEditBrandModalComponent;
  let fixture: ComponentFixture<AddEditBrandModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditBrandModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditBrandModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
