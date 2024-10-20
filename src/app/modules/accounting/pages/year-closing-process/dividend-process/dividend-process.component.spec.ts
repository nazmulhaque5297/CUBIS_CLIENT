import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendProcessComponent } from './dividend-process.component';

describe('DividendProcessComponent', () => {
  let component: DividendProcessComponent;
  let fixture: ComponentFixture<DividendProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DividendProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DividendProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
