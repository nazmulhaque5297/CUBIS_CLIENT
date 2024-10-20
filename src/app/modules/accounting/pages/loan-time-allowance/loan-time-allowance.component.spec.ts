import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTimeAllowanceComponent } from './loan-time-allowance.component';

describe('LoanTimeAllowanceComponent', () => {
  let component: LoanTimeAllowanceComponent;
  let fixture: ComponentFixture<LoanTimeAllowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanTimeAllowanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanTimeAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
