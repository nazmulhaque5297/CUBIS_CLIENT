import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDisbursementAccountDetailsComponent } from './loan-disbursement-account-details.component';

describe('LoanDisbursementAccountDetailsComponent', () => {
  let component: LoanDisbursementAccountDetailsComponent;
  let fixture: ComponentFixture<LoanDisbursementAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanDisbursementAccountDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDisbursementAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
