import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillageCodeMaintenanceComponent } from './village-code-maintenance.component';

describe('VillageCodeMaintenanceComponent', () => {
  let component: VillageCodeMaintenanceComponent;
  let fixture: ComponentFixture<VillageCodeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VillageCodeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VillageCodeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
