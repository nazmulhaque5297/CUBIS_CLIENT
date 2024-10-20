import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatedMaturityIntReportComponent } from './estimated-maturity-int-report.component';

describe('EstimatedMaturityIntReportComponent', () => {
  let component: EstimatedMaturityIntReportComponent;
  let fixture: ComponentFixture<EstimatedMaturityIntReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimatedMaturityIntReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimatedMaturityIntReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
