import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRejectNoteComponent } from './member-reject-note.component';

describe('MemberRejectNoteComponent', () => {
  let component: MemberRejectNoteComponent;
  let fixture: ComponentFixture<MemberRejectNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberRejectNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberRejectNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
