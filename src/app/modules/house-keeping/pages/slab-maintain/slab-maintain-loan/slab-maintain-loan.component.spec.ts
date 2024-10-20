import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabMaintainLoanComponent } from './slab-maintain-loan.component';

describe('SlabMaintainLoanComponent', () => {
  let component: SlabMaintainLoanComponent;
  let fixture: ComponentFixture<SlabMaintainLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlabMaintainLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabMaintainLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
