import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { SuretyReleaseTransactionService } from '../../services/surety-release-transaction.service';

@Component({
  selector: 'app-surety-release-transaction',
  templateUrl: './surety-release-transaction.component.html',
  styleUrls: ['./surety-release-transaction.component.css'],
})
export class SuretyReleaseTransactionComponent implements OnInit {
  CtrlPrmAutoVchFlag: boolean;
  CtrlPrmCSAutoVchCtrl: string;
  CashCode: number;
  suretyReleaseForm: FormGroup;
  suretyMemberName: string;
  loanMemberName: string;
  tempCheck: number = -1;
  GuaranteeAccountInfo: any[] = [];
  LoanGuarantorAccountInfo: any[] = [];
  showUpdate: boolean = false;
  showMessage: string = '';
  showMessageBox: boolean = false;
  AccNo: number;
  CorrAccNo: number;
  DebitTrnAmt: number;
  LoanMemNo: number;
  SuretyMemNo: number;
  loanApplicationNo: number;
  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private router: Router,
    private suretyReleaseService: SuretyReleaseTransactionService,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.suretyMemberName = '';
    this.loanMemberName = '';
    this.tempCheck = -1;
    this.GuaranteeAccountInfo = [];
    this.LoanGuarantorAccountInfo = [];
    this.showUpdate = false;
    this.showMessageBox = false;
    this.initializeForm();
  }

  initializeForm() {
    this.suretyReleaseForm = new FormGroup({
      SuretyMemberNo: new FormControl(''),
      LoanMemberNo: new FormControl(''),
      LoanApplicationNo: new FormControl(''),
      AccountNo: new FormControl(''),
      OutstadingBalance: new FormControl(''),
      SanctionAmount: new FormControl(''),
      NoOfDefaulter: new FormControl(''),
      InterestAmount: new FormControl(''),
      LastPaymentDate: new FormControl(''),
      InterestRate: new FormControl(''),
      PenaltyAmount: new FormControl(''),
      TotalGuaranteeAmount: new FormControl(''),
      PenalInterestRate: new FormControl(''),
      TotalOutstandingAmount: new FormControl(''),
      GuarantorAmount: new FormControl(''),
      CorrespondingAccountNo: new FormControl(''),
      CorrespondingBalance: new FormControl(''),
      DebitTransactionAmount: new FormControl(''),
      InputVoucherNo: new FormControl(''),
      SuretyMemType: new FormControl(''),
      LoanMemType: new FormControl(''),
    });
    this.pageLoad();
  }

  pageLoad() {
    this.suretyReleaseService
      .pageLoadData()
      .pipe(first())
      .subscribe((x: any) => {
        this.CtrlPrmAutoVchFlag = x.CtrlPrmAutoVchFlag;
        this.CtrlPrmCSAutoVchCtrl = x.CtrlPrmCSAutoVchCtrl;
        this.CashCode = x.CashCode;
      });
  }

  loanMemberNoChange() {
    if (this.suretyReleaseForm.value.LoanMemberNo == '') return;
    else {
      this.spinner.show();
      this.suretyReleaseService
        .memberNoChngData(this.suretyReleaseForm.value.LoanMemberNo)
        .pipe(first())
        .subscribe((x: any) => {
          console.log(x);
          if (x.MemberName == null) {
            alert('No such member.');
            this.suretyReleaseForm.controls['LoanMemberNo'].setValue('');
          } else {
            this.loanMemberName = x.MemberName;
            this.suretyReleaseForm.controls['LoanMemType'].setValue(x.MemType);
          }
          this.spinner.hide();
        });
    }
  }

  suretyMemberNoChange() {
    if (this.suretyReleaseForm.value.SuretyMemberNo == '') return;
    else {
      this.spinner.show();
      this.suretyReleaseService
        .memberNoChngData(this.suretyReleaseForm.value.SuretyMemberNo)
        .pipe(first())
        .subscribe((x: any) => {
          console.log(x);
          if (x.MemberName == null) {
            alert('No such member.');
            this.suretyReleaseForm.controls['SuretyMemberNo'].setValue('');
          } else {
            this.suretyMemberName = x.MemberName;
            this.suretyReleaseForm.controls['SuretyMemType'].setValue(
              x.MemType
            );
          }
          this.spinner.hide();
        });
    }
    document.getElementById(`LoanMemberNo`).focus();
  }

  submitBtnClick() {
    console.log('ghereasdas');
    if (this.suretyReleaseForm.value.SuretyMemberNo == '') {
      alert('Please enter surety member no.');
    } else if (this.suretyReleaseForm.value.LoanMemberNo == '') {
      alert('Please enter loan member no.');
    } else {
      this.spinner.show();
      this.suretyReleaseService
        .btnSubmitData(
          this.suretyReleaseForm.value.SuretyMemberNo,
          this.suretyReleaseForm.value.LoanMemberNo
        )
        .pipe(first())
        .subscribe((x: any) => {
          console.log(x);
          this.LoanGuarantorAccountInfo = x.LoanGuarantorAccountInfo;
          this.GuaranteeAccountInfo = x.GuaranteeAccountInfo;
          if (this.GuaranteeAccountInfo.length == 0) {
            this.loanSuretyReleaseDataGet();
          }
          this.spinner.hide();
        });
    }
  }

  btnSelectClick(id: number) {
    let selectedCode = this.GuaranteeAccountInfo.find((x) => x.Id == id);
    let data = {
      Id: id,
      AccType: selectedCode.AccType,
      AccNo: selectedCode.AccNo,
      NStatus: 0,
    };
    if (this.tempCheck == -1) {
      this.tempCheck = id;
      this.spinner.show();
      this.suretyReleaseService
        .updateReleaseStatusGuarantorAccount(data)
        .pipe(first())
        .subscribe((x: any) => {
          this.loanSuretyReleaseDataGet();
        });
    } else {
      data.NStatus = 9;
      this.spinner.show();
      this.suretyReleaseService
        .updateReleaseStatusGuarantorAccount(data)
        .pipe(first())
        .subscribe((x: any) => {
          this.loanSuretyReleaseDataGet();
        });
      this.tempCheck = id;
      this.suretyReleaseService
        .updateReleaseStatusGuarantorAccount(data)
        .pipe(first())
        .subscribe((x: any) => {
          this.loanSuretyReleaseDataGet();
        });
    }
  }

  loanSuretyReleaseDataGet() {
    let data2 = {
      SuretyMemNo: this.suretyReleaseForm.value.SuretyMemberNo,
      LoanMemNo: this.suretyReleaseForm.value.LoanMemberNo,
      NFlag: 1,
    };
    this.suretyReleaseService
      .loanSuretyReleaseDataGet(data2)
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        this.suretyReleaseForm.controls['SuretyMemberNo'].setValue(
          x.SuretyMemNo
        );
        this.suretyReleaseForm.controls['LoanMemberNo'].setValue(x.LoanMemNo);
        this.suretyReleaseForm.controls['LoanApplicationNo'].setValue(
          x.LoanApplicationNo
        );
        this.loanApplicationNo = x.LoanApplicationNo;
        this.suretyReleaseForm.controls['AccountNo'].setValue(x.AccNo);
        this.suretyReleaseForm.controls['OutstadingBalance'].setValue(
          x.OutstandingBalance
        );
        this.suretyReleaseForm.controls['SanctionAmount'].setValue(
          x.DisbursementAmount
        );
        this.suretyReleaseForm.controls['NoOfDefaulter'].setValue(
          x.NoOfDefaulter
        );
        this.suretyReleaseForm.controls['InterestAmount'].setValue(
          x.InterestAmount
        );
        this.suretyReleaseForm.controls['LastPaymentDate'].setValue(
          x.LastPayDate
        );
        this.suretyReleaseForm.controls['InterestRate'].setValue(
          x.InterestRate
        );
        this.suretyReleaseForm.controls['PenaltyAmount'].setValue(
          x.PenaltyAmount
        );
        this.suretyReleaseForm.controls['TotalGuaranteeAmount'].setValue(
          x.TotalGuaranteeAmount
        );
        this.suretyReleaseForm.controls['PenalInterestRate'].setValue(
          x.PenalInterestRate
        );
        this.suretyReleaseForm.controls['TotalOutstandingAmount'].setValue(
          x.TotalOutstandingAmount
        );
        this.suretyReleaseForm.controls['GuarantorAmount'].setValue(
          x.GuarantorsAmount
        );
        this.suretyReleaseForm.controls['CorrespondingAccountNo'].setValue(
          x.SuretyMemAccNo
        );
        this.suretyReleaseForm.controls['CorrespondingBalance'].setValue(
          x.SuretyMemAccBalance
        );
        this.suretyReleaseForm.controls['DebitTransactionAmount'].setValue(
          x.DebitTrnAmount
        );
        this.showMessage = x.ShowMessage;
        this.showUpdate = x.ShowUpdate;
        this.AccNo = x.AccNo;
        this.CorrAccNo = x.SuretyMemAccNo;
        this.DebitTrnAmt = x.DebitTrnAmount;
        this.LoanMemNo = x.LoanMemNo;
        this.SuretyMemNo = x.SuretyMemNo;
        this.suretyReleaseForm.controls['SuretyMemberNo'].disable();
        this.suretyReleaseForm.controls['LoanMemberNo'].disable();
        if (this.showMessage.length > 0) {
          this.showMessageBox = true;
        }
        this.spinner.hide();
      });
  }

  btnUpdateClick() {
    if (this.suretyReleaseForm.value.InputVoucherNo == '') {
      alert('Please enter the Input Voucher No.');
    } else if (this.suretyReleaseForm.value.DebitTransactionAmount == '0') {
      alert('Wrong Transaction Amount.');
    } else {
      let data = {
        CtrlPrmAutoVchFlag: this.CtrlPrmAutoVchFlag,
        CtrlPrmCSAutoVchCtrl: this.CtrlPrmCSAutoVchCtrl,
        CashCode: this.CashCode,
        SuretyMemNo: this.SuretyMemNo,
        LoanMemNo: this.LoanMemNo,
        CorrAccNo: this.CorrAccNo,
        LoanAppNo: this.loanApplicationNo,
        AccNo: this.AccNo,
        VoucherNo: this.suretyReleaseForm.value.InputVoucherNo,
        DebitTrnAmt: this.DebitTrnAmt,
      };
      console.log('data=> ', data);
      this.spinner.show();
      this.suretyReleaseService
        .loanSuretyUpdateData(data)
        .pipe(first())
        .subscribe((x: any) => {
          this.spinner.hide();
          if (x.Success) {
            alert(x.Message);
            this.suretyReleaseForm.controls['SuretyMemberNo'].enable();
            this.suretyReleaseForm.controls['LoanMemberNo'].enable();
            this.ngOnInit();
          } else {
            alert(x.Message);
          }
        });
    }
  }
}
