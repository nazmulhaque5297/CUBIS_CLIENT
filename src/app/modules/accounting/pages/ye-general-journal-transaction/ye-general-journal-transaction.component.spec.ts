import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YeGeneralJournalTransactionComponent } from './ye-general-journal-transaction.component';

describe('YeGeneralJournalTransactionComponent', () => {
  let component: YeGeneralJournalTransactionComponent;
  let fixture: ComponentFixture<YeGeneralJournalTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YeGeneralJournalTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YeGeneralJournalTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
