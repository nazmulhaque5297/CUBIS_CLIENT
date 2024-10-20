import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMemberInformationsComponent } from './edit-member-informations.component';

describe('EditMemberInformationsComponent', () => {
  let component: EditMemberInformationsComponent;
  let fixture: ComponentFixture<EditMemberInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMemberInformationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMemberInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
