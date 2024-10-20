import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMemberSignatureCardComponent } from './verify-member-signature-card.component';

describe('VerifyMemberSignatureCardComponent', () => {
  let component: VerifyMemberSignatureCardComponent;
  let fixture: ComponentFixture<VerifyMemberSignatureCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyMemberSignatureCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyMemberSignatureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
