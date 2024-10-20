import { TestBed } from '@angular/core/testing';

import { TimeAllowenceService } from './time-allowence.service';

describe('TimeAllowenceService', () => {
  let service: TimeAllowenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeAllowenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
