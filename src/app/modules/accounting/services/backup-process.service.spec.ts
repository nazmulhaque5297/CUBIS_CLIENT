import { TestBed } from '@angular/core/testing';

import { BackupProcessService } from './backup-process.service';

describe('BackupProcessService', () => {
  let service: BackupProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackupProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
