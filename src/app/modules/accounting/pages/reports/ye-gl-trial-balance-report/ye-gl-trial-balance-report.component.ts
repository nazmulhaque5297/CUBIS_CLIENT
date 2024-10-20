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
import { FormGroup, FormControl } from '@angular/forms';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import { Router } from '@angular/router';
import { GLYearTransactionListReportService } from 'src/app/services/gl-year-transaction.service';
import { GLTrialBalanceReportService } from 'src/app/services/gl-trial-balance-report.service';

@Component({
  selector: 'app-ye-gl-trial-balance-report',
  templateUrl: './ye-gl-trial-balance-report.component.html',
  styleUrls: ['./ye-gl-trial-balance-report.component.css'],
})
export class YeGlTrialBalanceReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  //public pageLoadModel:AccountOpenCloseReportPageLoadModel=new AccountOpenCloseReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  PageLoadData: any[] = [];
  storefDate: any;
  storetDate: any;
  YEGLTrialBalanceForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private gLTrialBalanceReportService: GLTrialBalanceReportService
  ) {
    this.reportModel.ReportName = 'CCULB_rptYETrialBalanceOld';
    this.reportModel.Values = [];
  }
  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.YEGLTrialBalanceForm = new FormGroup({
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      showZeroChb: new FormControl(false),
    });

    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.gLTrialBalanceReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        console.log('Date:', data);
        this.PageLoadData = data;
        this.YEGLTrialBalanceForm.controls['IssueFromDate'].setValue(
          data.FromDate
        );
        this.YEGLTrialBalanceForm.controls['IssueToDate'].setValue(data.ToDate);
        this.storefDate = data.FromDate;
        this.storetDate = data.ToDate;
      });
  }

  public getReportToken = () => {
    this.spinner.show();
    this.setParameter();
    this.displayIFrame = true;
    console.log(this.reportModel);
    this.aService
      .getReportToken(this.reportModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (x) => {
          this.setIframe(x);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setParameter(): void {
    var fValue = this.YEGLTrialBalanceForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(new ReportKeyValue('fDate', this.storefDate));
    this.reportModel.Values.push(new ReportKeyValue('tDate', this.storetDate));

    this.reportModel.Values.push(
      new ReportKeyValue('CommonName1', ' YE Trial Balance Report')
    );
    this.reportModel.Values.push(new ReportKeyValue('CommonNo1', '0'));

    this.reportModel.Values.push(new ReportKeyValue('CommonNo2', '0'));
    this.reportModel.Values.push(new ReportKeyValue('CommonNo3', '0'));

    this.reportModel.Values.push(
      new ReportKeyValue('ShowBtn', fValue.showZeroChb)
    );

    console.log(this.reportModel.Values);
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };

  exitPage() {
    this.router.navigate(['accounting/']);
  }

  applicationDateChange() {
    var fv = this.YEGLTrialBalanceForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.YEGLTrialBalanceForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.YEGLTrialBalanceForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.YEGLTrialBalanceForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.YEGLTrialBalanceForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.YEGLTrialBalanceForm.value);
    console.log(this.storetDate);
  }
}
