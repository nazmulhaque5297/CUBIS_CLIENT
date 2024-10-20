import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsSetupMaintenanceComponent } from './fields-setup-maintenance.component';

describe('FieldsSetupMaintenanceComponent', () => {
  let component: FieldsSetupMaintenanceComponent;
  let fixture: ComponentFixture<FieldsSetupMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldsSetupMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsSetupMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
