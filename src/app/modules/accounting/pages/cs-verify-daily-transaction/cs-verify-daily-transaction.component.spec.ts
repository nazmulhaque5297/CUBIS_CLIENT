import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsVerifyDailyTransactionComponent } from './cs-verify-daily-transaction.component';

describe('CsVerifyDailyTransactionComponent', () => {
  let component: CsVerifyDailyTransactionComponent;
  let fixture: ComponentFixture<CsVerifyDailyTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsVerifyDailyTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsVerifyDailyTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
