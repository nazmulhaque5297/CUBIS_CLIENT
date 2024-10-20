import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentAccountDetailsComponent } from './adjustment-account-details.component';

describe('AdjustmentAccountDetailsComponent', () => {
  let component: AdjustmentAccountDetailsComponent;
  let fixture: ComponentFixture<AdjustmentAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentAccountDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
