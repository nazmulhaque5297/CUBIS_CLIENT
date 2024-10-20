import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberNomineeStatementReportComponent } from './member-nominee-statement-report.component';

describe('MemberNomineeStatementReportComponent', () => {
  let component: MemberNomineeStatementReportComponent;
  let fixture: ComponentFixture<MemberNomineeStatementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberNomineeStatementReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberNomineeStatementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
