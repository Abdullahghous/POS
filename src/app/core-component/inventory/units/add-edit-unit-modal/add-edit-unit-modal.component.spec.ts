import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUnitModalComponent } from './add-edit-unit-modal.component';

describe('AddEditUnitModalComponent', () => {
  let component: AddEditUnitModalComponent;
  let fixture: ComponentFixture<AddEditUnitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditUnitModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditUnitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
