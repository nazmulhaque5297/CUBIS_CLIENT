import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChequeBookComponent } from './search-cheque-book.component';

describe('SearchChequeBookComponent', () => {
  let component: SearchChequeBookComponent;
  let fixture: ComponentFixture<SearchChequeBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchChequeBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChequeBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
