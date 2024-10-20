import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMemberApplicationComponent } from './new-member-application.component';

describe('NewMemberApplicationComponent', () => {
  let component: NewMemberApplicationComponent;
  let fixture: ComponentFixture<NewMemberApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMemberApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMemberApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
