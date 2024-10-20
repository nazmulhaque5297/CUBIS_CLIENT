import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOfficeCodeMaintenanceComponent } from './post-office-code-maintenance.component';

describe('PostOfficeCodeMaintenanceComponent', () => {
  let component: PostOfficeCodeMaintenanceComponent;
  let fixture: ComponentFixture<PostOfficeCodeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostOfficeCodeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostOfficeCodeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
