import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedAndPaymentReportsComponent } from './received-and-payment-reports.component';

describe('ReceivedAndPaymentReportsComponent', () => {
  let component: ReceivedAndPaymentReportsComponent;
  let fixture: ComponentFixture<ReceivedAndPaymentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivedAndPaymentReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedAndPaymentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
