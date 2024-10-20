import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserIdComponent } from './edit-user-id.component';

describe('EditUserIdComponent', () => {
  let component: EditUserIdComponent;
  let fixture: ComponentFixture<EditUserIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
