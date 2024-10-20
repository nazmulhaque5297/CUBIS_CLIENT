import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlVerifyDailyTransactionComponent } from './gl-verify-daily-transaction.component';

describe('GlVerifyDailyTransactionComponent', () => {
  let component: GlVerifyDailyTransactionComponent;
  let fixture: ComponentFixture<GlVerifyDailyTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlVerifyDailyTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlVerifyDailyTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
