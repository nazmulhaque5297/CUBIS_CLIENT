import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardProcessComponent } from './standard-process.component';

describe('StandardProcessComponent', () => {
  let component: StandardProcessComponent;
  let fixture: ComponentFixture<StandardProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
