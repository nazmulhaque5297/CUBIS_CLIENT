import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsControlMaintenanceComponent } from './records-control-maintenance.component';

describe('RecordsControlMaintenanceComponent', () => {
  let component: RecordsControlMaintenanceComponent;
  let fixture: ComponentFixture<RecordsControlMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordsControlMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsControlMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
