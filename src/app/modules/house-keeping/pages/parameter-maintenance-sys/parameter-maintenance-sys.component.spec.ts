import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterMaintenanceSysComponent } from './parameter-maintenance-sys.component';

describe('ParameterMaintenanceSysComponent', () => {
  let component: ParameterMaintenanceSysComponent;
  let fixture: ComponentFixture<ParameterMaintenanceSysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterMaintenanceSysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterMaintenanceSysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
