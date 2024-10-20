import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalityCodeComponent } from './nationality-code.component';

describe('NationalityCodeComponent', () => {
  let component: NationalityCodeComponent;
  let fixture: ComponentFixture<NationalityCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalityCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalityCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
