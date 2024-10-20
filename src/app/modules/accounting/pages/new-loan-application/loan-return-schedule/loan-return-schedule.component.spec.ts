import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanReturnScheduleComponent } from './loan-return-schedule.component';

describe('LoanReturnScheduleComponent', () => {
  let component: LoanReturnScheduleComponent;
  let fixture: ComponentFixture<LoanReturnScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanReturnScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanReturnScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
