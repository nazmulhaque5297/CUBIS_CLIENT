import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionCodeComponent } from './section-code.component';

describe('SectionCodeComponent', () => {
  let component: SectionCodeComponent;
  let fixture: ComponentFixture<SectionCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
