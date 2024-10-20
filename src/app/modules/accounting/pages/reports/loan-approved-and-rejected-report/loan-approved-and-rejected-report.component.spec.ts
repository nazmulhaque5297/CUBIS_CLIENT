import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApprovedAndRejectedReportComponent } from './loan-approved-and-rejected-report.component';

describe('LoanApprovedAndRejectedReportComponent', () => {
  let component: LoanApprovedAndRejectedReportComponent;
  let fixture: ComponentFixture<LoanApprovedAndRejectedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanApprovedAndRejectedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApprovedAndRejectedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
