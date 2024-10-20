import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterMaintenanceEmailComponent } from './parameter-maintenance-email.component';

describe('ParameterMaintenanceEmailComponent', () => {
  let component: ParameterMaintenanceEmailComponent;
  let fixture: ComponentFixture<ParameterMaintenanceEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterMaintenanceEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterMaintenanceEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
