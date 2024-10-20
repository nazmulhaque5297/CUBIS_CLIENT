import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberStatusChangeComponent } from './member-status-change.component';

describe('MemberStatusChangeComponent', () => {
  let component: MemberStatusChangeComponent;
  let fixture: ComponentFixture<MemberStatusChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberStatusChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
