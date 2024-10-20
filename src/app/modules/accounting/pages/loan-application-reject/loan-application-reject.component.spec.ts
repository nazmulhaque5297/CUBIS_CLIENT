import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationRejectComponent } from './loan-application-reject.component';

describe('LoanApplicationRejectComponent', () => {
  let component: LoanApplicationRejectComponent;
  let fixture: ComponentFixture<LoanApplicationRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanApplicationRejectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
