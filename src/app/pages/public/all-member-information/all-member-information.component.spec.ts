import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMemberInformationComponent } from './all-member-information.component';

describe('AllMemberInformationComponent', () => {
  let component: AllMemberInformationComponent;
  let fixture: ComponentFixture<AllMemberInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllMemberInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMemberInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
