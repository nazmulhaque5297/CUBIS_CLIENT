import { TestBed } from '@angular/core/testing';

import { CsLoanRescheduleService } from './cs-loan-reschedule.service';

describe('CsLoanRescheduleService', () => {
  let service: CsLoanRescheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsLoanRescheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
