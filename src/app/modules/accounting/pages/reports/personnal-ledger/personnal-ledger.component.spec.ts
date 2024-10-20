import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnalLedgerComponent } from './personnal-ledger.component';

describe('PersonnalLedgerComponent', () => {
  let component: PersonnalLedgerComponent;
  let fixture: ComponentFixture<PersonnalLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonnalLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnalLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
