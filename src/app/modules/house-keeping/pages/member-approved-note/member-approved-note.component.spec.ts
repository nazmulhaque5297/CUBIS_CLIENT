import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberApprovedNoteComponent } from './member-approved-note.component';

describe('MemberApprovedNoteComponent', () => {
  let component: MemberApprovedNoteComponent;
  let fixture: ComponentFixture<MemberApprovedNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberApprovedNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberApprovedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
