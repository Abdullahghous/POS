import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThekedarEntryComponent } from './thekedar-entry.component';

describe('ThekedarEntryComponent', () => {
  let component: ThekedarEntryComponent;
  let fixture: ComponentFixture<ThekedarEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThekedarEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThekedarEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
