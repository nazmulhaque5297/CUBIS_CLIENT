import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRegisterReportByAccountComponent } from './member-register-report-by-account.component';

describe('MemberRegisterReportByAccountComponent', () => {
  let component: MemberRegisterReportByAccountComponent;
  let fixture: ComponentFixture<MemberRegisterReportByAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberRegisterReportByAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberRegisterReportByAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
