import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DalySummryReportComponent } from './daly-summry-report.component';

describe('DalySummryReportComponent', () => {
  let component: DalySummryReportComponent;
  let fixture: ComponentFixture<DalySummryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DalySummryReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DalySummryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
