import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyLoanApplicationComponent } from './verify-loan-application.component';

describe('VerifyLoanApplicationComponent', () => {
  let component: VerifyLoanApplicationComponent;
  let fixture: ComponentFixture<VerifyLoanApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyLoanApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyLoanApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
