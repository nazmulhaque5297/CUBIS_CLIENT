import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterSlabReportComponent } from './parameter-slab-report.component';

describe('ParameterSlabReportComponent', () => {
  let component: ParameterSlabReportComponent;
  let fixture: ComponentFixture<ParameterSlabReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterSlabReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterSlabReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
