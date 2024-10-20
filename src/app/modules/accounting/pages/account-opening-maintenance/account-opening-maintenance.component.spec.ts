import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOpeningMaintenanceComponent } from './account-opening-maintenance.component';

describe('AccountOpeningMaintenanceComponent', () => {
  let component: AccountOpeningMaintenanceComponent;
  let fixture: ComponentFixture<AccountOpeningMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountOpeningMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOpeningMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
