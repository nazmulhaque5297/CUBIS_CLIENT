import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanAccShareGuarantorComponent } from './edit-loan-acc-share-guarantor.component';

describe('EditLoanAccShareGuarantorComponent', () => {
  let component: EditLoanAccShareGuarantorComponent;
  let fixture: ComponentFixture<EditLoanAccShareGuarantorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoanAccShareGuarantorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLoanAccShareGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
