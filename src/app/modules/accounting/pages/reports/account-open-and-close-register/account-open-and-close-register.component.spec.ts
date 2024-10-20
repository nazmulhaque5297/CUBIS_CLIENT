import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOpenAndCloseRegisterComponent } from './account-open-and-close-register.component';

describe('AccountOpenAndCloseRegisterComponent', () => {
  let component: AccountOpenAndCloseRegisterComponent;
  let fixture: ComponentFixture<AccountOpenAndCloseRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountOpenAndCloseRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOpenAndCloseRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
