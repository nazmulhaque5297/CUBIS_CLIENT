import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPurposeComponent } from './loan-purpose.component';

describe('LoanPurposeComponent', () => {
  let component: LoanPurposeComponent;
  let fixture: ComponentFixture<LoanPurposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanPurposeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
