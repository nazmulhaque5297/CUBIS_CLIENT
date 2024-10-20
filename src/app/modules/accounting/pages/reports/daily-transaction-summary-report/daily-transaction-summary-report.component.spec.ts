import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTransactionSummaryReportComponent } from './daily-transaction-summary-report.component';

describe('DailyTransactionSummaryReportComponent', () => {
  let component: DailyTransactionSummaryReportComponent;
  let fixture: ComponentFixture<DailyTransactionSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyTransactionSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTransactionSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
