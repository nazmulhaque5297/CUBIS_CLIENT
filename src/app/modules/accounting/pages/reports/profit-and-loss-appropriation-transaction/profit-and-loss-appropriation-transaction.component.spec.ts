import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitAndLossAppropriationTransactionComponent } from './profit-and-loss-appropriation-transaction.component';

describe('ProfitAndLossAppropriationTransactionComponent', () => {
  let component: ProfitAndLossAppropriationTransactionComponent;
  let fixture: ComponentFixture<ProfitAndLossAppropriationTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitAndLossAppropriationTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitAndLossAppropriationTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
