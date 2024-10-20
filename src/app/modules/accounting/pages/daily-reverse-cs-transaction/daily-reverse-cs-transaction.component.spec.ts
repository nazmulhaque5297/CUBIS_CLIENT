import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReverseCsTransactionComponent } from './daily-reverse-cs-transaction.component';

describe('DailyReverseCsTransactionComponent', () => {
  let component: DailyReverseCsTransactionComponent;
  let fixture: ComponentFixture<DailyReverseCsTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyReverseCsTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReverseCsTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
