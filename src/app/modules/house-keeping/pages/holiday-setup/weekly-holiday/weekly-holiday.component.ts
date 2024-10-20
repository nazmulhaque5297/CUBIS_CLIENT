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
import { IdDescription } from 'src/app/interfaces/id-description';
import { HolidaySetupService } from '../../../services/holiday-setup.service';

@Component({
  selector: 'app-weekly-holiday',
  templateUrl: './weekly-holiday.component.html',
  styleUrls: ['./weekly-holiday.component.css'],
})
export class WeeklyHolidayComponent implements OnInit, OnDestroy {
  public dataList: IdDescription[] = [];
  setupForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();

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
      Day1: new FormControl('0'),
      Day2: new FormControl('0'),
    });
  }

  private getDataList(): void {
    this.spinner.show();
    this.pService
      .GetWeekDays()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dataList = data;
        this.spinner.hide();
      });

    this.pService
      .GetAssignedWeekDays()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.setupForm.controls['Day1'].setValue(data.HolWeekDay1);
        this.setupForm.controls['Day2'].setValue(data.HolWeekDay2);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  Update(): void {
    if (confirm('Are you sure you want to Update information?')) {
      this.spinner.show();
      var fValue = this.setupForm.value;
      this.pService
        .UpdateWeekHoliday(fValue.Day1, fValue.Day2)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          alert('Data updated successfully');
          this.spinner.hide();
        });
    }
  }
}
