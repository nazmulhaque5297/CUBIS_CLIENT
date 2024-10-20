import { TestBed } from '@angular/core/testing';

import { SlabMaintainService } from './slab-maintain.service';

describe('SlabMaintainService', () => {
  let service: SlabMaintainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlabMaintainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
