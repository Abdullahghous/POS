import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePurchaseReportComponent } from './pre-purchase-report.component';

describe('PrePurchaseReportComponent', () => {
  let component: PrePurchaseReportComponent;
  let fixture: ComponentFixture<PrePurchaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrePurchaseReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrePurchaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
