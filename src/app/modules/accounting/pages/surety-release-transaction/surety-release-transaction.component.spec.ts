import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuretyReleaseTransactionComponent } from './surety-release-transaction.component';

describe('SuretyReleaseTransactionComponent', () => {
  let component: SuretyReleaseTransactionComponent;
  let fixture: ComponentFixture<SuretyReleaseTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuretyReleaseTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuretyReleaseTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
