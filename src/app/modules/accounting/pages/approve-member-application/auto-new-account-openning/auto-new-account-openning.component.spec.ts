import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoNewAccountOpenningComponent } from './auto-new-account-openning.component';

describe('AutoNewAccountOpenningComponent', () => {
  let component: AutoNewAccountOpenningComponent;
  let fixture: ComponentFixture<AutoNewAccountOpenningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoNewAccountOpenningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoNewAccountOpenningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
