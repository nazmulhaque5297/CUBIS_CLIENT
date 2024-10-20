import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAdmissionFormComponent } from './member-admission-form.component';

describe('MemberAdmissionFormComponent', () => {
  let component: MemberAdmissionFormComponent;
  let fixture: ComponentFixture<MemberAdmissionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberAdmissionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberAdmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
