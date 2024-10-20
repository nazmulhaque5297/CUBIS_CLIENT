import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccountReportComponent } from './chart-of-account-report.component';

describe('ChartOfAccountReportComponent', () => {
  let component: ChartOfAccountReportComponent;
  let fixture: ComponentFixture<ChartOfAccountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartOfAccountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOfAccountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
