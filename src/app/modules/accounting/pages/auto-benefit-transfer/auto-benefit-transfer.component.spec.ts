import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoBenefitTransferComponent } from './auto-benefit-transfer.component';

describe('AutoBenefitTransferComponent', () => {
  let component: AutoBenefitTransferComponent;
  let fixture: ComponentFixture<AutoBenefitTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoBenefitTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoBenefitTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
