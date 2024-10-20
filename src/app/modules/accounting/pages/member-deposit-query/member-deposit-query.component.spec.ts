import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDepositQueryComponent } from './member-deposit-query.component';

describe('MemberDepositQueryComponent', () => {
  let component: MemberDepositQueryComponent;
  let fixture: ComponentFixture<MemberDepositQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberDepositQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDepositQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
