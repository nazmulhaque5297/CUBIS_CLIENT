import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsMassageMaintenanceControlComponent } from './sms-massage-maintenance-control.component';

describe('SmsMassageMaintenanceControlComponent', () => {
  let component: SmsMassageMaintenanceControlComponent;
  let fixture: ComponentFixture<SmsMassageMaintenanceControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsMassageMaintenanceControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsMassageMaintenanceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
