import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositMaturityReportComponent } from './deposit-maturity-report.component';

describe('DepositMaturityReportComponent', () => {
  let component: DepositMaturityReportComponent;
  let fixture: ComponentFixture<DepositMaturityReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositMaturityReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositMaturityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
