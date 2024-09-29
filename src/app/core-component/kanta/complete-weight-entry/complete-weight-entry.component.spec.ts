import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteWeightEntryComponent } from './complete-weight-entry.component';

describe('CompleteWeightEntryComponent', () => {
  let component: CompleteWeightEntryComponent;
  let fixture: ComponentFixture<CompleteWeightEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteWeightEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteWeightEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
