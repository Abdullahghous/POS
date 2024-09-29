import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherDetailListComponent } from './voucher-detail-list.component';

describe('VoucherDetailListComponent', () => {
  let component: VoucherDetailListComponent;
  let fixture: ComponentFixture<VoucherDetailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherDetailListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoucherDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
