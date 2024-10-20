import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeStatusChangeComponent } from './cheque-status-change.component';

describe('ChequeStatusChangeComponent', () => {
  let component: ChequeStatusChangeComponent;
  let fixture: ComponentFixture<ChequeStatusChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeStatusChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
