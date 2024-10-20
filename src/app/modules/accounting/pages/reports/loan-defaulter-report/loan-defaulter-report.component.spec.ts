import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDefaulterReportComponent } from './loan-defaulter-report.component';

describe('LoanDefaulterReportComponent', () => {
  let component: LoanDefaulterReportComponent;
  let fixture: ComponentFixture<LoanDefaulterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanDefaulterReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDefaulterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
