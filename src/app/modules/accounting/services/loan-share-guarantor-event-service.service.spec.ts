import { TestBed } from '@angular/core/testing';

import { LoanShareGuarantorEventServiceService } from './loan-share-guarantor-event-service.service';

describe('LoanShareGuarantorEventServiceService', () => {
  let service: LoanShareGuarantorEventServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanShareGuarantorEventServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
