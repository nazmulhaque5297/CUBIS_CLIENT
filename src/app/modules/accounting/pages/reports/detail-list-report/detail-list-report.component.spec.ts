import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailListReportComponent } from './detail-list-report.component';

describe('DetailListReportComponent', () => {
  let component: DetailListReportComponent;
  let fixture: ComponentFixture<DetailListReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailListReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
