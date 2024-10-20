import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitializeUserIdComponent } from './initialize-user-id.component';

describe('InitializeUserIdComponent', () => {
  let component: InitializeUserIdComponent;
  let fixture: ComponentFixture<InitializeUserIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitializeUserIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitializeUserIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
