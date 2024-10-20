import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookRegisterComponent } from './cheque-book-register.component';

describe('ChequeBookRegisterComponent', () => {
  let component: ChequeBookRegisterComponent;
  let fixture: ComponentFixture<ChequeBookRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeBookRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBookRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
