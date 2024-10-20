import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseKeepingWrapperComponent } from './house-keeping-wrapper.component';

describe('HouseKeepingWrapperComponent', () => {
  let component: HouseKeepingWrapperComponent;
  let fixture: ComponentFixture<HouseKeepingWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseKeepingWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseKeepingWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
