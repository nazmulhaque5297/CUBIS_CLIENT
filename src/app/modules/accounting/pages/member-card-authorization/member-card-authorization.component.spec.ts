import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCardAuthorizationComponent } from './member-card-authorization.component';

describe('MemberCardAuthorizationComponent', () => {
  let component: MemberCardAuthorizationComponent;
  let fixture: ComponentFixture<MemberCardAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberCardAuthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberCardAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
