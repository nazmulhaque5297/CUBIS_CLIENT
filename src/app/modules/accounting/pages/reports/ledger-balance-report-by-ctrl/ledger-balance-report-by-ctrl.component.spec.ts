import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerBalanceReportByCtrlComponent } from './ledger-balance-report-by-ctrl.component';

describe('LedgerBalanceReportByCtrlComponent', () => {
  let component: LedgerBalanceReportByCtrlComponent;
  let fixture: ComponentFixture<LedgerBalanceReportByCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerBalanceReportByCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerBalanceReportByCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
