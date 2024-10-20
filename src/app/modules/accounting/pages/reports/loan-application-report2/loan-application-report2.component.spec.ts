import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationReport2Component } from './loan-application-report2.component';

describe('LoanApplicationReport2Component', () => {
  let component: LoanApplicationReport2Component;
  let fixture: ComponentFixture<LoanApplicationReport2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanApplicationReport2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationReport2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
