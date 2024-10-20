import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabMaintainDepositAndSchemeComponent } from './slab-maintain-deposit-and-scheme.component';

describe('SlabMaintainDepositAndSchemeComponent', () => {
  let component: SlabMaintainDepositAndSchemeComponent;
  let fixture: ComponentFixture<SlabMaintainDepositAndSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlabMaintainDepositAndSchemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabMaintainDepositAndSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
