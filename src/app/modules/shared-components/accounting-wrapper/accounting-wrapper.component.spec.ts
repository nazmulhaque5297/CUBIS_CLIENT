import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingWrapperComponent } from './accounting-wrapper.component';

describe('AccountingWrapperComponent', () => {
  let component: AccountingWrapperComponent;
  let fixture: ComponentFixture<AccountingWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
