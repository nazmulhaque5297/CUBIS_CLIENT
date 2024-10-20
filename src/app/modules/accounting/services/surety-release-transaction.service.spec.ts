import { TestBed } from '@angular/core/testing';

import { SuretyReleaseTransactionService } from './surety-release-transaction.service';

describe('SuretyReleaseTransactionService', () => {
  let service: SuretyReleaseTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuretyReleaseTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
