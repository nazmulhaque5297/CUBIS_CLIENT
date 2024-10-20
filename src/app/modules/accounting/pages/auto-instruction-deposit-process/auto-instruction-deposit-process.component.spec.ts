import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoInstructionDepositProcessComponent } from './auto-instruction-deposit-process.component';

describe('AutoInstructionDepositProcessComponent', () => {
  let component: AutoInstructionDepositProcessComponent;
  let fixture: ComponentFixture<AutoInstructionDepositProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoInstructionDepositProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoInstructionDepositProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
