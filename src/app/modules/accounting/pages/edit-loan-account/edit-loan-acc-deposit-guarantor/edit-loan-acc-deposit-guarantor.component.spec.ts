import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanAccDepositGuarantorComponent } from './edit-loan-acc-deposit-guarantor.component';

describe('EditLoanAccDepositGuarantorComponent', () => {
  let component: EditLoanAccDepositGuarantorComponent;
  let fixture: ComponentFixture<EditLoanAccDepositGuarantorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoanAccDepositGuarantorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLoanAccDepositGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
