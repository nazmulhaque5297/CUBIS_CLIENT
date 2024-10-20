import { TestBed } from '@angular/core/testing';

import { VerifyMemberApplicationService } from './verify-member-application.service';

describe('VerifyMemberApplicationService', () => {
  let service: VerifyMemberApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyMemberApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
