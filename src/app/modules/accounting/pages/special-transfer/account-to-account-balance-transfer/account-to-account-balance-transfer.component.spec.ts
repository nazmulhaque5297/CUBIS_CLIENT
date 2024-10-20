import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountToAccountBalanceTransferComponent } from './account-to-account-balance-transfer.component';

describe('AccountBalanceTransferComponent', () => {
  let component: AccountToAccountBalanceTransferComponent;
  let fixture: ComponentFixture<AccountToAccountBalanceTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountToAccountBalanceTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountToAccountBalanceTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
