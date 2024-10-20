import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareProtectionProcessComponent } from './share-protection-process.component';

describe('ShareProtectionProcessComponent', () => {
  let component: ShareProtectionProcessComponent;
  let fixture: ComponentFixture<ShareProtectionProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareProtectionProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareProtectionProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
