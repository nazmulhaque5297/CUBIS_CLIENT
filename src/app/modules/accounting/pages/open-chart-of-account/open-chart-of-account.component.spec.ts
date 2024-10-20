import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenChartOfAccountComponent } from './open-chart-of-account.component';

describe('OpenChartOfAccountComponent', () => {
  let component: OpenChartOfAccountComponent;
  let fixture: ComponentFixture<OpenChartOfAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenChartOfAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenChartOfAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
