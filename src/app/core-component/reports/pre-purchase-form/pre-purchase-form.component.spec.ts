import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePurchaseFormComponent } from './pre-purchase-form.component';

describe('PrePurchaseFormComponent', () => {
  let component: PrePurchaseFormComponent;
  let fixture: ComponentFixture<PrePurchaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrePurchaseFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrePurchaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
