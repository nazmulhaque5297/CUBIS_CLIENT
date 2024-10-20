import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRegisterReportComponent } from './member-register-report.component';

describe('MemberRegisterReportComponent', () => {
  let component: MemberRegisterReportComponent;
  let fixture: ComponentFixture<MemberRegisterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberRegisterReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberRegisterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
