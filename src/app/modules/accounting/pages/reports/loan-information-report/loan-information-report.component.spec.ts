import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanInformationReportComponent } from './loan-information-report.component';

describe('LoanInformationReportComponent', () => {
  let component: LoanInformationReportComponent;
  let fixture: ComponentFixture<LoanInformationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanInformationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanInformationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
