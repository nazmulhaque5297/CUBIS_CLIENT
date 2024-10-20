import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalAccountsReportComponent } from './final-accounts-report.component';

describe('FinalAccountsReportComponent', () => {
  let component: FinalAccountsReportComponent;
  let fixture: ComponentFixture<FinalAccountsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalAccountsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalAccountsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
