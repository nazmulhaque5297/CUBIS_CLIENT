import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberStatementReportComponent } from './member-statement-report.component';

describe('MemberStatementReportComponent', () => {
  let component: MemberStatementReportComponent;
  let fixture: ComponentFixture<MemberStatementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberStatementReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberStatementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
