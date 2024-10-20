import { TestBed } from '@angular/core/testing';

import { RejectLoanApplicationService } from './reject-loan-application.service';

describe('RejectLoanApplicationService', () => {
  let service: RejectLoanApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RejectLoanApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
