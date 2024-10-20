import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOpenControlMaintenanceComponent } from './account-open-control-maintenance.component';

describe('AccountOpenControlMaintenanceComponent', () => {
  let component: AccountOpenControlMaintenanceComponent;
  let fixture: ComponentFixture<AccountOpenControlMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountOpenControlMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOpenControlMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
