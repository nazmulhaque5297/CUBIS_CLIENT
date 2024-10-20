import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanaCodeMaintenanceComponent } from './thana-code-maintenance.component';

describe('ThanaCodeMaintenanceComponent', () => {
  let component: ThanaCodeMaintenanceComponent;
  let fixture: ComponentFixture<ThanaCodeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThanaCodeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThanaCodeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
