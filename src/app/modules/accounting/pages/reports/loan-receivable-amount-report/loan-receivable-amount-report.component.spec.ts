import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanReceivableAmountReportComponent } from './loan-receivable-amount-report.component';

describe('LoanReceivableAmountReportComponent', () => {
  let component: LoanReceivableAmountReportComponent;
  let fixture: ComponentFixture<LoanReceivableAmountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanReceivableAmountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanReceivableAmountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
