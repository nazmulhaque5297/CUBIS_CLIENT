import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDepositGuarantorComponent } from './loan-deposit-guarantor.component';

describe('LoanDepositGuarantorComponent', () => {
  let component: LoanDepositGuarantorComponent;
  let fixture: ComponentFixture<LoanDepositGuarantorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanDepositGuarantorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDepositGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
