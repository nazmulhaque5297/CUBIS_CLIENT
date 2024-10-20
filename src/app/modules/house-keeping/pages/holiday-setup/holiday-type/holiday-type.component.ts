import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { IdDescription } from 'src/app/interfaces/id-description';
import { HolidaySetupService } from '../../../services/holiday-setup.service';

@Component({
  selector: 'app-holiday-type',
  templateUrl: './holiday-type.component.html',
  styleUrls: ['./holiday-type.component.css'],
})
export class HolidayTypeComponent implements OnInit, OnDestroy {
  public dataList: IdDescription[] = [];
  setupForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  ShowList: boolean = false;
  submitButtonText: string = 'Submit';

  constructor(
    private pService: HolidaySetupService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getDataList();
  }

  private initializeForm() {
    this.setupForm = this.fb.group({
      HolidayTypeCode: new FormControl('',[Validators.required]),
      HolType: new FormControl(''),
      HolTypeDescription: new FormControl('', [Validators.required]),
    });
  }

  private getDataList(): void {
    this.spinner.show();
    this.pService
      .GetHolidayTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dataList = data;
        this.spinner.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ViewList(): void {
    this.ShowList = true;
  }

  onTypeChange(value: number): any {
    var item = new SelectListFilter().getItem(this.dataList, value);
    this.setupForm.controls['HolidayTypeCode'].setValue(
      item != null ? item.Id : value
    );
    this.setupForm.controls['HolType'].setValue(
      item != null ? item.Id.toString() : ''
    );
    this.setupForm.controls['HolTypeDescription'].setValue(item.Description);
    this.submitButtonText = item != null ? 'Update' : 'Save';
    document.getElementById(`HolTypeDescription`).focus();
  }

  SaveOrUpdate(): void {
    console.log("===>",this.setupForm.controls['HolidayTypeCode'].value)
    if (this.setupForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }

    if (confirm('Are You Sure Want To Save Information?')) {
      this.spinner.show();
      var fValue = this.setupForm.value;
      this.pService
        .Submit(fValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.spinner.hide();
          alert('Data updated successfully');
          this.getDataList();
          this.initializeForm();
        });
    }
  }
}
