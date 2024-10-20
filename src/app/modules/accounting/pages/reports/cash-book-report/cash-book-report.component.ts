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
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cash-book-report',
  templateUrl: './cash-book-report.component.html',
  styleUrls: ['./cash-book-report.component.css'],
})
export class CashBookReportComponent implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  storefDate: any;
  storetDate: any;
  chbIsBankypeStatus: boolean = false;
  CashBookReportForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private loanInfoReportService: LoanInfoReportService
  ) {
    this.reportModel.ReportName = 'CCULB_rptMGLCashBookByAccCodeWithBank';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.CashBookReportForm = new FormGroup({
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      chbWithBank: new FormControl(false),
      rbReportLang: new FormControl('1'),
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
        this.CashBookReportForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.CashBookReportForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;

        this.spinner.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public checkIsBankTypeValue(e) {
    if (this.chbIsBankypeStatus == false) {
    }
  }
  public RadioButtonValue(e) {}

  private setParameter(): void {
    var fValue = this.CashBookReportForm.value;
    this.reportModel.Values = [];

    // report Name

    if (fValue.rbReportLang == 1) {
      if (this.chbIsBankypeStatus) {
        this.reportModel.ReportName = 'CCULB_rptMGLCashBookByAccCodeWithBank';
      } else {
        this.reportModel.ReportName = 'CCULB_rptMGLCashBookByAccCode';
      }
    } else if (fValue.rbReportLang == 2) {
      if (this.chbIsBankypeStatus) {
        this.reportModel.ReportName = 'CCULB_rptMGLCashBookByAccCodeBWithBank';
      } else {
        this.reportModel.ReportName = 'CCULB_rptMGLCashBookByAccCodeB';
      }
    }
    // report Name

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );

    if (fValue.rbReportLang == 1) {
      this.reportModel.Values.push(
        new ReportKeyValue('Name1', 'Daily Cash Book')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('Name1', 'bM`vb ewn - c~b© weeiY')
      );
    }

    //   if (this.rbtOptDetails.Checked && this.rbtEnglish.Checked)
    //   SessionStore.SaveToCustomStore("@CommonName1", (object) "Daily Cash Book");
    // else if (this.rbtOptDetails.Checked && this.rbtBangla.Checked)
    //   SessionStore.SaveToCustomStore("@CommonName1", (object) );
    // else if (this.rbtOptSummary.Checked && this.rbtEnglish.Checked)
    //   SessionStore.SaveToCustomStore("@CommonName1", (object) "Cash Book - Summary");
    // else if (this.rbtOptSummary.Checked && this.rbtBangla.Checked)
    //   SessionStore.SaveToCustomStore("@CommonName1", (object) "bM`vb ewn - mvims‡¶c");

    if (this.chbIsBankypeStatus == false) {
      this.reportModel.Values.push(new ReportKeyValue('nFlag', '20'));
    } else {
      this.reportModel.Values.push(new ReportKeyValue('nFlag', '10'));
    }
  }

  public getReportToken = (type: any) => {
    // let mNo = this.PrevTransTransferListForm.controls['MemNo'].value;
    // console.log(mNo);
    // if (mNo === '') {
    //   this.toastr.error('Please Input Member!', 'Error');
    // } else {
    this.spinner.show();
    this.setParameter();
    //this.spinner.show();
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
    // }
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

  exitPage() {
    this.router.navigate(['accounting/']);
  }
  applicationDateChange() {
    var fv = this.CashBookReportForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CashBookReportForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.CashBookReportForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.CashBookReportForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CashBookReportForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.CashBookReportForm.value);
    console.log(this.storetDate);
  }
}
