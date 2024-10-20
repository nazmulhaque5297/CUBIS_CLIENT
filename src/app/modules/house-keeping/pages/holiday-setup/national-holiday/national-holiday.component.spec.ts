import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalHolidayComponent } from './national-holiday.component';

describe('NationalHolidayComponent', () => {
  let component: NationalHolidayComponent;
  let fixture: ComponentFixture<NationalHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalHolidayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
