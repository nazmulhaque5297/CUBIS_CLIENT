import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberLoanPerformanceReportComponent } from './member-loan-performance-report.component';

describe('MemberLoanPerformanceReportComponent', () => {
  let component: MemberLoanPerformanceReportComponent;
  let fixture: ComponentFixture<MemberLoanPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberLoanPerformanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberLoanPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
