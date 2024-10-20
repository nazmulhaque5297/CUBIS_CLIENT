import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCollectorsMaintenanceComponent } from './new-collectors-maintenance.component';

describe('NewCollectorsMaintenanceComponent', () => {
  let component: NewCollectorsMaintenanceComponent;
  let fixture: ComponentFixture<NewCollectorsMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCollectorsMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCollectorsMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
