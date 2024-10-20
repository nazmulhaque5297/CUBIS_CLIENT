import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearEndPostTranscationComponent } from './year-end-post-transcation.component';

describe('YearEndPostTranscationComponent', () => {
  let component: YearEndPostTranscationComponent;
  let fixture: ComponentFixture<YearEndPostTranscationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearEndPostTranscationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearEndPostTranscationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
