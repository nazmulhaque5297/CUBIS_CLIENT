import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterMaintenanceRebateCalculationComponent } from './parameter-maintenance-rebate-calculation.component';

describe('ParameterMaintenanceRebateCalculationComponent', () => {
  let component: ParameterMaintenanceRebateCalculationComponent;
  let fixture: ComponentFixture<ParameterMaintenanceRebateCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterMaintenanceRebateCalculationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterMaintenanceRebateCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
