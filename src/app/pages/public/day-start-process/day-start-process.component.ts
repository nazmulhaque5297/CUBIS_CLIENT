import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProcessStartDateModel } from 'src/app/Models/Common.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import { DayStartProcessService } from 'src/app/services/day-start-process.service';

@Component({
  selector: 'app-day-start-process',
  templateUrl: './day-start-process.component.html',
  styleUrls: ['./day-start-process.component.css'],
})
export class DayStartProcessComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public itemOb: IProcessStartDateModel;
  dayStartForm: FormGroup;
  public HolidayTypeList: IdDescription[];
  public isChangeDate: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private dayStartService: DayStartProcessService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.dayStartService
      .GetHolidayList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.spinner.hide();
        this.HolidayTypeList = response;
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ChangeDate() {
    this.isChangeDate = true;
  }

  initializeForm() {
    this.dayStartForm = this.fb.group({
      LastTransactionDate: [this.itemOb.LastTransactionDate],
      NewProcessDate: [this.itemOb.NewProcessDate, Validators.required],
      ChangeProcessDate: [this.itemOb.ChangeProcessDate, Validators.required],
      StartOfDay: [this.itemOb.StartOfDay, Validators.required],
      ChangeNotes: [this.itemOb.ChangeNotes],
      HolidayType: ['0'],
    });
  }

  UpdateProcess() {
    if (this.dayStartForm.invalid) {
      this.toaster.warning('Please fill all the required field!');
      return;
    }
    this.spinner.show();

    var fValue = this.dayStartForm.value as IProcessStartDateModel;
    fValue.LastYear = this.itemOb.LastYear;
    fValue.NewYear = this.itemOb.NewYear;
    fValue.PrevProcessDate = this.itemOb.PrevProcessDate;
    fValue.NewProcessDateShort = this.itemOb.NewProcessDateShort;

    this.dayStartService
      .SubmitStartOfDay(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.spinner.hide();
        if (response.Success) {
          this.toaster.success('Day Start Process Successfully Done');
          this.activeModal.close(true);
          location.reload();
        } else {
          this.toaster.error(response.Message);
        }
      });
  }
}
