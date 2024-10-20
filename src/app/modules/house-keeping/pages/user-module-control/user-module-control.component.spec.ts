import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModuleControlComponent } from './user-module-control.component';

describe('UserModuleControlComponent', () => {
  let component: UserModuleControlComponent;
  let fixture: ComponentFixture<UserModuleControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserModuleControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModuleControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
