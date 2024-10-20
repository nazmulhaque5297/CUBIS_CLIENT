import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMemberApplicationComponent } from './edit-member-application.component';

describe('EditMemberApplicationComponent', () => {
  let component: EditMemberApplicationComponent;
  let fixture: ComponentFixture<EditMemberApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMemberApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMemberApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
