import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookCounterModalComponent } from './cheque-book-counter-modal.component';

describe('ChequeBookCounterModalComponent', () => {
  let component: ChequeBookCounterModalComponent;
  let fixture: ComponentFixture<ChequeBookCounterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeBookCounterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBookCounterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
