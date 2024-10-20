import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterControlMaintenanceComponent } from './parameter-control-maintenance.component';

describe('ParameterControlMaintenanceComponent', () => {
  let component: ParameterControlMaintenanceComponent;
  let fixture: ComponentFixture<ParameterControlMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterControlMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterControlMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
