import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionCodeMaintenanceComponent } from './division-code-maintenance.component';

describe('DivisionCodeMaintenanceComponent', () => {
  let component: DivisionCodeMaintenanceComponent;
  let fixture: ComponentFixture<DivisionCodeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionCodeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionCodeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
