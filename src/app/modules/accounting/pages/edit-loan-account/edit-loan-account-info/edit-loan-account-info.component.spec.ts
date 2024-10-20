import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanAccountInfoComponent } from './edit-loan-account-info.component';

describe('EditLoanAccountInfoComponent', () => {
  let component: EditLoanAccountInfoComponent;
  let fixture: ComponentFixture<EditLoanAccountInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoanAccountInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLoanAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
