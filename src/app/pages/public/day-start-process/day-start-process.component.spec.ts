import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayStartProcessComponent } from './day-start-process.component';

describe('DayStartProcessComponent', () => {
  let component: DayStartProcessComponent;
  let fixture: ComponentFixture<DayStartProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayStartProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayStartProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
