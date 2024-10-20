import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorSurityReportComponent } from './guarantor-surity-report.component';

describe('GuarantorSurityReportComponent', () => {
  let component: GuarantorSurityReportComponent;
  let fixture: ComponentFixture<GuarantorSurityReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuarantorSurityReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorSurityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
