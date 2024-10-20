import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterMaintenanceMutualAidServiceComponent } from './parameter-maintenance-mutual-aid-service.component';

describe('ParameterMaintenanceMutualAidServiceComponent', () => {
  let component: ParameterMaintenanceMutualAidServiceComponent;
  let fixture: ComponentFixture<ParameterMaintenanceMutualAidServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterMaintenanceMutualAidServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterMaintenanceMutualAidServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
