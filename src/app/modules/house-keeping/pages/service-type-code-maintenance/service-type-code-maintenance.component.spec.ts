import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeCodeMaintenanceComponent } from './service-type-code-maintenance.component';

describe('ServiceTypeCodeMaintenanceComponent', () => {
  let component: ServiceTypeCodeMaintenanceComponent;
  let fixture: ComponentFixture<ServiceTypeCodeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceTypeCodeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypeCodeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
