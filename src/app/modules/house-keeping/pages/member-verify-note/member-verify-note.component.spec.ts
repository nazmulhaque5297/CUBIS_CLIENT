import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberVerifyNoteComponent } from './member-verify-note.component';

describe('MemberVerifyNoteComponent', () => {
  let component: MemberVerifyNoteComponent;
  let fixture: ComponentFixture<MemberVerifyNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberVerifyNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberVerifyNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
