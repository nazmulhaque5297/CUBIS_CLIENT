import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookCounterComponent } from './cheque-book-counter.component';

describe('ChequeBookCounterComponent', () => {
  let component: ChequeBookCounterComponent;
  let fixture: ComponentFixture<ChequeBookCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeBookCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBookCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
