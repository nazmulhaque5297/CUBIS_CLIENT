import { TestBed } from '@angular/core/testing';

import { LoanPaymentScheduleService } from './loan-payment-schedule.service';

describe('LoanPaymentScheduleService', () => {
  let service: LoanPaymentScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanPaymentScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
