import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerBalanceReportComponent } from './ledger-balance-report.component';

describe('LedgerBalanceReportComponent', () => {
  let component: LedgerBalanceReportComponent;
  let fixture: ComponentFixture<LedgerBalanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerBalanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
