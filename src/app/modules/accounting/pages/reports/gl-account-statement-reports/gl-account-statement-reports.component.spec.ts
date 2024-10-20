import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlAccountStatementReportsComponent } from './gl-account-statement-reports.component';

describe('GlAccountStatementReportsComponent', () => {
  let component: GlAccountStatementReportsComponent;
  let fixture: ComponentFixture<GlAccountStatementReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlAccountStatementReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlAccountStatementReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
