import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterIdListComponent } from './voter-id-list.component';

describe('VoterIdListComponent', () => {
  let component: VoterIdListComponent;
  let fixture: ComponentFixture<VoterIdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoterIdListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoterIdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
