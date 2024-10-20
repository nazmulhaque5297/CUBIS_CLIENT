import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoProvisionProcessComponent } from './auto-provision-process.component';

describe('AutoProvisionProcessComponent', () => {
  let component: AutoProvisionProcessComponent;
  let fixture: ComponentFixture<AutoProvisionProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoProvisionProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoProvisionProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
