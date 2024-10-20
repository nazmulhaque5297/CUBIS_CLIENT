import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDisbRecoveryAnalysisReportComponent } from './loan-disb-recovery-analysis-report.component';

describe('LoanDisbRecoveryAnalysisReportComponent', () => {
  let component: LoanDisbRecoveryAnalysisReportComponent;
  let fixture: ComponentFixture<LoanDisbRecoveryAnalysisReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanDisbRecoveryAnalysisReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDisbRecoveryAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
