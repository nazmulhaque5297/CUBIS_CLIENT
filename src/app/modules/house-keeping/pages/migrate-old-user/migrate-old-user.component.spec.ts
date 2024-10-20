import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrateOldUserComponent } from './migrate-old-user.component';

describe('MigrateOldUserComponent', () => {
  let component: MigrateOldUserComponent;
  let fixture: ComponentFixture<MigrateOldUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrateOldUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrateOldUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
