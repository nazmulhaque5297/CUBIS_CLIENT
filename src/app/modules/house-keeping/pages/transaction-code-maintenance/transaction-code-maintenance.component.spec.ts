import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCodeMaintenanceComponent } from './transaction-code-maintenance.component';

describe('TransactionCodeMaintenanceComponent', () => {
  let component: TransactionCodeMaintenanceComponent;
  let fixture: ComponentFixture<TransactionCodeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionCodeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionCodeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
