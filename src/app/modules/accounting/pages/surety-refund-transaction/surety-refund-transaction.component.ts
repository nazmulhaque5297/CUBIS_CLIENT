import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { SuretyReleaseTransactionService } from '../../services/surety-release-transaction.service';

@Component({
  selector: 'app-surety-refund-transaction',
  templateUrl: './surety-refund-transaction.component.html',
  styleUrls: ['./surety-refund-transaction.component.css'],
})
export class SuretyRefundTransactionComponent implements OnInit {
  suretyRefundForm: FormGroup;
  loanMemberName: any;
  suretyMemberName: any;
  showMessage: string;
  CashCode: any;
  CtrlPrmAutoVchFlag: any;
  CtrlPrmCSAutoVchCtrl: any;

  constructor(
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private suretyReleaseService: SuretyReleaseTransactionService,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.showMessage = '';
    this.loanMemberName = '';
    this.suretyMemberName = '';
  }

  initializeForm() {
    this.suretyRefundForm = new FormGroup({
      SuretyMemberNo: new FormControl(''),
      LoanMemberNo: new FormControl(''),
      LoanApplicationNo: new FormControl(''),
      OutstandingBalance: new FormControl(''),
      SuretyReleaseAmount: new FormControl(''),
      CorrespondingAccNo: new FormControl(''),
      InterestAmount: new FormControl(''),
      CorrespondingBalance: new FormControl(''),
      TotalTransactionAmt: new FormControl(''),
      InputVoucherNo: new FormControl(''),
      SuretyMemType: new FormControl(''),
      LoanMemType: new FormControl(''),
    });

    this.suretyReleaseService
      .loanSuretyRefundPageLoad()
      .pipe(first())
      .subscribe((x: any) => {
        this.CashCode = x.CashCode;
        this.CtrlPrmAutoVchFlag = x.CtrlPrmAutoVchFlag;
        this.CtrlPrmCSAutoVchCtrl = x.CtrlPrmCSAutoVchCtrl;
      });
  }

  // enter key events
  onEnterSuretyMemberNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`LoanMemberNo`).focus();
  }
  onEnterLoanMemberNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`InterestAmount`).focus();
  }
  onEnterInterestAmountHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`InputVoucherNo`).focus();
  }

  loanMemberNoChange() {
    if (this.suretyRefundForm.value.LoanMemberNo == '') return;
    else {
      this.spinner.show();
      this.suretyReleaseService
        .memberNoChngData(this.suretyRefundForm.value.LoanMemberNo)
        .pipe(first())
        .subscribe((x: any) => {
          console.log(x);
          if (x.MemberName == null) {
            alert('No such member.');
            this.suretyRefundForm.controls['LoanMemberNo'].setValue('');
          } else {
            this.loanMemberName = x.MemberName;
            this.suretyRefundForm.controls['LoanMemType'].setValue(x.MemType);
          }
          this.spinner.hide();
        });
    }
    document.getElementById(`InterestAmount`).focus();
  }

  suretyMemberNoChange() {
    if (this.suretyRefundForm.value.SuretyMemberNo == '') return;
    else {
      this.spinner.show();
      this.suretyReleaseService
        .memberNoChngData(this.suretyRefundForm.value.SuretyMemberNo)
        .pipe(first())
        .subscribe((x: any) => {
          console.log(x);
          if (x.MemberName == null) {
            alert('No such member.');
            this.suretyRefundForm.controls['SuretyMemberNo'].setValue('');
          } else {
            this.suretyMemberName = x.MemberName;
            this.suretyRefundForm.controls['SuretyMemType'].setValue(x.MemType);
          }
          this.spinner.hide();
        });
    }
    document.getElementById(`LoanMemberNo`).focus();
  }

  submitBtnClick() {
    if (this.suretyRefundForm.value.SuretyMemberNo == '') {
      alert('Enter surety member no.');
    } else if (this.suretyRefundForm.value.LoanMemberNo == '') {
      alert('Enter loan member no.');
    } else {
      this.spinner.show();
      this.suretyReleaseService
        .loanSuretyRefundData(
          this.suretyRefundForm.value.SuretyMemberNo,
          this.suretyRefundForm.value.LoanMemberNo
        )
        .pipe(first())
        .subscribe((x: any) => {
          console.log(x);
          if (x.Success) {
            this.suretyRefundForm.controls['LoanApplicationNo'].setValue(
              x.LoanApplicationNo
            );
            this.suretyRefundForm.controls['OutstandingBalance'].setValue(
              x.OutstandingBalance
            );
            this.suretyRefundForm.controls['SuretyReleaseAmount'].setValue(
              x.SuretyAmount
            );
            this.suretyRefundForm.controls['InterestAmount'].setValue(
              x.CreditIntAmount
            );
            this.suretyRefundForm.controls['CorrespondingAccNo'].setValue(
              x.SuretyMemAccNo
            );
            this.suretyRefundForm.controls['CorrespondingBalance'].setValue(
              x.SuretyMemAccBalance
            );
            this.suretyRefundForm.controls['TotalTransactionAmt'].setValue(
              x.TotalCreditTrnAmount
            );
            this.showMessage = x.ShowMessage;
          }
          this.spinner.hide();
        });
    }
  }

  btnUpdateClick() {
    if (this.suretyRefundForm.value.SuretyMemberNo == '') {
      alert('Enter surety member no.');
    } else if (this.suretyRefundForm.value.LoanMemberNo == '') {
      alert('Enter loan member no.');
    } else if (this.suretyRefundForm.value.InputVoucherNo == '') {
      alert('Please Input the voucher no.');
    } else if (
      this.suretyRefundForm.value.TotalTransactionAmt == '' ||
      this.suretyRefundForm.value.TotalTransactionAmt == '0'
    ) {
      alert('Wrong Transaction Amount.');
    } else {
      let data = {
        CashCode: this.CashCode,
        CtrlPrmAutoVchFlag: this.CtrlPrmAutoVchFlag,
        CtrlPrmCSAutoVchCtrl: this.CtrlPrmCSAutoVchCtrl,
        VoucherNo: this.suretyRefundForm.value.InputVoucherNo,
        SuretyMemNo: this.suretyRefundForm.value.SuretyMemberNo,
        LoanMemNo: this.suretyRefundForm.value.LoanMemberNo,
        CorrAccNo: this.suretyRefundForm.value.CorrespondingAccNo,
        LoanApplicationNo: this.suretyRefundForm.value.LoanApplicationNo,
        SuretyAmount: this.suretyRefundForm.value.SuretyReleaseAmount,
        CreditIntAmount: this.suretyRefundForm.value.InterestAmount,
      };
      this.spinner.show();
      this.suretyReleaseService
        .loanSuretyRefundUpdateData(data)
        .pipe(first())
        .subscribe((x: any) => {
          console.log(x);
          if (x.Success) {
            alert(x.Message);
            this.ngOnInit();
          } else {
            alert(x.Message);
          }
          this.spinner.hide();
        });
    }
  }

  CalculateTotalTransactionAmount() {
    var amt = 0;
    var nSuretyAmount = this.suretyRefundForm.value.SuretyReleaseAmount;
    var nCreditIntAmount = this.suretyRefundForm.value.InterestAmount;

    var nTotalCreditTrnAmount = 0;

    nTotalCreditTrnAmount =
      parseFloat(nSuretyAmount) + parseFloat(nCreditIntAmount);
    this.suretyRefundForm.controls['TotalTransactionAmt'].setValue(
      nTotalCreditTrnAmount
    );
  }
}
