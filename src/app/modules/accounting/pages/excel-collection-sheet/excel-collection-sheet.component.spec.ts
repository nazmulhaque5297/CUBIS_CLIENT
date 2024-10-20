import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelCollectionSheetComponent } from './excel-collection-sheet.component';

describe('ExcelCollectionSheetComponent', () => {
  let component: ExcelCollectionSheetComponent;
  let fixture: ComponentFixture<ExcelCollectionSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelCollectionSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelCollectionSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
