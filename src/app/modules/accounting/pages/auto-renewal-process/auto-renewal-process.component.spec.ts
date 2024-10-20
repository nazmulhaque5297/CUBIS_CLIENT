import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoRenewalProcessComponent } from './auto-renewal-process.component';

describe('AutoRenewalProcessComponent', () => {
  let component: AutoRenewalProcessComponent;
  let fixture: ComponentFixture<AutoRenewalProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoRenewalProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRenewalProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
