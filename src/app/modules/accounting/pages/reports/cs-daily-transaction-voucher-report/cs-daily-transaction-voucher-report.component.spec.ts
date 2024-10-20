import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsDailyTransactionVoucherReportComponent } from './cs-daily-transaction-voucher-report.component';

describe('CsDailyTransactionVoucherReportComponent', () => {
  let component: CsDailyTransactionVoucherReportComponent;
  let fixture: ComponentFixture<CsDailyTransactionVoucherReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsDailyTransactionVoucherReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsDailyTransactionVoucherReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
