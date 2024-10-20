import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanAccPropertyGuarantorComponent } from './edit-loan-acc-property-guarantor.component';

describe('EditLoanAccPropertyGuarantorComponent', () => {
  let component: EditLoanAccPropertyGuarantorComponent;
  let fixture: ComponentFixture<EditLoanAccPropertyGuarantorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoanAccPropertyGuarantorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLoanAccPropertyGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
