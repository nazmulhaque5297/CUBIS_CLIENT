import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLogoImageComponent } from './create-logo-image.component';

describe('CreateLogoImageComponent', () => {
  let component: CreateLogoImageComponent;
  let fixture: ComponentFixture<CreateLogoImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLogoImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLogoImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
