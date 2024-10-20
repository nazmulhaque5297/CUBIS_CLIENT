import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedPaymentRegisterByidReportComponent } from './received-payment-register-byid-report.component';

describe('ReceivedPaymentRegisterByidReportComponent', () => {
  let component: ReceivedPaymentRegisterByidReportComponent;
  let fixture: ComponentFixture<ReceivedPaymentRegisterByidReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivedPaymentRegisterByidReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedPaymentRegisterByidReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
