import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import {
  MemberRejectedCode,
  MemberVerifyCode,
} from 'src/app/modules/Models/HoseKeepingModel';
import { ApproveSelectedLoanGetModel } from '../../models/approve-loan-application.model';
import { ApproveLoanApplicationService } from '../../services/approve-loan-application.service';
import { VerifyMemberApplicationService } from '../../services/verify-member-application.service';
import { VerifyNewLoanApplicationService } from '../../services/verify-new-loan-application.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportCommonService } from 'src/app/services/report-common.service';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';

import { environment } from 'src/environments/environment';

import { ReportEnum } from 'src/app/enums/report-enum';

import { IdDescription } from 'src/app/interfaces/id-description';

@Component({
  selector: 'app-approve-loan-application',
  templateUrl: './approve-loan-application.component.html',
  styleUrls: ['./approve-loan-application.component.css'],
})
export class ApproveLoanApplicationComponent implements OnInit {
  memberVerifyForm: FormGroup;
  dataList: MemberVerifyCode[] = [];
  RdataList: MemberRejectedCode[] = [];
  applicationList = [];
  displayVerifyData: boolean = false;
  displayRejectData: boolean = false;
  ApplicationNoVerify: any;
  ApplicationNoReject: any;

  BranchCodeDropDown: any[] = [];
  BranchNoVisible: boolean = false;
  CashCode: number;
  IDName: string;
  ProcDate: string;
  RejectCodeDropDown: any[] = [];
  UnitNoVisible: boolean = false;
  UserLevel: number;
  UserPermission: number;
  VerifyCodeDropDown: any[] = [];
  VerifyDataList: any[] = [];
  UserLoanAccountData: any[] = [];
  SelectedLoanData: ApproveSelectedLoanGetModel = new ApproveSelectedLoanGetModel();

  private destroy$: Subject<void> = new Subject<void>();

  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  constructor(
    private verifyMemberApplicationService: VerifyMemberApplicationService,
    private verifyLoanApplicationService: VerifyNewLoanApplicationService,
    private approveLoanApplicationService: ApproveLoanApplicationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private aService: ReportCommonService,
    private sanitizer: DomSanitizer
  ) {
    this.reportModel.ReportName = 'ApproveLoanApplication';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.getLoanApplicationData();
    this.initializeForm();
    this.displayRejectData = false;
    this.displayVerifyData = false;
  }
  private initializeForm() {
    this.memberVerifyForm = new FormGroup({
      selectedVerifyCode: new FormControl('0'),
      selectedRejectCode: new FormControl('0'),
      stepOfLoan: new FormControl(''),
      previousPerformence: new FormControl(''),
      totalDeposit: new FormControl(''),
      verifyAmount: new FormControl(''),
      noOfInstallment: new FormControl(''),
      installmentAmount: new FormControl(''),
      lastInstallmentAmount: new FormControl(''),
      description: new FormControl(''),
      applicationNo: new FormControl(''),
      accountType: new FormControl(''),
      firstInstallmentDate: new FormControl(''),
      secondInstallmentDate: new FormControl(''),
      memberType: new FormControl(''),
      memberNo: new FormControl(''),
    });
  }

  firstInstallmentDateChange() {
    var fv = this.memberVerifyForm.value;
    var value = this.datepipe.transform(fv.FirstInstallmentDate, 'dd-MM-yyyy');
    fv.FirstInstallmentDate = this.approveLoanApplicationService.convertDateToString(
      value
    );
    document.getElementById(`selectedVerifyCode`).focus();
  }

