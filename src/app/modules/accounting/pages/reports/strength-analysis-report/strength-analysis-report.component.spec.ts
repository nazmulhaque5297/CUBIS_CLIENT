import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrengthAnalysisReportComponent } from './strength-analysis-report.component';

describe('StrengthAnalysisReportComponent', () => {
  let component: StrengthAnalysisReportComponent;
  let fixture: ComponentFixture<StrengthAnalysisReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrengthAnalysisReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrengthAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
