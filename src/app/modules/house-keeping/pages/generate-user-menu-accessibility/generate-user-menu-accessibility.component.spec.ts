import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateUserMenuAccessibilityComponent } from './generate-user-menu-accessibility.component';

describe('GenerateUserMenuAccessibilityComponent', () => {
  let component: GenerateUserMenuAccessibilityComponent;
  let fixture: ComponentFixture<GenerateUserMenuAccessibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateUserMenuAccessibilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateUserMenuAccessibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
