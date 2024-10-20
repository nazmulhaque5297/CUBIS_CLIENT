import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentCodeComponent } from './department-code.component';

describe('DepartmentCodeComponent', () => {
  let component: DepartmentCodeComponent;
  let fixture: ComponentFixture<DepartmentCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
