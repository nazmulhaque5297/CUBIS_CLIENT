import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothReceivedAndPaymentReportComponent } from './booth-received-and-payment-report.component';

describe('BoothReceivedAndPaymentReportComponent', () => {
  let component: BoothReceivedAndPaymentReportComponent;
  let fixture: ComponentFixture<BoothReceivedAndPaymentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoothReceivedAndPaymentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoothReceivedAndPaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
