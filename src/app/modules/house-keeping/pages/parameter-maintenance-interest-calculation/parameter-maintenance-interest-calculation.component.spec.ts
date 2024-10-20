import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterMaintenanceInterestCalculationComponent } from './parameter-maintenance-interest-calculation.component';

describe('ParameterMaintenanceInterestCalculationComponent', () => {
  let component: ParameterMaintenanceInterestCalculationComponent;
  let fixture: ComponentFixture<ParameterMaintenanceInterestCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterMaintenanceInterestCalculationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterMaintenanceInterestCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
