import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetParameterMaintenanceComponent } from './budget-parameter-maintenance.component';

describe('BudgetParameterMaintenanceComponent', () => {
  let component: BudgetParameterMaintenanceComponent;
  let fixture: ComponentFixture<BudgetParameterMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetParameterMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetParameterMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
