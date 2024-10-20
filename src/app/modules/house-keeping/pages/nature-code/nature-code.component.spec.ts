import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureCodeComponent } from './nature-code.component';

describe('NatureCodeComponent', () => {
  let component: NatureCodeComponent;
  let fixture: ComponentFixture<NatureCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NatureCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
