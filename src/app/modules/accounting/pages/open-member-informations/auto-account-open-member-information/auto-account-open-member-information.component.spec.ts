import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAccountOpenMemberInformationComponent } from './auto-account-open-member-information.component';

describe('AutoAccountOpenMemberInformationComponent', () => {
  let component: AutoAccountOpenMemberInformationComponent;
  let fixture: ComponentFixture<AutoAccountOpenMemberInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoAccountOpenMemberInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoAccountOpenMemberInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
