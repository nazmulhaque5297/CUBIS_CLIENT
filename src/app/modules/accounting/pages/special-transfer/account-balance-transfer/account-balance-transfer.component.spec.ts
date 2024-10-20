import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBalanceTransferComponent } from './account-balance-transfer.component';

describe('AccountBalanceTransferComponent', () => {
  let component: AccountBalanceTransferComponent;
  let fixture: ComponentFixture<AccountBalanceTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountBalanceTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBalanceTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
