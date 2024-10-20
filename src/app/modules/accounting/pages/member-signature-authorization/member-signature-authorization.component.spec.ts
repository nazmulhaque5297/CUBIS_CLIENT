import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSignatureAuthorizationComponent } from './member-signature-authorization.component';

describe('MemberSignatureAuthorizationComponent', () => {
  let component: MemberSignatureAuthorizationComponent;
  let fixture: ComponentFixture<MemberSignatureAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberSignatureAuthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberSignatureAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
