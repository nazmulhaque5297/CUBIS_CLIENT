import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEditMaintenanceComponent } from './account-edit-maintenance.component';

describe('AccountEditMaintenanceComponent', () => {
  let component: AccountEditMaintenanceComponent;
  let fixture: ComponentFixture<AccountEditMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountEditMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountEditMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
