import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingReportComponent } from './trading-report.component';

describe('TradingReportComponent', () => {
  let component: TradingReportComponent;
  let fixture: ComponentFixture<TradingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
