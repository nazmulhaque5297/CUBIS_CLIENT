import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSettlementComponent } from './loan-settlement.component';

describe('LoanSettlementComponent', () => {
  let component: LoanSettlementComponent;
  let fixture: ComponentFixture<LoanSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanSettlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
