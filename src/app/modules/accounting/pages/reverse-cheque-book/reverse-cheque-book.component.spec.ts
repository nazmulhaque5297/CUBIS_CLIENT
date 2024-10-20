import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseChequeBookComponent } from './reverse-cheque-book.component';

describe('ReverseChequeBookComponent', () => {
  let component: ReverseChequeBookComponent;
  let fixture: ComponentFixture<ReverseChequeBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReverseChequeBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReverseChequeBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
