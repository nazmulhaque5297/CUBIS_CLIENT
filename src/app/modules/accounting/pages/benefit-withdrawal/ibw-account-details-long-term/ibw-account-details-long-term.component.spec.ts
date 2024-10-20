import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbwAccountDetailsLongTermComponent } from './ibw-account-details-long-term.component';

describe('IbwAccountDetailsLongTermComponent', () => {
  let component: IbwAccountDetailsLongTermComponent;
  let fixture: ComponentFixture<IbwAccountDetailsLongTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbwAccountDetailsLongTermComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IbwAccountDetailsLongTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
