import { TestBed } from '@angular/core/testing';

import { VerifyNewLoanApplicationService } from './verify-new-loan-application.service';

describe('VerifyNewLoanApplicationService', () => {
  let service: VerifyNewLoanApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyNewLoanApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
