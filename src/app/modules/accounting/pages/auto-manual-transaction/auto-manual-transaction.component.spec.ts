import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoManualTransactionComponent } from './auto-manual-transaction.component';

describe('AutoManualTransactionComponent', () => {
  let component: AutoManualTransactionComponent;
  let fixture: ComponentFixture<AutoManualTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoManualTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoManualTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
