import { TestBed } from '@angular/core/testing';

import { YearEndService } from './year-end.service';

describe('YearEndService', () => {
  let service: YearEndService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YearEndService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
