import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayEndProcessComponent } from './day-end-process.component';

describe('DayEndProcessComponent', () => {
  let component: DayEndProcessComponent;
  let fixture: ComponentFixture<DayEndProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayEndProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayEndProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
