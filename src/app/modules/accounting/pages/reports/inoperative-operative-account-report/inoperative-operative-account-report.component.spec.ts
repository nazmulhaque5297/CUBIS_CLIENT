import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InoperativeOperativeAccountReportComponent } from './inoperative-operative-account-report.component';

describe('InoperativeOperativeAccountReportComponent', () => {
  let component: InoperativeOperativeAccountReportComponent;
  let fixture: ComponentFixture<InoperativeOperativeAccountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InoperativeOperativeAccountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InoperativeOperativeAccountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
