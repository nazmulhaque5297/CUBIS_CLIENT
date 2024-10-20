import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanExpiryReportComponent } from './loan-expiry-report.component';

describe('LoanExpiryReportComponent', () => {
  let component: LoanExpiryReportComponent;
  let fixture: ComponentFixture<LoanExpiryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanExpiryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanExpiryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
