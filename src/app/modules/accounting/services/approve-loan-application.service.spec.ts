import { TestBed } from '@angular/core/testing';

import { ApproveLoanApplicationService } from './approve-loan-application.service';

describe('ApproveLoanApplicationService', () => {
  let service: ApproveLoanApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproveLoanApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
