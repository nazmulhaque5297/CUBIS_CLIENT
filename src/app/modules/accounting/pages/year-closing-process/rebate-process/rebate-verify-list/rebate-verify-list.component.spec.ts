import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebateVerifyListComponent } from './rebate-verify-list.component';

describe('RebateVerifyListComponent', () => {
  let component: RebateVerifyListComponent;
  let fixture: ComponentFixture<RebateVerifyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RebateVerifyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RebateVerifyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
