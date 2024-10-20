import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPersonnalLedgerDetailReportComponent } from './member-personnal-ledger-detail-report.component';

describe('MemberPersonnalLedgerDetailReportComponent', () => {
  let component: MemberPersonnalLedgerDetailReportComponent;
  let fixture: ComponentFixture<MemberPersonnalLedgerDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberPersonnalLedgerDetailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPersonnalLedgerDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
