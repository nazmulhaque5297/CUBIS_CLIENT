import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherSearchReportComponent } from './voucher-search-report.component';

describe('VoucherSearchReportComponent', () => {
  let component: VoucherSearchReportComponent;
  let fixture: ComponentFixture<VoucherSearchReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherSearchReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherSearchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
