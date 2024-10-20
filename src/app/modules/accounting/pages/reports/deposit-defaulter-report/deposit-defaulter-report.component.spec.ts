import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositDefaulterReportComponent } from './deposit-defaulter-report.component';

describe('DepositDefaulterReportComponent', () => {
  let component: DepositDefaulterReportComponent;
  let fixture: ComponentFixture<DepositDefaulterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositDefaulterReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositDefaulterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
