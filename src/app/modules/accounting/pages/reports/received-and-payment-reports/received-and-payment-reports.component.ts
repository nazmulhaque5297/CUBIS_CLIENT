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
import { JournalReportService } from 'src/app/services/journal-report.service';
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { JournalReportInputHelp } from 'src/app/Models/journal-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import {
  CashCollectionAccPageLoadModel,
  CashCollectionMemberNoChngModel,
} from '../../../models/cash-collection-report-by-acc.model';
import { CashCollectionReportByAccService } from 'src/app/services/cash-collection-report-by-acc.service';
import { GLAccountStatementPageLoadModel } from '../../../models/gl-account-statement-report.model';
import { GLAccountStatementService } from 'src/app/services/gl-account-statement-report.service';
import { Location } from '@angular/common';
import { VoterIdListReportService } from 'src/app/services/voter-id-list.service';
import { VoterIdListPageLoadModel } from '../../../models/voter-id-list.model';
import { PaymentAndReceiveReportPageLoadModel } from '../../../models/payment-and-receive.model';
import { ReceivedAndPaymentReportService } from 'src/app/services/receive-and-payment-report.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-received-and-payment-reports',
  templateUrl: './received-and-payment-reports.component.html',
  styleUrls: ['./received-and-payment-reports.component.css'],
})
export class ReceivedAndPaymentReportsComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public paymentAndReceiveReportPageLoadModel: PaymentAndReceiveReportPageLoadModel = new PaymentAndReceiveReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  ReceivedAndPaymentForm: FormGroup;
  chbIsZeroStatus: boolean = false;
  chbIsBankStatus: boolean = false;
  chbIsBankypeStatus: boolean = false;
  storefDate: any;
  storetDate: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    // private loanInfoReportService: LoanInfoReportService,
    private receivedAndPaymentReportService: ReceivedAndPaymentReportService
  ) {
    this.reportModel.ReportName = 'rptReceivedPayment4th';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.ReceivedAndPaymentForm = new FormGroup({
      IsZero: new FormControl(''),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      LanguageModeRb: new FormControl('0'),
      CashAndHandControl: new FormControl(false),
    });

    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.receivedAndPaymentReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.paymentAndReceiveReportPageLoadModel = data;
        console.log('ALL Data:', this.paymentAndReceiveReportPageLoadModel);
        this.ReceivedAndPaymentForm.controls['IssueFromDate'].setValue(
          this.paymentAndReceiveReportPageLoadModel.FromDate
        );
        this.ReceivedAndPaymentForm.controls['IssueToDate'].setValue(
          this.paymentAndReceiveReportPageLoadModel.ToDate
        );

        this.storefDate = this.paymentAndReceiveReportPageLoadModel.FromDate;
        this.storetDate = this.paymentAndReceiveReportPageLoadModel.ToDate;
      });
  }

  public getReportToken = (type: any) => {
    this.spinner.show();
    this.setParameter();
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
  setParameter(): void {
    var fValue = this.ReceivedAndPaymentForm.value;
    this.reportModel.Values = [];
    if (fValue.CashAndHandControl && fValue.LanguageModeRb == 1) {
      alert('Please UnCheck Only Cash In Hand & Bank Checkbox!!!');
      return;
    } else {
      if (fValue.CashAndHandControl && fValue.LanguageModeRb == 0) {
        this.reportModel.ReportName = 'CCULB_rptReceivedPayment4thByBank';
      } else if (!fValue.CashAndHandControl && fValue.LanguageModeRb == 0) {
        this.reportModel.ReportName = 'CCULB_rptReceivedPayment4th';
      } else if (!fValue.CashAndHandControl && fValue.LanguageModeRb == 1) {
        this.reportModel.ReportName = 'CCULB_rptReceivedPayment4thB';
      }
      // else if(fValue.CashAndHandControl && fValue.LanguageModeRb==1)
      // {
      //   this.reportModel.ReportName = 'CCULB_rptReceivedPayment3rdB';
      // }

      this.reportModel.Values.push(
        new ReportKeyValue('fDate', this.storefDate)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('tDate', this.storetDate)
      );

      if (!fValue.CashAndHandControl && fValue.LanguageModeRb == 0) {
        this.reportModel.Values.push(
          new ReportKeyValue('Name1', 'Receipts & Payments - Details')
        );
      } else if (fValue.CashAndHandControl && fValue.LanguageModeRb == 0) {
        this.reportModel.Values.push(
          new ReportKeyValue('Name1', 'Receipts & Payments - Bank')
        );
      } else if (!fValue.CashAndHandControl && fValue.LanguageModeRb == 1) {
        this.reportModel.Values.push(
          new ReportKeyValue('Name1', 'Av`vb Ges cÖ`vb - c~b© weeiY')
        );
      }

      this.reportModel.Values.push(
        new ReportKeyValue('showZero', fValue.IsZero)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('IsBank', fValue.CashAndHandControl)
      );

      console.log(this.reportModel.Values);
    }
    //this.getReportToken('PDF');
  }

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
    var fv = this.ReceivedAndPaymentForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.ReceivedAndPaymentForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.ReceivedAndPaymentForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.ReceivedAndPaymentForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.ReceivedAndPaymentForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.ReceivedAndPaymentForm.value);
    console.log(this.storetDate);
  }
}
