import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPictureAuthorizationComponent } from './member-picture-authorization.component';

describe('MemberPictureAuthorizationComponent', () => {
  let component: MemberPictureAuthorizationComponent;
  let fixture: ComponentFixture<MemberPictureAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberPictureAuthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPictureAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
