import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLedgerBalanceSmsServiceComponent } from './account-ledger-balance-sms-service.component';

describe('AccountLedgerBalanceSmsServiceComponent', () => {
  let component: AccountLedgerBalanceSmsServiceComponent;
  let fixture: ComponentFixture<AccountLedgerBalanceSmsServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountLedgerBalanceSmsServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLedgerBalanceSmsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
