import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitWithdrawalComponent } from './benefit-withdrawal.component';

describe('BenefitWithdrawalComponent', () => {
  let component: BenefitWithdrawalComponent;
  let fixture: ComponentFixture<BenefitWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenefitWithdrawalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
