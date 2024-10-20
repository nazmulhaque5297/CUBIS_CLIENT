import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersACCashCollectionReportControlComponent } from './others-a-c-cash-collection-report-control.component';

describe('OthersACCashCollectionReportControlComponent', () => {
  let component: OthersACCashCollectionReportControlComponent;
  let fixture: ComponentFixture<OthersACCashCollectionReportControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OthersACCashCollectionReportControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersACCashCollectionReportControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
