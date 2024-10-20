import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountStatusChangeComponent } from './account-status-change.component';

describe('AccountStatusChangeComponent', () => {
  let component: AccountStatusChangeComponent;
  let fixture: ComponentFixture<AccountStatusChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountStatusChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
