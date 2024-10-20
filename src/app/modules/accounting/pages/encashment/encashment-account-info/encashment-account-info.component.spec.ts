import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncashmentAccountInfoComponent } from './encashment-account-info.component';

describe('EncashmentAccountInfoComponent', () => {
  let component: EncashmentAccountInfoComponent;
  let fixture: ComponentFixture<EncashmentAccountInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncashmentAccountInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncashmentAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
