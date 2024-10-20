import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJournalTransactionComponent } from './general-journal-transaction.component';

describe('GeneralJournalTransactionComponent', () => {
  let component: GeneralJournalTransactionComponent;
  let fixture: ComponentFixture<GeneralJournalTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralJournalTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJournalTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
