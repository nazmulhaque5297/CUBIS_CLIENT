import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDepositComponent } from './transfer-deposit.component';

describe('TransferDepositComponent', () => {
  let component: TransferDepositComponent;
  let fixture: ComponentFixture<TransferDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
