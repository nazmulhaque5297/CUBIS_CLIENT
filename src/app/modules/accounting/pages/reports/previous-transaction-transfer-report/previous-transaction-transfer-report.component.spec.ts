import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousTransactionTransferReportComponent } from './previous-transaction-transfer-report.component';

describe('PreviousTransactionTransferReportComponent', () => {
  let component: PreviousTransactionTransferReportComponent;
  let fixture: ComponentFixture<PreviousTransactionTransferReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousTransactionTransferReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousTransactionTransferReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
