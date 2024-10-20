import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRejectedNoteComponent } from './loan-rejected-note.component';

describe('LoanRejectedNoteComponent', () => {
  let component: LoanRejectedNoteComponent;
  let fixture: ComponentFixture<LoanRejectedNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanRejectedNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanRejectedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
