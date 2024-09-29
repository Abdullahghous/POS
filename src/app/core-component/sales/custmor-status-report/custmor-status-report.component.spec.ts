import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustmorStatusReportComponent } from './custmor-status-report.component';

describe('CustmorStatusReportComponent', () => {
  let component: CustmorStatusReportComponent;
  let fixture: ComponentFixture<CustmorStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustmorStatusReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustmorStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
