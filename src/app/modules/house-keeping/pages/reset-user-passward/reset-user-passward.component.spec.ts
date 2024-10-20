import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetUserPasswardComponent } from './reset-user-passward.component';

describe('ResetUserPasswardComponent', () => {
  let component: ResetUserPasswardComponent;
  let fixture: ComponentFixture<ResetUserPasswardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetUserPasswardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetUserPasswardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
