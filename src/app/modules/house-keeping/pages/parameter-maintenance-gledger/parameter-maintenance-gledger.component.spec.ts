import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterMaintenanceGledgerComponent } from './parameter-maintenance-gledger.component';

describe('ParameterMaintenanceGledgerComponent', () => {
  let component: ParameterMaintenanceGledgerComponent;
  let fixture: ComponentFixture<ParameterMaintenanceGledgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterMaintenanceGledgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterMaintenanceGledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
