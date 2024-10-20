import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsLoanRescheduleComponent } from './cs-loan-reschedule.component';

describe('CsLoanRescheduleComponent', () => {
  let component: CsLoanRescheduleComponent;
  let fixture: ComponentFixture<CsLoanRescheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsLoanRescheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsLoanRescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
