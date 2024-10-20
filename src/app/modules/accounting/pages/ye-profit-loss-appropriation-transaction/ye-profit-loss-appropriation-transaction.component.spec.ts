import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YeProfitLossAppropriationTransactionComponent } from './ye-profit-loss-appropriation-transaction.component';

describe('YeProfitLossAppropriationTransactionComponent', () => {
  let component: YeProfitLossAppropriationTransactionComponent;
  let fixture: ComponentFixture<YeProfitLossAppropriationTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YeProfitLossAppropriationTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YeProfitLossAppropriationTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
