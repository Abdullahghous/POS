import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSalesComponent } from './direct-sales.component';

describe('DirectSalesComponent', () => {
  let component: DirectSalesComponent;
  let fixture: ComponentFixture<DirectSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectSalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
