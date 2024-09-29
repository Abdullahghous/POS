import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KantaComponent } from './kanta.component';

describe('KantaComponent', () => {
  let component: KantaComponent;
  let fixture: ComponentFixture<KantaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KantaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KantaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
