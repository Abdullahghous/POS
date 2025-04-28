import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MillRateComponent } from './mill-rate.component';

describe('MillRateComponent', () => {
  let component: MillRateComponent;
  let fixture: ComponentFixture<MillRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MillRateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MillRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
