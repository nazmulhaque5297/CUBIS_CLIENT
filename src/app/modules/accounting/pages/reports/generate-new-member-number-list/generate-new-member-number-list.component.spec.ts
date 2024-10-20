import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateNewMemberNumberListComponent } from './generate-new-member-number-list.component';

describe('GenerateNewMemberNumberListComponent', () => {
  let component: GenerateNewMemberNumberListComponent;
  let fixture: ComponentFixture<GenerateNewMemberNumberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateNewMemberNumberListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateNewMemberNumberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
