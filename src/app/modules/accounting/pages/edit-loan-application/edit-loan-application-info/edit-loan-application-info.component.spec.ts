import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanApplicationInfoComponent } from './edit-loan-application-info.component';

describe('EditLoanApplicationInfoComponent', () => {
  let component: EditLoanApplicationInfoComponent;
  let fixture: ComponentFixture<EditLoanApplicationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoanApplicationInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLoanApplicationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
