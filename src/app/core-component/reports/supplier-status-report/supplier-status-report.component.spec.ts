import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierStatusReportComponent } from './supplier-status-report.component';

describe('SupplierStatusReportComponent', () => {
  let component: SupplierStatusReportComponent;
  let fixture: ComponentFixture<SupplierStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierStatusReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
