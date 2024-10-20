import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationCodeMaintenanceComponent } from './designation-code-maintenance.component';

describe('DesignationCodeMaintenanceComponent', () => {
  let component: DesignationCodeMaintenanceComponent;
  let fixture: ComponentFixture<DesignationCodeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationCodeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationCodeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
