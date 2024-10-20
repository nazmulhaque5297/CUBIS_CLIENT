import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoVoucherPrintComponent } from './auto-voucher-print.component';

describe('AutoVoucherPrintComponent', () => {
  let component: AutoVoucherPrintComponent;
  let fixture: ComponentFixture<AutoVoucherPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoVoucherPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoVoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
