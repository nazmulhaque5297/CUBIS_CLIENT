import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetReportsComponent } from './budget-reports.component';

describe('BudgetReportsComponent', () => {
  let component: BudgetReportsComponent;
  let fixture: ComponentFixture<BudgetReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
