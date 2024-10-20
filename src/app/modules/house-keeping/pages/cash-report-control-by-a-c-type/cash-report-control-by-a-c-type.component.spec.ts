import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashReportControlByACTypeComponent } from './cash-report-control-by-a-c-type.component';

describe('CashReportControlByACTypeComponent', () => {
  let component: CashReportControlByACTypeComponent;
  let fixture: ComponentFixture<CashReportControlByACTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashReportControlByACTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashReportControlByACTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
