import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsVoucherWiseTransactionReportComponent } from './cs-voucher-wise-transaction-report.component';

describe('CsVoucherWiseTransactionReportComponent', () => {
  let component: CsVoucherWiseTransactionReportComponent;
  let fixture: ComponentFixture<CsVoucherWiseTransactionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsVoucherWiseTransactionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsVoucherWiseTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
