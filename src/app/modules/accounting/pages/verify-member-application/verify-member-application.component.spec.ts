import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMemberApplicationComponent } from './verify-member-application.component';

describe('VerifyMemberApplicationComponent', () => {
  let component: VerifyMemberApplicationComponent;
  let fixture: ComponentFixture<VerifyMemberApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyMemberApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyMemberApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
