import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationReportComponent } from './loan-application-report.component';

describe('LoanApplicationReportComponent', () => {
  let component: LoanApplicationReportComponent;
  let fixture: ComponentFixture<LoanApplicationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanApplicationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
