import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbwAccountDetailsShortTermComponent } from './ibw-account-details-short-term.component';

describe('IbwAccountDetailsShortTermComponent', () => {
  let component: IbwAccountDetailsShortTermComponent;
  let fixture: ComponentFixture<IbwAccountDetailsShortTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbwAccountDetailsShortTermComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IbwAccountDetailsShortTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
