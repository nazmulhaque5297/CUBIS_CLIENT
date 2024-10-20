import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualAidServiceReportComponent } from './mutual-aid-service-report.component';

describe('MutualAidServiceReportComponent', () => {
  let component: MutualAidServiceReportComponent;
  let fixture: ComponentFixture<MutualAidServiceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MutualAidServiceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualAidServiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
