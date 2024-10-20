import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorTransferComponent } from './collector-transfer.component';

describe('CollectorTransferComponent', () => {
  let component: CollectorTransferComponent;
  let fixture: ComponentFixture<CollectorTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectorTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
