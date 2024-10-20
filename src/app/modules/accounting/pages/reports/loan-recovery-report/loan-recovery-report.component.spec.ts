import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRecoveryReportComponent } from './loan-recovery-report.component';

describe('LoanRecoveryReportComponent', () => {
  let component: LoanRecoveryReportComponent;
  let fixture: ComponentFixture<LoanRecoveryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanRecoveryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanRecoveryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
