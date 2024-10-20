import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberGreetingSmsServiceComponent } from './member-greeting-sms-service.component';

describe('MemberGreetingSmsServiceComponent', () => {
  let component: MemberGreetingSmsServiceComponent;
  let fixture: ComponentFixture<MemberGreetingSmsServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberGreetingSmsServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberGreetingSmsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
