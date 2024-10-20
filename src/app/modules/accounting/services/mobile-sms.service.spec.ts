import { TestBed } from '@angular/core/testing';

import { MobileSmsService } from './mobile-sms.service';

describe('MobileSmsService', () => {
  let service: MobileSmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileSmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
