import { TestBed } from '@angular/core/testing';

import { EditLoanApplicationService } from './edit-loan-application.service';

describe('EditLoanApplicationService', () => {
  let service: EditLoanApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditLoanApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
