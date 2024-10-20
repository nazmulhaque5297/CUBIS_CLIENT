import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTimeAllotmentReportComponent } from './loan-time-allotment-report.component';

describe('LoanTimeAllotmentReportComponent', () => {
  let component: LoanTimeAllotmentReportComponent;
  let fixture: ComponentFixture<LoanTimeAllotmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanTimeAllotmentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanTimeAllotmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
