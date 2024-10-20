import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCodeMaintenanceComponent } from './bank-code-maintenance.component';

describe('BankCodeMaintenanceComponent', () => {
  let component: BankCodeMaintenanceComponent;
  let fixture: ComponentFixture<BankCodeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankCodeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCodeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
