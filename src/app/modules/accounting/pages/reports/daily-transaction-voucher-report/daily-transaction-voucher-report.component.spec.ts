import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTransactionVoucherReportComponent } from './daily-transaction-voucher-report.component';

describe('DailyTransactionVoucherReportComponent', () => {
  let component: DailyTransactionVoucherReportComponent;
  let fixture: ComponentFixture<DailyTransactionVoucherReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyTransactionVoucherReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTransactionVoucherReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
