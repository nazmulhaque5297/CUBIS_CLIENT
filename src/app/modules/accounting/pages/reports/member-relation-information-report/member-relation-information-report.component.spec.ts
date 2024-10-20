import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRelationInformationReportComponent } from './member-relation-information-report.component';

describe('MemberRelationInformationReportComponent', () => {
  let component: MemberRelationInformationReportComponent;
  let fixture: ComponentFixture<MemberRelationInformationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberRelationInformationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberRelationInformationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
