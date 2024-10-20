import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceChargeProcessComponent } from './service-charge-process.component';

describe('ServiceChargeProcessComponent', () => {
  let component: ServiceChargeProcessComponent;
  let fixture: ComponentFixture<ServiceChargeProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceChargeProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceChargeProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
