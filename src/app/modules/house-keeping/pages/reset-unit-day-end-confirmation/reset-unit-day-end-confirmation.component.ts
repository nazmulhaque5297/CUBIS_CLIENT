import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { HouseKeepingService } from '../../house-keeping.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { ReportCommonService } from 'src/app/services/report-common.service';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';

import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import { LoanReceivedReportInputHelp } from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';

import { IdDescription } from 'src/app/interfaces/id-description';

@Component({
  selector: 'app-reset-unit-day-end-confirmation',
  templateUrl: './reset-unit-day-end-confirmation.component.html',
  styleUrls: ['./reset-unit-day-end-confirmation.component.css'],
})
export class ResetUnitDayEndConfirmationComponent implements OnInit {
  dataList = [];

  ResetUnitDayEndForm: FormGroup;
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService
  ) {
    this.reportModel.ReportName = 'rptCSParameter02';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }
  private initializeForm() {
    this.ResetUnitDayEndForm = new FormGroup({
      BranchDdl: new FormControl('0'),
    });
  }
  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.spinner.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  SaveOrUpdate(): void {
    if (this.ResetUnitDayEndForm.controls['BranchDdl'].value == '0') {
      alert('Please Select Branch!');
      return;
    }
    if (confirm('Are You Sure Want To Save Information?')) {
      this.spinner.show();
      var fValue = this.ResetUnitDayEndForm.value;
      console.log('This is fValue :', fValue);
      this.loanReceivedReportService
        .Submit(fValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.spinner.hide();
          alert(data.Message);
          this.setDefaultOptions();
          this.initializeForm();
        });
    }
  }
}
