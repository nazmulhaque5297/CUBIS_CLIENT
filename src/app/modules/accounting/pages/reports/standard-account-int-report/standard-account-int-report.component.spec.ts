import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardAccountIntReportComponent } from './standard-account-int-report.component';

describe('StandardAccountIntReportComponent', () => {
  let component: StandardAccountIntReportComponent;
  let fixture: ComponentFixture<StandardAccountIntReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardAccountIntReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardAccountIntReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
