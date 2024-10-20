import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAnniversaryProcessingComponent } from './auto-anniversary-processing.component';

describe('AutoAnniversaryProcessingComponent', () => {
  let component: AutoAnniversaryProcessingComponent;
  let fixture: ComponentFixture<AutoAnniversaryProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoAnniversaryProcessingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoAnniversaryProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
