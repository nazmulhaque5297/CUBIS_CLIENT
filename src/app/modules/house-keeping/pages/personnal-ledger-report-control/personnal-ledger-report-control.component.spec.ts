import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnalLedgerReportControlComponent } from './personnal-ledger-report-control.component';

describe('PersonnalLedgerReportControlComponent', () => {
  let component: PersonnalLedgerReportControlComponent;
  let fixture: ComponentFixture<PersonnalLedgerReportControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonnalLedgerReportControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnalLedgerReportControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
