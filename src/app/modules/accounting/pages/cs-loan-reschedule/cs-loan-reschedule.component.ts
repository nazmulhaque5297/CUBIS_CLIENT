import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { CsLoanRescheduleService } from '../../services/cs-loan-reschedule.service';

@Component({
  selector: 'app-cs-loan-reschedule',
  templateUrl: './cs-loan-reschedule.component.html',
  styleUrls: ['./cs-loan-reschedule.component.css'],
})
export class CsLoanRescheduleComponent implements OnInit {
  csLoanReScheduleForm: FormGroup;
  accTypeList: any[] = [];
  loanCalMethodList: any[] = [];
  procDate: string;
  glCashCode: number;
  memType: number;
  memName: string;
  accTypeClass: number;
  depositGuarantorData: any[] = [];
  shareGuarantorData: any[] = [];
  propertyGuarantorData: any[] = [];
  depositMode: number;
  weeklyDay: number;
  NewLoanAccountNo: number;
  NewLoanApplicationNo: number;
  showModal: boolean = false;
  gracePeriod: any;
  firstPayDate: string;
  applicationAmount: number;
  totalRescheduleAmount: number;
  loanCalMethod: number;
  workType: any;
  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private router: Router,
    private csLoanReScheduleService: CsLoanRescheduleService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.pageLoad();
    this.showModal = false;
  }

  pageLoad() {
    this.csLoanReScheduleService
      .pageLoadData()
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        this.accTypeList = x.AccTypeList;
        this.loanCalMethodList = x.LoanCalMethodList;
        this.procDate = x.ProcDate;
        this.glCashCode = x.GLCashCode;
      });
  }

  initializeForm() {
    this.csLoanReScheduleForm = new FormGroup({
      MemberNo: new FormControl(''),
      AccType: new FormControl('0'),
      AccountNo: new FormControl(''),
      LoanAppNo: new FormControl(''),
      LoanCalMethod: new FormControl('0'),
      LoanBalanceAmount: new FormControl(''),
      InstallmentAmount: new FormControl(''),
      DueInterestAmount: new FormControl(''),
      LastInstallmentAmt: new FormControl(''),
      DuePenaltyAmount: new FormControl(''),
      NoOfInstallment: new FormControl(''),
      TotalReScheduleAmount: new FormControl(''),
      InterestRate: new FormControl(''),
      NewNoOfInstallment: new FormControl(''),
      NewInstallmentAmt: new FormControl(''),
      NewInterestRate: new FormControl(''),
      NewLastInstallmentAmt: new FormControl(''),
      ReScheduleDate: new FormControl(''),
      LoanExpireDate: new FormControl(''),
      FirstPayDate: new FormControl(''),
      InputVoucherNo: new FormControl(''),
    });
  }

  // enter key events
  onEnterAccTypeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`InputVoucherNo`).focus();
  }

  memberNoChange() {
    console.log(this.csLoanReScheduleForm.value.MemberNo);
    if (this.csLoanReScheduleForm.value.MemberNo == '') return;
    else if (this.csLoanReScheduleForm.value.MemberNo == '0') {
      this.csLoanReScheduleForm.controls['MemberNo'].setValue('');
      alert('Please Enter a valid Member No.');
    } else {
      this.csLoanReScheduleService
        .MemberNoChangeData(this.csLoanReScheduleForm.value.MemberNo)
        .pipe(first())
        .subscribe((x: any) => {
          if (x.Success) {
            this.memType = x.MemType;
            this.memName = x.MemName;
          } else {
            this.csLoanReScheduleForm.controls['MemberNo'].setValue('');
            this.toaster.error(x.Message);
          }
        });
    }
    document.getElementById(`AccType`).focus();
  }
  accTypeChange() {
    console.log('coming to acc type change');
    if (this.csLoanReScheduleForm.value.MemberNo == '') {
      alert('Please enter Member No.');
    } else {
      if (this.csLoanReScheduleForm.value.AccType == '0') return;
      else {
        let selectedCode = this.accTypeList.find(
          (x) => x.AccTypeCode == this.csLoanReScheduleForm.value.AccType
        );
        if (selectedCode) {
          this.csLoanReScheduleForm.controls['AccType'].setValue(
            this.csLoanReScheduleForm.value.AccType
          );
          let val = {
            AccType: this.csLoanReScheduleForm.value.AccType,
            MemType: this.memType,
            MemNo: this.csLoanReScheduleForm.value.MemberNo,
          };
          this.csLoanReScheduleService
            .LoanReScheduleAccTypeChng(val)
            .pipe(first())
            .subscribe((x: any) => {
              console.log(x);
              if (x.Success) {
                this.csLoanReScheduleForm.controls['AccountNo'].setValue(
                  x.AccNo
                );
                this.csLoanReScheduleForm.controls['LoanAppNo'].setValue(
                  x.AccNoData.AccInfo.LoanAppNo
                );
                this.csLoanReScheduleForm.controls['LoanCalMethod'].setValue(
                  x.AccNoData.AccInfo.LoanCalMethod
                );
                this.csLoanReScheduleForm.controls[
                  'LoanBalanceAmount'
                ].setValue(x.AccNoData.AccInfo.LoanBalance);
                this.csLoanReScheduleForm.controls[
                  'InstallmentAmount'
                ].setValue(x.AccNoData.AccInfo.InstlAmt);
                this.csLoanReScheduleForm.controls[
                  'DueInterestAmount'
                ].setValue(x.AccNoData.DefaulterInfo.DueIntAmt);
                this.csLoanReScheduleForm.controls[
                  'LastInstallmentAmt'
                ].setValue(x.AccNoData.AccInfo.LastInstlAmt);
                this.csLoanReScheduleForm.controls['DuePenaltyAmount'].setValue(
                  x.AccNoData.DefaulterInfo.DuePenalAmt
                );
                this.csLoanReScheduleForm.controls['NoOfInstallment'].setValue(
                  x.AccNoData.AccInfo.NoInstl
                );
                this.csLoanReScheduleForm.controls[
                  'TotalReScheduleAmount'
                ].setValue(x.AccNoData.TotalReScheduleAmt);
                this.csLoanReScheduleForm.controls['InterestRate'].setValue(
                  x.AccNoData.AccInfo.InterestRate
                );
                //this.csLoanReScheduleForm.controls['NewNoOfInstallment'].setValue(x.AccNoData.AccInfo.NewInterestRate);
                this.csLoanReScheduleForm.controls['NewInterestRate'].setValue(
                  x.AccNoData.AccInfo.InterestRate
                );
                this.csLoanReScheduleForm.controls['ReScheduleDate'].setValue(
                  this.procDate
                );
                this.depositGuarantorData = x.AccNoData.DepositGuarantorList;
                this.shareGuarantorData = x.AccNoData.ShareGuarantorList;
                this.propertyGuarantorData = x.AccNoData.PropertyGuarantorList;
                this.depositMode = x.DepositMode;
                this.weeklyDay = x.WeeklyDay;
                this.gracePeriod = x.GracePeriod;
                this.accTypeClass = x.AccTypeClass;
                this.applicationAmount = x.AccNoData.AccInfo.LoanBalance;
                this.totalRescheduleAmount = x.AccNoData.TotalReScheduleAmt;
                this.loanCalMethod = x.AccNoData.AccInfo.LoanCalMethod;
                this.workType = x.DepositModeDesc;
              } else {
                alert(x.Message);
              }
            });
        } else {
          alert('Please enter a valid Account Type.');
        }
      }
    }
    document.getElementById(`InputVoucherNo`).focus();
  }
  dueInterestAmtChange() {
    let data = {
      LoanBalance: this.csLoanReScheduleForm.value.LoanBalanceAmount,
      DueIntAmt: Number(this.csLoanReScheduleForm.value.DueInterestAmount),
      DuePenalAmt: Number(this.csLoanReScheduleForm.value.DuePenaltyAmount),
      TotReScheduleAmt: this.csLoanReScheduleForm.value.TotalReScheduleAmount,
      NoOfInstallment: Number(
        this.csLoanReScheduleForm.value.NewNoOfInstallment
      ),
      AccType: this.csLoanReScheduleForm.value.AccType,
      ProcDate: this.procDate,
      DepositMode: this.depositMode,
      WeeklyDay: this.weeklyDay,
    };
    this.csLoanReScheduleService
      .LoanReScheduleDueIntAmtChng(data)
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        this.csLoanReScheduleForm.controls['TotalReScheduleAmount'].setValue(
          x.TotalReScheduleAmt
        );
        this.totalRescheduleAmount = x.TotalReScheduleAmt;
        if (x.CalculateCheck) {
          this.csLoanReScheduleForm.controls['NewInstallmentAmt'].setValue(
            x.NoOfInstlChng.InstlAmt
          );
          this.csLoanReScheduleForm.controls['NewLastInstallmentAmt'].setValue(
            x.NoOfInstlChng.LastInstlAmt
          );
          this.csLoanReScheduleForm.controls['LoanExpireDate'].setValue(
            x.LoanExpirycal.LoanExpiryDate
          );
          this.csLoanReScheduleForm.controls['FirstPayDate'].setValue(
            x.LoanExpirycal.FirstInstlDate
          );
          this.firstPayDate = x.LoanExpirycal.FirstInstlDate;
        }
      });
  }
  newNoOfInstlChng() {
    let data = {
      TotReScheduleAmt: this.csLoanReScheduleForm.value.TotalReScheduleAmount,
      NoOfInstallment: Number(
        this.csLoanReScheduleForm.value.NewNoOfInstallment
      ),
      AccType: this.csLoanReScheduleForm.value.AccType,
      ProcDate: this.procDate,
      DepositMode: this.depositMode,
      WeeklyDay: this.weeklyDay,
    };
    this.csLoanReScheduleService
      .LoanReScheduleNoInstlChng(data)
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        this.csLoanReScheduleForm.controls['NewInstallmentAmt'].setValue(
          x.InstlAmt
        );
        this.csLoanReScheduleForm.controls['NewLastInstallmentAmt'].setValue(
          x.LastInstlAmt
        );
        this.csLoanReScheduleForm.controls['LoanExpireDate'].setValue(
          x.LoanExpirycal.LoanExpiryDate
        );
        this.csLoanReScheduleForm.controls['FirstPayDate'].setValue(
          x.LoanExpirycal.FirstInstlDate
        );
        this.firstPayDate = x.LoanExpirycal.FirstInstlDate;
      });
  }

  newInstlAmtChange() {
    var num1 = Number(this.csLoanReScheduleForm.value.TotalReScheduleAmount);
    var num2 = Number(this.csLoanReScheduleForm.value.NewNoOfInstallment);
    var num3 = Number(this.csLoanReScheduleForm.value.NewInstallmentAmt);
    var num4 = num3 * (num2 - 1.0);
    var num5 = num1 - num4;
    if (num5 < 0.0) {
      this.csLoanReScheduleForm.controls['NewInstallmentAmt'].setValue('');
      this.csLoanReScheduleForm.controls['NewLastInstallmentAmt'].setValue('');
      this.toaster.error('Invalid Installment Amount');
    } else {
      this.csLoanReScheduleForm.controls['NewInstallmentAmt'].setValue(num3);
      this.csLoanReScheduleForm.controls['NewLastInstallmentAmt'].setValue(
        Math.abs(num5)
      );
    }
  }
  voucherNoChange() {
    if (this.csLoanReScheduleForm.value.InputVoucherNo == '') {
      alert('Please input a valid voucher no.');
      return;
    }
    this.csLoanReScheduleService
      .LoanScheduleTrnVchDeplicate(
        this.csLoanReScheduleForm.value.InputVoucherNo
      )
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        if (!x.Success) {
          alert(x.Message);
          this.csLoanReScheduleForm.controls['InputVoucherNo'].setValue('');
        }
      });
  }
  reScheduleApply() {
    if (this.csLoanReScheduleForm.value.MemberNo == '') {
      alert('Please fillup the member no.');
    } else if (this.csLoanReScheduleForm.value.AccType == '') {
      alert('Please fillup the account type.');
    } else if (this.csLoanReScheduleForm.value.NewNoOfInstallment == '') {
      alert('Please fillup the new number of installment.');
    } else if (this.csLoanReScheduleForm.value.InputVoucherNo == '') {
      alert('Please fillup the voucher number.');
    } else {
      let data = {
        VchNo: this.csLoanReScheduleForm.value.InputVoucherNo,
        GLCashCode: this.glCashCode,
        MemType: this.memType,
        MemNo: this.csLoanReScheduleForm.value.MemberNo,
        AccType: this.csLoanReScheduleForm.value.AccType,
        AccountNo: this.csLoanReScheduleForm.value.AccountNo,
        LoanAppNo: this.csLoanReScheduleForm.value.LoanAppNo,
        DepositMode: this.depositMode,
        WeeklyDay: this.weeklyDay,
        AccTypeClass: this.accTypeClass,
        LoanBalance: this.csLoanReScheduleForm.value.LoanBalanceAmount,
        DueIntAmt: this.csLoanReScheduleForm.value.DueInterestAmount,
        DuePenalAmt: this.csLoanReScheduleForm.value.DuePenaltyAmount,
        TotReScheduleAmt: this.csLoanReScheduleForm.value.TotalReScheduleAmount,
        NewNoInstl: this.csLoanReScheduleForm.value.NewNoOfInstallment,
        NewInstlAmt: this.csLoanReScheduleForm.value.NewInstallmentAmt,
        NewLastInstlAmt: this.csLoanReScheduleForm.value.NewLastInstallmentAmt,
        NewInterestRate: this.csLoanReScheduleForm.value.NewInterestRate,
        ReScheduleDate: this.csLoanReScheduleForm.value.ReScheduleDate,
        LoanExpiryDate: this.csLoanReScheduleForm.value.LoanExpireDate,
        LoanCalMethod: this.csLoanReScheduleForm.value.LoanCalMethod,
      };
      this.spinner.show();
      this.csLoanReScheduleService
        .ReScheduleApply(data)
        .pipe(first())
        .subscribe((x: any) => {
          this.spinner.hide();
          console.log(x);
          if (x.Success) {
            this.NewLoanAccountNo = x.NewLoanAccountNo;
            this.NewLoanApplicationNo = x.NewLoanApplicationNo;
            this.showModal = true;
          } else {
            alert(x.Message);
          }
        });
    }
  }
  exitPage() {
    this.router.navigate(['accounting/']);
  }
  buttonOkClick() {
    //here we need to work for print report
    this.ngOnInit();
  }

  onReturnSchedule() {
    if (this.csLoanReScheduleForm.value.MemberNo == '') {
      alert('Please fillup the member no.');
    } else if (this.csLoanReScheduleForm.value.AccType == '') {
      alert('Please fillup the account type.');
    } else if (this.csLoanReScheduleForm.value.NewNoOfInstallment == '') {
      alert('Please fillup the new number of installment.');
    } else {
      let selectedCode = this.accTypeList.find(
        (x) => x.AccTypeCode == this.csLoanReScheduleForm.value.AccType
      );
      let checkData = {
        LoanApplicationAmount: this.totalRescheduleAmount,
        LoanGracePeriod: this.gracePeriod,
        LoanInstallmentAmount: this.csLoanReScheduleForm.value
          .NewInstallmentAmt,
        LoanInterestRate: this.csLoanReScheduleForm.value.NewInterestRate,
        LoanLastInstallmentAmount: this.csLoanReScheduleForm.value
          .NewLastInstallmentAmt,
        LoanNoInstallment: this.csLoanReScheduleForm.value.NewNoOfInstallment,
        DepositMode: this.depositMode,
        WeeklyDay: 0,
        LoanFirstInstallmentdate: this.firstPayDate,
        LoanSecondInstallmentdate: '',
        LoanMemberNo: this.csLoanReScheduleForm.value.MemberNo,
        LoanMemberName: this.memName,
        ApplicationDate: this.procDate,
        LoanInterestCalMethod: this.loanCalMethod,
      };
      console.log(checkData);
      localStorage.setItem(
        'accountTypeTitle',
        JSON.stringify(selectedCode.AccTypeDescription)
      );
      localStorage.setItem('returnScheduleData', JSON.stringify(checkData));
      const url: string = String(
        this.router.createUrlTree(['accounting/loan-return-schedule'])
      );
      window.open(url, '_blank');
    }
  }
}
