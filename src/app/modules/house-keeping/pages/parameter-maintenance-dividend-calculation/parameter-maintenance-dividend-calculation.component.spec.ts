import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterMaintenanceDividendCalculationComponent } from './parameter-maintenance-dividend-calculation.component';

describe('ParameterMaintenanceDividendCalculationComponent', () => {
  let component: ParameterMaintenanceDividendCalculationComponent;
  let fixture: ComponentFixture<ParameterMaintenanceDividendCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterMaintenanceDividendCalculationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterMaintenanceDividendCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
