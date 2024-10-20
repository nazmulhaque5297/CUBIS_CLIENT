import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothCsVoucherWiseTransactionReportComponent } from './booth-cs-voucher-wise-transaction-report.component';

describe('BoothCsVoucherWiseTransactionReportComponent', () => {
  let component: BoothCsVoucherWiseTransactionReportComponent;
  let fixture: ComponentFixture<BoothCsVoucherWiseTransactionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoothCsVoucherWiseTransactionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoothCsVoucherWiseTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
