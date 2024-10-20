import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTypeMaintenanceComponent } from './account-type-maintenance.component';

describe('AccountTypeMaintenanceComponent', () => {
  let component: AccountTypeMaintenanceComponent;
  let fixture: ComponentFixture<AccountTypeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTypeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTypeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
