import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuretyRefundTransactionComponent } from './surety-refund-transaction.component';

describe('SuretyRefundTransactionComponent', () => {
  let component: SuretyRefundTransactionComponent;
  let fixture: ComponentFixture<SuretyRefundTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuretyRefundTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuretyRefundTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
