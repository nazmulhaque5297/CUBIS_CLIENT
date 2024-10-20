import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberImageInformationReportComponent } from './member-image-information-report.component';

describe('MemberImageInformationReportComponent', () => {
  let component: MemberImageInformationReportComponent;
  let fixture: ComponentFixture<MemberImageInformationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberImageInformationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberImageInformationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
