import { TestBed } from '@angular/core/testing';

import { ApproveMemberApplicationService } from './approve-member-application.service';

describe('ApproveMemberApplicationService', () => {
  let service: ApproveMemberApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproveMemberApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
