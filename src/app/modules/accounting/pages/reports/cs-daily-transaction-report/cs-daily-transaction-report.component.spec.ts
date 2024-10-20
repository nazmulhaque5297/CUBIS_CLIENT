import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsDailyTransactionReportComponent } from './cs-daily-transaction-report.component';

describe('CsDailyTransactionReportComponent', () => {
  let component: CsDailyTransactionReportComponent;
  let fixture: ComponentFixture<CsDailyTransactionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsDailyTransactionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsDailyTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
