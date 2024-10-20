import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ReportEnum } from 'src/app/enums/report-enum';
import { FormGroup, FormControl } from '@angular/forms';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import { LoanReceivedReportInputHelp } from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';

@Component({
  selector: 'app-daily-transaction-summary-report',
  templateUrl: './daily-transaction-summary-report.component.html',
  styleUrls: ['./daily-transaction-summary-report.component.css'],
})
export class DailyTransactionSummaryReportComponent
  implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();

  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  DailyTransactionSummaryListForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe
  ) {
    this.reportModel.ReportName = 'rptCsTransactionSummaryList';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.DailyTransactionSummaryListForm = new FormGroup({
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
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
        this.DailyTransactionSummaryListForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.DailyTransactionSummaryListForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.spinner.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.DailyTransactionSummaryListForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', fValue.IssueFromDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', fValue.IssueToDate)
    );
  }

  public getReportToken = (type: any) => {
    this.setParameter();
    this.spinner.show();
    this.displayIFrame = true;
    console.log(this.reportModel);
    this.aService
      .getReportToken(this.reportModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (x) => {
          if (type === 'CRV') {
            this.setIframeCRV(x);
          } else {
            this.setIframe(x);
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };

  private setIframeCRV = (x: any) => {
    var iFramePath =
      environment.reportUrl +
      'id=' +
      x.id +
      '&token=' +
      x.token +
      '&type=crViewer';

    window.open(iFramePath, '_blank');
  };

  // Date change event
  applicationDateChange() {
    var value = this.datepipe.transform(
      this.DailyTransactionSummaryListForm.value.IssueFromDate,
      'dd-MM-yyyy'
    );
    var formatedValue = this.aService.convertDateToString(value);
    this.DailyTransactionSummaryListForm.value.IssueFromDate = formatedValue;
    var value = this.datepipe.transform(
      this.DailyTransactionSummaryListForm.value.IssueToDate,
      'dd-MM-yyyy'
    );
    this.DailyTransactionSummaryListForm.value.IssueToDate = this.aService.convertDateToString(
      value
    );
    console.log('this is formated from date', formatedValue);
    console.log('fvalue', this.DailyTransactionSummaryListForm.value);
  }
  applicationDateChange2() {
    var value = this.datepipe.transform(
      this.DailyTransactionSummaryListForm.value.IssueToDate,
      'dd-MM-yyyy'
    );
    var formatedValue = this.aService.convertDateToString(value);
    this.DailyTransactionSummaryListForm.value.IssueToDate = formatedValue;
    var value = this.datepipe.transform(
      this.DailyTransactionSummaryListForm.value.IssueFromDate,
      'dd-MM-yyyy'
    );
    this.DailyTransactionSummaryListForm.value.IssueFromDate = this.aService.convertDateToString(
      value
    );
    console.log('this is formated to date', formatedValue);
    console.log('fvalue', this.DailyTransactionSummaryListForm.value);
  }
}
