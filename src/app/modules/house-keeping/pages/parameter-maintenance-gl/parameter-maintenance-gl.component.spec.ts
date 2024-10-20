import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterMaintenanceGLComponent } from './parameter-maintenance-gl.component';

describe('ParameterMaintenanceGLComponent', () => {
  let component: ParameterMaintenanceGLComponent;
  let fixture: ComponentFixture<ParameterMaintenanceGLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterMaintenanceGLComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterMaintenanceGLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
