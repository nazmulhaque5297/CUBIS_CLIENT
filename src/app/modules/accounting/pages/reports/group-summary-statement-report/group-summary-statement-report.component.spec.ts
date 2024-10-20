import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSummaryStatementReportComponent } from './group-summary-statement-report.component';

describe('GroupSummaryStatementReportComponent', () => {
  let component: GroupSummaryStatementReportComponent;
  let fixture: ComponentFixture<GroupSummaryStatementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupSummaryStatementReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSummaryStatementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
