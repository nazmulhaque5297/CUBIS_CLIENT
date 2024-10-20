import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyHolidayComponent } from './weekly-holiday.component';

describe('WeeklyHolidayComponent', () => {
  let component: WeeklyHolidayComponent;
  let fixture: ComponentFixture<WeeklyHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyHolidayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
