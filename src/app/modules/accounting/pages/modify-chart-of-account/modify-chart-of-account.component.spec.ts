import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyChartOfAccountComponent } from './modify-chart-of-account.component';

describe('ModifyChartOfAccountComponent', () => {
  let component: ModifyChartOfAccountComponent;
  let fixture: ComponentFixture<ModifyChartOfAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyChartOfAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyChartOfAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
