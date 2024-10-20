import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPropertyGuarantorComponent } from './loan-property-guarantor.component';

describe('LoanPropertyGuarantorComponent', () => {
  let component: LoanPropertyGuarantorComponent;
  let fixture: ComponentFixture<LoanPropertyGuarantorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanPropertyGuarantorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanPropertyGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
