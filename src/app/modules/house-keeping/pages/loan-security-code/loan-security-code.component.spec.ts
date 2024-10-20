import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSecurityCodeComponent } from './loan-security-code.component';

describe('LoanSecurityCodeComponent', () => {
  let component: LoanSecurityCodeComponent;
  let fixture: ComponentFixture<LoanSecurityCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanSecurityCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanSecurityCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
