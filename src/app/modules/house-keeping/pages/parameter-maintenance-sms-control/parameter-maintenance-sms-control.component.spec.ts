import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterMaintenanceSmsControlComponent } from './parameter-maintenance-sms-control.component';

describe('ParameterMaintenanceSmsControlComponent', () => {
  let component: ParameterMaintenanceSmsControlComponent;
  let fixture: ComponentFixture<ParameterMaintenanceSmsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterMaintenanceSmsControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterMaintenanceSmsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
