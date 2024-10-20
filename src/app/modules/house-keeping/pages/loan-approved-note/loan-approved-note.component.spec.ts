import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApprovedNoteComponent } from './loan-approved-note.component';

describe('LoanApprovedNoteComponent', () => {
  let component: LoanApprovedNoteComponent;
  let fixture: ComponentFixture<LoanApprovedNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanApprovedNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApprovedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
