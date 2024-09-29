import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonshiEntryComponent } from './monshi-entry.component';

describe('MonshiEntryComponent', () => {
  let component: MonshiEntryComponent;
  let fixture: ComponentFixture<MonshiEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonshiEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonshiEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
