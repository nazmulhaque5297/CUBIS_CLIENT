import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveMemberApplicationComponent } from './approve-member-application.component';

describe('ApproveMemberApplicationComponent', () => {
  let component: ApproveMemberApplicationComponent;
  let fixture: ComponentFixture<ApproveMemberApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveMemberApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveMemberApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
