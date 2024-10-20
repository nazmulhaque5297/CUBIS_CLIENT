import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitLossAppropriationComponent } from './profit-loss-appropriation.component';

describe('ProfitLossAppropriationComponent', () => {
  let component: ProfitLossAppropriationComponent;
  let fixture: ComponentFixture<ProfitLossAppropriationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitLossAppropriationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitLossAppropriationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
