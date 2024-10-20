import { TestBed } from '@angular/core/testing';

import { ChequeIssueServiceService } from './cheque-issue-service.service';

describe('ChequeIssueServiceService', () => {
  let service: ChequeIssueServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChequeIssueServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
