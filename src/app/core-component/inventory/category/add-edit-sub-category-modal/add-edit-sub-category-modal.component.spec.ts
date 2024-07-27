import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSubCategoryModalComponent } from './add-edit-sub-category-modal.component';

describe('AddEditSubCategoryModalComponent', () => {
  let component: AddEditSubCategoryModalComponent;
  let fixture: ComponentFixture<AddEditSubCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditSubCategoryModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditSubCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
