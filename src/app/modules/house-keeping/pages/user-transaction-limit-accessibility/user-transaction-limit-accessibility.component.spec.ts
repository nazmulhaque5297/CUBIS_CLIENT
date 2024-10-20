import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTransactionLimitAccessibilityComponent } from './user-transaction-limit-accessibility.component';

describe('UserTransactionLimitAccessibilityComponent', () => {
  let component: UserTransactionLimitAccessibilityComponent;
  let fixture: ComponentFixture<UserTransactionLimitAccessibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTransactionLimitAccessibilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTransactionLimitAccessibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
