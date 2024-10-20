import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothJournalReportComponent } from './booth-journal-report.component';

describe('BoothJournalReportComponent', () => {
  let component: BoothJournalReportComponent;
  let fixture: ComponentFixture<BoothJournalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoothJournalReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoothJournalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
