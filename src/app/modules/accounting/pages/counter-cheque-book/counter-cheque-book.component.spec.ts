import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterChequeBookComponent } from './counter-cheque-book.component';

describe('CounterChequeBookComponent', () => {
  let component: CounterChequeBookComponent;
  let fixture: ComponentFixture<CounterChequeBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterChequeBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterChequeBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
