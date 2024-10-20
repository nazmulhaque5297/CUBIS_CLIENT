import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyMonitoringReportComponent } from './monthly-monitoring-report.component';

describe('MonthlyMonitoringReportComponent', () => {
  let component: MonthlyMonitoringReportComponent;
  let fixture: ComponentFixture<MonthlyMonitoringReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyMonitoringReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyMonitoringReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
