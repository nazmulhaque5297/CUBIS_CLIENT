import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackUpProcessComponent } from './back-up-process.component';

describe('BackUpProcessComponent', () => {
  let component: BackUpProcessComponent;
  let fixture: ComponentFixture<BackUpProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackUpProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackUpProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
