import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionBalanceReportComponent } from './provision-balance-report.component';

describe('ProvisionBalanceReportComponent', () => {
  let component: ProvisionBalanceReportComponent;
  let fixture: ComponentFixture<ProvisionBalanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvisionBalanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
