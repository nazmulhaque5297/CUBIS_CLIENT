import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearEndReverseTransactionComponent } from './year-end-reverse-transaction.component';

describe('YearEndReverseTransactionComponent', () => {
  let component: YearEndReverseTransactionComponent;
  let fixture: ComponentFixture<YearEndReverseTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearEndReverseTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearEndReverseTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
