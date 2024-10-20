import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetUnitDayEndConfirmationComponent } from './reset-unit-day-end-confirmation.component';

describe('ResetUnitDayEndConfirmationComponent', () => {
  let component: ResetUnitDayEndConfirmationComponent;
  let fixture: ComponentFixture<ResetUnitDayEndConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetUnitDayEndConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetUnitDayEndConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
