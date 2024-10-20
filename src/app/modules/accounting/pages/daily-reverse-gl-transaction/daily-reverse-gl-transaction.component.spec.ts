import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReverseGlTransactionComponent } from './daily-reverse-gl-transaction.component';

describe('DailyReverseGlTransactionComponent', () => {
  let component: DailyReverseGlTransactionComponent;
  let fixture: ComponentFixture<DailyReverseGlTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyReverseGlTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReverseGlTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
