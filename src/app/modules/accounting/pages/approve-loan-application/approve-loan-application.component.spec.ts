import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveLoanApplicationComponent } from './approve-loan-application.component';

describe('ApproveLoanApplicationComponent', () => {
  let component: ApproveLoanApplicationComponent;
  let fixture: ComponentFixture<ApproveLoanApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveLoanApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveLoanApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
