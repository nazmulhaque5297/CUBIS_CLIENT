import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanApplicationComponent } from './edit-loan-application.component';

describe('EditLoanApplicationComponent', () => {
  let component: EditLoanApplicationComponent;
  let fixture: ComponentFixture<EditLoanApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoanApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLoanApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
