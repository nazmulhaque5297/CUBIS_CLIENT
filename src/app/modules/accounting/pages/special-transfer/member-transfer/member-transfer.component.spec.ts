import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberTransferComponent } from './member-transfer.component';

describe('MemberTransferComponent', () => {
  let component: MemberTransferComponent;
  let fixture: ComponentFixture<MemberTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
