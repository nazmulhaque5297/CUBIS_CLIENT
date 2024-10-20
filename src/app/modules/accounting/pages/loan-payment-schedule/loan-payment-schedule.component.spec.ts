import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPaymentScheduleComponent } from './loan-payment-schedule.component';

describe('LoanPaymentScheduleComponent', () => {
  let component: LoanPaymentScheduleComponent;
  let fixture: ComponentFixture<LoanPaymentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanPaymentScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanPaymentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
