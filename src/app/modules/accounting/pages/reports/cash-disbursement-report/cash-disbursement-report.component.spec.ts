import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDisbursementReportComponent } from './cash-disbursement-report.component';

describe('CashDisbursementReportComponent', () => {
  let component: CashDisbursementReportComponent;
  let fixture: ComponentFixture<CashDisbursementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashDisbursementReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashDisbursementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
