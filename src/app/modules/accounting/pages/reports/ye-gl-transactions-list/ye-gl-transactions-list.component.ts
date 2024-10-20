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

@Component({
  selector: 'app-ye-gl-transactions-list',
  templateUrl: './ye-gl-transactions-list.component.html',
  styleUrls: ['./ye-gl-transactions-list.component.css'],
})
export class YeGlTransactionsListComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp =
    new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  //public pageLoadModel:AccountOpenCloseReportPageLoadModel=new AccountOpenCloseReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  PageLoadData: any[] = [];
  GLYearTransactionList: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private gLYearTransactionListReportService: GLYearTransactionListReportService
  ) {
    this.reportModel.ReportName = 'rptGLYearEndTransactionDetailList';
    this.reportModel.Values = [];
  }
  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.GLYearTransactionList = new FormGroup({
      IssueFromDate: new FormControl(''),
    });

    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.spinner.show();
    this.gLYearTransactionListReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        console.log('Date:', data);
        this.PageLoadData = data;
        this.GLYearTransactionList.controls['IssueFromDate'].setValue(
          data.ProcessDate
        );
        this.spinner.hide();
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
    var fValue = this.GLYearTransactionList.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('fDate', fValue.IssueFromDate)
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
}
