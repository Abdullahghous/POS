import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLocationEntryComponent } from './product-location-entry.component';

describe('ProductLocationEntryComponent', () => {
  let component: ProductLocationEntryComponent;
  let fixture: ComponentFixture<ProductLocationEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLocationEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductLocationEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
