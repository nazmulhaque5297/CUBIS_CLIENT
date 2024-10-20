import { Component, OnInit } from '@angular/core';
import {
  LoanApplicationCreateModel,
  ReturnScheduleHelpDataModel,
  ReturnScheduleViewModel,
} from '../../../models/loan-application.model';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportCommonService } from 'src/app/services/report-common.service';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { NgxSpinnerService } from 'ngx-spinner';

import { environment } from 'src/environments/environment';

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

import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';

@Component({
  selector: 'app-loan-return-schedule',
  templateUrl: './loan-return-schedule.component.html',
  styleUrls: ['./loan-return-schedule.component.css'],
})
export class LoanReturnScheduleComponent implements OnInit {
  module: string = '1';
  loanData: any;
  loanDataForHelp: ReturnScheduleHelpDataModel = new ReturnScheduleHelpDataModel();
  private destroy$: Subject<void> = new Subject<void>();
  dataList: ReturnScheduleViewModel[] = [];
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  // LoanReturnScheduleForm: FormGroup;

  constructor(
    private loanApplicationService: LoanApplicationService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private journalReportService: JournalReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    this.reportModel.ReportName = 'rptLoanCalculateReportA';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.loanData = JSON.parse(localStorage.getItem('returnScheduleData'));
    this.inputHelpData();
  }
  inputHelpData() {
    console.log(this.loanData);
    var x = new LoanApplicationCreateModel();
    var accountTypeTitle = JSON.parse(localStorage.getItem('accountTypeTitle'));
    x = this.loanData;
    console.log(this.loanData);
    debugger;
    this.loanDataForHelp.LoanApplicationAmount = x.LoanApplicationAmount;
    this.loanDataForHelp.LoanGracePeriod = x.LoanGracePeriod;
    this.loanDataForHelp.LoanInstallmentAmount = x.LoanInstallmentAmount;
    this.loanDataForHelp.LoanInterestRate = x.LoanInterestRate;
    this.loanDataForHelp.LoanLastInstallmentAmount = x.LoanLastInstallmentAmount;
    this.loanDataForHelp.LoanNoInstallment = x.LoanNoInstallment;
    this.loanDataForHelp.DepositMode = x.DepositMode;
    this.loanDataForHelp.WeeklyDay = 0;
    this.loanDataForHelp.LoanFirstInstallmentDate = this.loanData.LoanFirstInstallmentdate;
    debugger;
    this.loanDataForHelp.LoanSecondInstallmentDate = this.loanData.LoanSecondInstallmentdate;
    debugger;
    this.loanDataForHelp.LoanMemberNo = x.LoanMemberNo;
    this.loanDataForHelp.LoanMemberName = x.LoanMemberName;
    this.loanDataForHelp.LoanApplicationDate = this.loanData.ApplicationDate;
    this.loanDataForHelp.LoanCalMethod = x.LoanInterestCalMethod;
    this.loanDataForHelp.LoanAccountTypeTitle = accountTypeTitle;
    console.log(this.loanDataForHelp);
    this.spinner.show();
    this.loanApplicationService
      .ReturnScheduleData(this.loanDataForHelp)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dataList = data;
        for (var i = 0; i < this.dataList.length; i++) {
          let dateString = this.dataList[i].LoanMthDate;
          let momentVariable = this.datepipe.transform(
            dateString,
            'dd-MM-yyyy'
          );
          this.dataList[i].LoanMthDate = momentVariable;
        }
        console.log(this.dataList);
        this.spinner.hide();
      });
  }
  closeThisPage() {
    window.close();
  }

  private setParameter(): void {
    this.reportModel.ReportName = 'rptLoanCalculateReportA';
    var memNo = this.loanDataForHelp.LoanMemberNo;
    var accTypeDesc = this.loanDataForHelp.LoanAccountTypeTitle;
    var LoanAmount = this.loanDataForHelp.LoanApplicationAmount;
    var NoInstallment = this.loanDataForHelp.LoanNoInstallment;
    var InterestRate = this.loanDataForHelp.LoanInterestRate;

    var OpenDate = this.loanDataForHelp.LoanApplicationDate;
    var InstallAmt = this.loanDataForHelp.LoanInstallmentAmount;
    var LastInstallAmt = this.loanDataForHelp.LoanLastInstallmentAmount;

    var memName = this.loanDataForHelp.LoanMemberName;
    console.log("This is data", LoanAmount)
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('MemberNo',  memNo.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('Acc Type',  accTypeDesc.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('LoanApplicationAmount',  LoanAmount.toString())
    );
    this.reportModel.Values.push(
      new ReportKeyValue('No of Installment',  NoInstallment.toString())
    );
    this.reportModel.Values.push(
      new ReportKeyValue('Interest Rate',  InterestRate.toString())
    );

      this.reportModel.Values.push(
      new ReportKeyValue('Application Date',  OpenDate.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('Installment Amount',  InstallAmt.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('Last Installment Amount',  LastInstallAmt.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('Member Name',  memName.toString())
    );



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
    // }
  };

  private setIframe = (x: any) => {

    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath,"_blank");
  };
}
