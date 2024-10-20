import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankCollectionSheetComponent } from './blank-collection-sheet.component';

describe('BlankCollectionSheetComponent', () => {
  let component: BlankCollectionSheetComponent;
  let fixture: ComponentFixture<BlankCollectionSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlankCollectionSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankCollectionSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
