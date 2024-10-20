import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavenDaysWithdrawalNoticeComponent } from './saven-days-withdrawal-notice.component';

describe('SavenDaysWithdrawalNoticeComponent', () => {
  let component: SavenDaysWithdrawalNoticeComponent;
  let fixture: ComponentFixture<SavenDaysWithdrawalNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavenDaysWithdrawalNoticeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavenDaysWithdrawalNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
