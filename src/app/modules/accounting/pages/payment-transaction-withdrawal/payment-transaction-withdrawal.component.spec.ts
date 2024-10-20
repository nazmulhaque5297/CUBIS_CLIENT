import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransactionWithdrawalComponent } from './payment-transaction-withdrawal.component';

describe('PaymentTransactionWithdrawalComponent', () => {
  let component: PaymentTransactionWithdrawalComponent;
  let fixture: ComponentFixture<PaymentTransactionWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTransactionWithdrawalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTransactionWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
