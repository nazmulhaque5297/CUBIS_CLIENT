import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTransactionControlComponent } from './master-transaction-control.component';

describe('MasterTransactionControlComponent', () => {
  let component: MasterTransactionControlComponent;
  let fixture: ComponentFixture<MasterTransactionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterTransactionControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTransactionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
