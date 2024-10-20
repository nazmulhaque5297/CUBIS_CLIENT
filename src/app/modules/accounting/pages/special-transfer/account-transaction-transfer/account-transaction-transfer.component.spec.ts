import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransactionTransferComponent } from './account-transaction-transfer.component';

describe('AccountTransactionTransferComponent', () => {
  let component: AccountTransactionTransferComponent;
  let fixture: ComponentFixture<AccountTransactionTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTransactionTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransactionTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
