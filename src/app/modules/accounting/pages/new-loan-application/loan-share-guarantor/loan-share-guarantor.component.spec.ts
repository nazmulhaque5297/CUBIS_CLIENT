import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanShareGuarantorComponent } from './loan-share-guarantor.component';

describe('LoanShareGuarantorComponent', () => {
  let component: LoanShareGuarantorComponent;
  let fixture: ComponentFixture<LoanShareGuarantorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanShareGuarantorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanShareGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
