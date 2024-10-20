import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGroupMaintenaceComponent } from './new-group-maintenace.component';

describe('NewGroupMaintenaceComponent', () => {
  let component: NewGroupMaintenaceComponent;
  let fixture: ComponentFixture<NewGroupMaintenaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGroupMaintenaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGroupMaintenaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
