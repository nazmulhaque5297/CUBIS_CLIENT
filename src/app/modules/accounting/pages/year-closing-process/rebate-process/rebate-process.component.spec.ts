import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebateProcessComponent } from './rebate-process.component';

describe('RebateProcessComponent', () => {
  let component: RebateProcessComponent;
  let fixture: ComponentFixture<RebateProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RebateProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RebateProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
