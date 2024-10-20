import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentTransactionsComponent } from './adjustment-transactions.component';

describe('AdjustmentTransactionsComponent', () => {
  let component: AdjustmentTransactionsComponent;
  let fixture: ComponentFixture<AdjustmentTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