  firstInstallmentDateChangekeydown(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`selectedVerifyCode`).focus();
  }
  ApproveNoteChange() {
    document.getElementById(`description`).focus();
  }

  // Get Member Application information

  getLoanApplicationData = () => {
    this.spinner.show();
    this.approveLoanApplicationService
      .getLoanApplicationInfo()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log(x);
          this.BranchCodeDropDown = x.BranchCodeDropDown;
          this.BranchNoVisible = x.BranchNoVisible;
          this.CashCode = x.CashCode;
          this.IDName = x.IDName;
          this.ProcDate = x.ProcDate;
          this.RejectCodeDropDown = x.RejectCodeDropDown;
          this.UnitNoVisible = x.UnitNoVisible;
          this.UserLevel = x.UserLevel;
          this.UserPermission = x.UserPermission;
          this.VerifyCodeDropDown = x.VerifyCodeDropDown;
          this.VerifyDataList = x.VerifyDataList;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Show Verify Application Screen
  displayVerifyOption(event: any) {
    console.log(event);
    this.initializeForm();
    this.spinner.show();
    this.approveLoanApplicationService
      .getSelectDataInfo(event)
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        this.SelectedLoanData = x;
        this.memberVerifyForm.controls['stepOfLoan'].setValue(x.StepOfLoan);
        this.memberVerifyForm.controls['previousPerformence'].setValue(
          x.PreviousPerformence
        );
        this.memberVerifyForm.controls['totalDeposit'].setValue(x.TotalDeposit);
        this.memberVerifyForm.controls['verifyAmount'].setValue(x.SacnAmount);
        this.memberVerifyForm.controls['noOfInstallment'].setValue(
          x.NoOfInstallment
        );
        this.memberVerifyForm.controls['installmentAmount'].setValue(
          x.InstallmentAmount
        );
        this.memberVerifyForm.controls['lastInstallmentAmount'].setValue(
          x.LastInstallmentAmount
        );
        this.memberVerifyForm.controls['applicationNo'].setValue(
          event.LoanApplicationNo
        );
        this.memberVerifyForm.controls['accountType'].setValue(event.AccType);
        this.memberVerifyForm.controls['firstInstallmentDate'].setValue(
          x.FirstInstallmentDate
        );
        this.memberVerifyForm.controls['secondInstallmentDate'].setValue(
          x.SecondInstallmentDate
        );
        this.memberVerifyForm.controls['memberType'].setValue(event.MemType);
        this.memberVerifyForm.controls['memberNo'].setValue(event.MemNo);
        this.spinner.hide();
        this.UserLoanAccountData = x.UserLoanAccountData;
      });
    this.displayVerifyData = true;
    this.displayRejectData = false;
  }

  // Close Verify Application Screen
  closeVerifyOption() {
    this.displayVerifyData = false;
  }
  // Member Verify data pass
  verifyInfo() {
    if (this.memberVerifyForm.value.selectedVerifyCode == 0) {
      alert('Please select Approve type.!');
    } else {
      let data = {
        ApplicationNo: this.memberVerifyForm.value.applicationNo,
        SancAmount: this.memberVerifyForm.value.verifyAmount,
        NoteNo: this.memberVerifyForm.value.selectedVerifyCode,
        NoteDesc: this.memberVerifyForm.value.description,
        NoOfInstallment: this.memberVerifyForm.value.noOfInstallment,
        InstallmentAmount: this.memberVerifyForm.value.installmentAmount,
        LastInstallmentAmount: this.memberVerifyForm.value
          .lastInstallmentAmount,
        AtyClass: this.SelectedLoanData.AtyClass,
        StepNoLoan: this.memberVerifyForm.value.stepOfLoan,
        PrevLoanRecord: this.SelectedLoanData.PreviousPerformence,
        FirstInstlDate: this.SelectedLoanData.FirstInstallmentDate,
        SecondInstlDate: this.SelectedLoanData.SecondInstallmentDate,
        AccountType: this.memberVerifyForm.value.accountType,
        MemberType: this.memberVerifyForm.value.memberType,
        MemberNo: this.memberVerifyForm.value.memberNo,
        TotalDeposit: this.memberVerifyForm.value.totalDeposit,
        ProcDate: this.ProcDate,
      };
      this.spinner.show();
      this.approveLoanApplicationService
        .ApproveLoanApplication(data)
        .pipe(first())
        .subscribe((x: any) => {
          if (x == -1) {
            alert("Application didn't verified..!");
          } else {
            alert('Application approved successfully..! New AccNo:' + x);
            this.displayVerifyData = false;
            this.ngOnInit();
          }
          this.spinner.hide();
        });
    }
  }

  // Member Verify API Calling
  verifyMemberApplication(data) {
    this.spinner.show();
    this.verifyMemberApplicationService
      .verifyMember(data)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.initializeForm();
          this.spinner.hide();
          alert('Verifiyed Application No ' + this.ApplicationNoVerify);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  // Show Reject Application Screen
  displayRejectOption(event: any) {
    this.initializeForm();
    this.displayRejectData = true;
    this.displayVerifyData = false;
    this.memberVerifyForm.controls['applicationNo'].setValue(
      event.LoanApplicationNo
    );
  }
  // Close Reject Application Screen
  closeRejectOption() {
    this.displayRejectData = false;
  }

  // Member Reject data pass
  rejectInfo() {
    if (this.memberVerifyForm.value.selectedRejectCode == 0) {
      alert('Please select reject type.!');
    } else {
      let data = {
        NoteNo: this.memberVerifyForm.value.selectedRejectCode,
        NoteDesc: this.memberVerifyForm.value.description,
        ApplicationNo: this.memberVerifyForm.value.applicationNo,
      };
      this.spinner.show();
      this.verifyLoanApplicationService
        .RejectLoanApplication(data)
        .pipe(first())
        .subscribe((x: any) => {
          if (x == 0) {
            alert("Application didn't rejected..!");
          } else {
            alert('Application rejected successfully..!');
            this.ngOnInit();
          }
          this.spinner.hide();
        });
    }
  }

  verifyAmountChange() {
    if (this.memberVerifyForm.value.verifyAmount == '') {
      alert('Please enter a valid verify Amount.');
      this.memberVerifyForm.controls['verifyAmount'].setValue(
        this.SelectedLoanData.SacnAmount
      );
    } else if (
      this.memberVerifyForm.value.verifyAmount >
      this.SelectedLoanData.SacnAmount
    ) {
      alert('Invalid Sanction Amount.');
      this.memberVerifyForm.controls['verifyAmount'].setValue(
        this.SelectedLoanData.SacnAmount
      );
    } else {
      let data = {
        SancAmount: this.memberVerifyForm.value.verifyAmount,
        AccountType: this.memberVerifyForm.value.accountType,
        NoOfInstallment: this.memberVerifyForm.value.noOfInstallment,
      };
      this.spinner.show();
      this.verifyLoanApplicationService
        .SancAmountChangeData(data)
        .pipe(first())
        .subscribe((x: any) => {
          this.memberVerifyForm.controls['installmentAmount'].setValue(
            x.InstallmentAmount
          );
          this.memberVerifyForm.controls['lastInstallmentAmount'].setValue(
            x.LastInstallmentAmount
          );
          this.spinner.hide();
        });
    }
    document.getElementById(`noOfInstallment`).focus();
  }
  verifyAmountChangekeydown(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`noOfInstallment`).focus();
  }

  noOfInstallmentChange() {
    if (this.memberVerifyForm.value.noOfInstallment == '') {
      alert('Please enter a valid No of Installment.');
      this.memberVerifyForm.controls['verifyAmount'].setValue(
        this.SelectedLoanData.SacnAmount
      );
    } else {
      let data = {
        SancAmount: this.memberVerifyForm.value.verifyAmount,
        AccountType: this.memberVerifyForm.value.accountType,
        NoOfInstallment: this.memberVerifyForm.value.noOfInstallment,
      };
      this.spinner.show();
      this.verifyLoanApplicationService
        .SancAmountChangeData(data)
        .pipe(first())
        .subscribe((x: any) => {
          this.memberVerifyForm.controls['installmentAmount'].setValue(
            x.InstallmentAmount
          );
          this.memberVerifyForm.controls['lastInstallmentAmount'].setValue(
            x.LastInstallmentAmount
          );
          this.spinner.hide();
        });
    }
    document.getElementById(`installmentAmount`).focus();
  }

  noOfInstallmentChangekeydown(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`installmentAmount`).focus();
  }

  installmentAmountChange() {
    var check =
      Number(this.memberVerifyForm.value.verifyAmount) -
      Number(this.memberVerifyForm.value.installmentAmount) *
        (Number(this.memberVerifyForm.value.noOfInstallment) - 1);
    if (check < 0) {
      alert('Invalid Installment Amount.!');
      this.memberVerifyForm.controls['installmentAmount'].setValue(
        this.SelectedLoanData.InstallmentAmount
      );
    } else {
      this.memberVerifyForm.controls['lastInstallmentAmount'].setValue(check);
    }
    document.getElementById(`dateFormat`).focus();
  }
  installmentAmountChangekeydown(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`dateFormat`).focus();
  }

  private setParameter(event: any): void {
    this.reportModel.ReportName = 'rptLoanApplicationReport';

    //var fValue = this.LoanReturnScheduleForm.value;
    this.reportModel.Values = [];
    this.reportModel.Values.push(
      new ReportKeyValue('LoanApplicationDate', event.LoanApplicationDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('LoanApplicationNo', event.LoanApplicationNo)
    );
    this.reportModel.Values.push(new ReportKeyValue('AccType', event.AccType));
    this.reportModel.Values.push(
      new ReportKeyValue('AccTypeDescription', event.AccTypeDescription)
    );
    this.reportModel.Values.push(new ReportKeyValue('InputBy', event.InputBy));
    this.reportModel.Values.push(
      new ReportKeyValue('LoanApplicationAmt', event.LoanApplicationAmt)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('LoanIntRate', event.LoanIntRate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('LoanTotGuarantorAmt', event.LoanTotGuarantorAmt)
    );
    this.reportModel.Values.push(new ReportKeyValue('MemNo', event.MemNo));
    this.reportModel.Values.push(new ReportKeyValue('MemType', event.MemType));
  }

  public getReportToken = (event: any) => {
    console.log(event);
    // let mNo = this.PrevTransTransferListForm.controls['MemNo'].value;
    // console.log(mNo);
    // if (mNo === '') {
    //   this.toastr.error('Please Input Member!', 'Error');
    // } else {
    this.spinner.show();
    this.setParameter(event);
    //this.spinner.show();
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

    window.open(iFramePath, '_blank');
  };
}
