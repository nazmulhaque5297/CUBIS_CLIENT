import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitAndLossAppropriationComponent } from './profit-and-loss-appropriation.component';

describe('ProfitAndLossAppropriationComponent', () => {
  let component: ProfitAndLossAppropriationComponent;
  let fixture: ComponentFixture<ProfitAndLossAppropriationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitAndLossAppropriationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitAndLossAppropriationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
