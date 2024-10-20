import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayEndProcessTestComponent } from './day-end-process-test.component';

describe('DayEndProcessTestComponent', () => {
  let component: DayEndProcessTestComponent;
  let fixture: ComponentFixture<DayEndProcessTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayEndProcessTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayEndProcessTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
