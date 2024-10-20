import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpazilaCodeMaintenanceComponent } from './upazila-code-maintenance.component';

describe('UpazilaCodeMaintenanceComponent', () => {
  let component: UpazilaCodeMaintenanceComponent;
  let fixture: ComponentFixture<UpazilaCodeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpazilaCodeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpazilaCodeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
