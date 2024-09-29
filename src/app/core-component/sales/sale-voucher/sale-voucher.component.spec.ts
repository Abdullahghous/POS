import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleVoucherComponent } from './sale-voucher.component';

describe('SaleVoucherComponent', () => {
  let component: SaleVoucherComponent;
  let fixture: ComponentFixture<SaleVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleVoucherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaleVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
