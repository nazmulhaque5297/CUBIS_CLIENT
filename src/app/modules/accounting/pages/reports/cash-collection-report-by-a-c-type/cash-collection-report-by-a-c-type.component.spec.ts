import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCollectionReportByACTypeComponent } from './cash-collection-report-by-a-c-type.component';

describe('CashCollectionReportByACTypeComponent', () => {
  let component: CashCollectionReportByACTypeComponent;
  let fixture: ComponentFixture<CashCollectionReportByACTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashCollectionReportByACTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashCollectionReportByACTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
