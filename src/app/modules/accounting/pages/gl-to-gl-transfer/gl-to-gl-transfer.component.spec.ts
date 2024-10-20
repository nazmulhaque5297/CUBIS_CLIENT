import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlToGlTransferComponent } from './gl-to-gl-transfer.component';

describe('GlToGlTransferComponent', () => {
  let component: GlToGlTransferComponent;
  let fixture: ComponentFixture<GlToGlTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlToGlTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlToGlTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
