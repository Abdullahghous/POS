import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTravelRecordComponent } from './product-travel-record.component';

describe('ProductTravelRecordComponent', () => {
  let component: ProductTravelRecordComponent;
  let fixture: ComponentFixture<ProductTravelRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTravelRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductTravelRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
