import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterMaintenanceCustomerServiceComponent } from './parameter-maintenance-customer-service.component';

describe('ParameterMaintenanceCustomerServiceComponent', () => {
  let component: ParameterMaintenanceCustomerServiceComponent;
  let fixture: ComponentFixture<ParameterMaintenanceCustomerServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterMaintenanceCustomerServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterMaintenanceCustomerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
