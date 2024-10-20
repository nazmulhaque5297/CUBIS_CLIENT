import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenMemberInformationsComponent } from './open-member-informations.component';

describe('OpenMemberInformationsComponent', () => {
  let component: OpenMemberInformationsComponent;
  let fixture: ComponentFixture<OpenMemberInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenMemberInformationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenMemberInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
