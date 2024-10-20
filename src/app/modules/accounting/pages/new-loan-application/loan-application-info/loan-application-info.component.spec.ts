import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationInfoComponent } from './loan-application-info.component';

describe('LoanApplicationInfoComponent', () => {
  let component: LoanApplicationInfoComponent;
  let fixture: ComponentFixture<LoanApplicationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanApplicationInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
