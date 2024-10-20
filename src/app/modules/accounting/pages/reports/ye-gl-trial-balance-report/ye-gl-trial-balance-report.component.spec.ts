import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YeGlTrialBalanceReportComponent } from './ye-gl-trial-balance-report.component';

describe('YeGlTrialBalanceReportComponent', () => {
  let component: YeGlTrialBalanceReportComponent;
  let fixture: ComponentFixture<YeGlTrialBalanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YeGlTrialBalanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YeGlTrialBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
