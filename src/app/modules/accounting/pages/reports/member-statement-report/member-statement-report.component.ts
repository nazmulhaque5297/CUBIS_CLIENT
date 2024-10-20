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
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';

@Component({
  selector: 'app-member-statement-report',
  templateUrl: './member-statement-report.component.html',
  styleUrls: ['./member-statement-report.component.css'],
})
export class MemberStatementReportComponent implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();

  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  storefDate: any;
  storetDate: any;

  MemberStatementForm: FormGroup;
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    // this.reportModel.ReportName = 'MemberStatementByDate';
    this.reportModel.ReportName = 'MemberStatementByAccNo';

    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    this.MemberStatementForm = new FormGroup({
      IsOldMem: new FormControl(false),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      MemNo: new FormControl(''),
      MemName: new FormControl(''),
      IsActiveAcc: new FormControl(true),
      rbAccount: new FormControl('1'),
    });
  }

  // eneter key events
  onEnterMemNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IssueFromDate`).focus();
  }

  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.MemberStatementForm.controls['IssueFromDate'].setValue(
          data.frmDateMemStat
        );
        this.MemberStatementForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.spinner.hide();
        this.storefDate = data.frmDateMemStat;
        this.storetDate = data.ApplicationDate;
      });
  }

  onChangeMemNo(event: any) {
    let IsOldCheck = this.MemberStatementForm.controls['IsOldMem'].value;
    console.log(IsOldCheck);
    let MemNoId = this.MemberStatementForm.controls['MemNo'].value;
    console.log(MemNoId);
    if (MemNoId) {
      this.spinner.show();
      this.loanInfoReportService
        .GetMemberDetails(IsOldCheck, MemNoId)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.MemberDetailsList = x;
            // invalid memberno
            if (this.MemberDetailsList.MemberNo == 0) {
              alert('Invalid Member No!');
            }
            if (this.MemberDetailsList.MemberName) {
              this.MemberStatementForm.patchValue({
                //MemNo: this.MemberDetailsList.MemberNo,
                MemName: this.MemberDetailsList.MemberName,
              });
            }
            console.log(this.MemberDetailsList);
            console.log(this.MemberDetailsList.MemberName);
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.MemberDetailsList = null;
    }
  }

  private setParameter(): void {
    var fValue = this.MemberStatementForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );
    this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));
    var mName = this.MemberDetailsList.MemberName;
    this.reportModel.Values.push(new ReportKeyValue('MemberDesc', mName));
    this.reportModel.Values.push(
      new ReportKeyValue('rbAccount', fValue.rbAccount)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IsActiveAcc', fValue.IsActiveAcc ? '0' : '1')
    );
    if (fValue.rbAccount === '1') {
      //this.reportModel.ReportName = 'MemberStatementByAccNo';
      this.reportModel.ReportName = 'rptCSMemberStatementByAccNo';
    } else {
      //this.reportModel.ReportName = 'MemberStatementByDate';
      this.reportModel.ReportName = 'rptCSMemberStatementByDate';
    }
  }

  public getReportToken = (type: any) => {
    let memNo = this.MemberStatementForm.controls['MemNo'].value;
    console.log(memNo);
    if (memNo == '') {
      alert('Please Input Member No!');
    } else {
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
    }
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
    var fv = this.MemberStatementForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.MemberStatementForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.MemberStatementForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.MemberStatementForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.MemberStatementForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.MemberStatementForm.value);
    console.log(this.storetDate);
  }
}
