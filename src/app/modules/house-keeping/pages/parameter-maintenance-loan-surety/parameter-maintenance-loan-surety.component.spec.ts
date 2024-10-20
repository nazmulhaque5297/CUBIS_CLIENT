import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterMaintenanceLoanSuretyComponent } from './parameter-maintenance-loan-surety.component';

describe('ParameterMaintenanceLoanSuretyComponent', () => {
  let component: ParameterMaintenanceLoanSuretyComponent;
  let fixture: ComponentFixture<ParameterMaintenanceLoanSuretyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterMaintenanceLoanSuretyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterMaintenanceLoanSuretyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
