import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherSignatureMaintenanceControlComponent } from './voucher-signature-maintenance-control.component';

describe('VoucherSignatureMaintenanceControlComponent', () => {
  let component: VoucherSignatureMaintenanceControlComponent;
  let fixture: ComponentFixture<VoucherSignatureMaintenanceControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherSignatureMaintenanceControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherSignatureMaintenanceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
