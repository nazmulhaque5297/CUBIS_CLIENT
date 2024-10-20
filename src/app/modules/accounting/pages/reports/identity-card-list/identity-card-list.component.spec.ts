import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityCardListComponent } from './identity-card-list.component';

describe('IdentityCardListComponent', () => {
  let component: IdentityCardListComponent;
  let fixture: ComponentFixture<IdentityCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentityCardListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
