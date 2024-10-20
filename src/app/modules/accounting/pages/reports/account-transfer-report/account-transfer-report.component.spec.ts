import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransferReportComponent } from './account-transfer-report.component';

describe('AccountTransferReportComponent', () => {
  let component: AccountTransferReportComponent;
  let fixture: ComponentFixture<AccountTransferReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTransferReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransferReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
