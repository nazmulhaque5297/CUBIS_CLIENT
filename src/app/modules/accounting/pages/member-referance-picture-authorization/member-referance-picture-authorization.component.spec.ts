import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberReferancePictureAuthorizationComponent } from './member-referance-picture-authorization.component';

describe('MemberReferancePictureAuthorizationComponent', () => {
  let component: MemberReferancePictureAuthorizationComponent;
  let fixture: ComponentFixture<MemberReferancePictureAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberReferancePictureAuthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberReferancePictureAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
