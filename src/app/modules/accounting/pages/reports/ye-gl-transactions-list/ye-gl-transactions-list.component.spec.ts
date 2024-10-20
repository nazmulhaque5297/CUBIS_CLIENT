import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YeGlTransactionsListComponent } from './ye-gl-transactions-list.component';

describe('YeGlTransactionsListComponent', () => {
  let component: YeGlTransactionsListComponent;
  let fixture: ComponentFixture<YeGlTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YeGlTransactionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YeGlTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
