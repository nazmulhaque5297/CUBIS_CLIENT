import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanVerifyNoteComponent } from './loan-verify-note.component';

describe('LoanVerifyNoteComponent', () => {
  let component: LoanVerifyNoteComponent;
  let fixture: ComponentFixture<LoanVerifyNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanVerifyNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanVerifyNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
