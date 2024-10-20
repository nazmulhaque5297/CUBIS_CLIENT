import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeDepositProcessComponent } from './time-deposit-process.component';

describe('TimeDepositProcessComponent', () => {
  let component: TimeDepositProcessComponent;
  let fixture: ComponentFixture<TimeDepositProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeDepositProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeDepositProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
