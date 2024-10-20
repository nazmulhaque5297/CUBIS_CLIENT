import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothGlCodeControlMaintenanceComponent } from './booth-gl-code-control-maintenance.component';

describe('BoothGlCodeControlMaintenanceComponent', () => {
  let component: BoothGlCodeControlMaintenanceComponent;
  let fixture: ComponentFixture<BoothGlCodeControlMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoothGlCodeControlMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoothGlCodeControlMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
