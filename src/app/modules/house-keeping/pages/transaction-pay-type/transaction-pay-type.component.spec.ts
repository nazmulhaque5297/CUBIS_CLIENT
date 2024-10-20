import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionPayTypeComponent } from './transaction-pay-type.component';

describe('TransactionPayTypeComponent', () => {
  let component: TransactionPayTypeComponent;
  let fixture: ComponentFixture<TransactionPayTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionPayTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionPayTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
