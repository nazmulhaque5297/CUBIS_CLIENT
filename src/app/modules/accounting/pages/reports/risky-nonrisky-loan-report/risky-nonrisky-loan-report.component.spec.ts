import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskyNonriskyLoanReportComponent } from './risky-nonrisky-loan-report.component';

describe('RiskyNonriskyLoanReportComponent', () => {
  let component: RiskyNonriskyLoanReportComponent;
  let fixture: ComponentFixture<RiskyNonriskyLoanReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskyNonriskyLoanReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskyNonriskyLoanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
