import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictCodeMaintenanceComponent } from './district-code-maintenance.component';

describe('DistrictCodeMaintenanceComponent', () => {
  let component: DistrictCodeMaintenanceComponent;
  let fixture: ComponentFixture<DistrictCodeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictCodeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictCodeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
