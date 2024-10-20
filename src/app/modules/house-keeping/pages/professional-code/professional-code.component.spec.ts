import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalCodeComponent } from './professional-code.component';

describe('ProfessionalCodeComponent', () => {
  let component: ProfessionalCodeComponent;
  let fixture: ComponentFixture<ProfessionalCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
