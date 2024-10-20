import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountTransactionTransferService } from 'src/app/services/account-transaction-transfer.service';
import { ApplicationCommonService } from 'src/app/services/application-common.service';
import { EditLoanAccountService } from 'src/app/services/edit-loan-account.service';

@Component({
  selector: 'app-account-transaction-transfer',
  templateUrl: './account-transaction-transfer.component.html',
  styleUrls: ['./account-transaction-transfer.component.css'],
})
export class AccountTransactionTransferComponent implements OnInit {
  accountTransferTrnForm: FormGroup;
  processDate: string;
  fromMemNoName: string;
  toMemNoName: string;
  fromMemType: number;
  toMemType: number;
  fromAccNoList: any[] = [];
  toAccNoList: any[] = [];
  fromTransactionList: any[] = [];
  accTypeName: string;
  fromAccBalance: number;
  fromCtrlAccStatus: number;
  toAccBalance: number = -1;
  toCtrlAccStatus: number = -1;


  constructor(
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private appCommonService: ApplicationCommonService,
    public datepipe: DatePipe,
    private transferService: AccountTransactionTransferService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.accountTransferTrnForm = new FormGroup({
      TransactionDate: new FormControl(''),
      VoucherNo: new FormControl('', [Validators.required]),
      MemberNoFrom: new FormControl('', [Validators.required]),
      AccountTypeFrom: new FormControl(''),
      AccountNoFrom: new FormControl('0'),
      MemberNoTo: new FormControl('', [Validators.required]),
      AccountTypeTo: new FormControl(''),
      AccountNoTo: new FormControl('0'),
    });

    this.appCommonService
      .getApplicationCommonData()
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        this.accountTransferTrnForm.controls['TransactionDate'].setValue(
          x.ProcessDate
        );
        this.processDate = x.ProcessDate;
      });
  }

  // eneter key events
  onEnterVoucherNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemberNoFrom`).focus();
  }
  onEnterMemberNoFromHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AccountTypeFrom`).focus();
  }

  transactionDateChange() {
    if (this.accountTransferTrnForm.value.TransactionDate.toString() == '')
      return;
    this.spinner.show();
    console.log(this.accountTransferTrnForm.value.TransactionDate);
    this.accountTransferTrnForm.value.TransactionDate = this.datepipe.transform(
      this.accountTransferTrnForm.value.TransactionDate,
      'dd/MM/yyyy'
    );
    console.log(this.accountTransferTrnForm.value.TransactionDate);
    this.transferService
      .TranDateChange(this.accountTransferTrnForm.value.TransactionDate)
      .pipe(first())
      .subscribe((x: any) => {
        if (!x.Success) {
          this.accountTransferTrnForm.controls['TransactionDate'].setValue(
            this.processDate
          );
          alert(x.Message);
        }
      });
    this.spinner.hide();
  }

  fromMemNoChange() {
    if (this.accountTransferTrnForm.value.MemberNoFrom == '') return;
    this.spinner.show();
    this.appCommonService
      .getMemberDetails(this.accountTransferTrnForm.value.MemberNoFrom)
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        if (!x.Success) {
          alert(x.Message);
          this.accountTransferTrnForm.controls['MemberNoFrom'].setValue('');
          return;
        }
        this.fromMemNoName = x.MemberName;
        this.fromMemType = x.MemType;
      });
    this.spinner.hide();
  }

  toMemNoChange() {
    if (this.accountTransferTrnForm.value.MemberNoTo == '') return;
    this.spinner.show();
    this.appCommonService
      .getMemberDetails(this.accountTransferTrnForm.value.MemberNoTo)
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        if (!x.Success) {
          alert(x.Message);
          this.accountTransferTrnForm.controls['MemberNoTo'].setValue('');
          return;
        }
        this.toMemNoName = x.MemberName;
        this.toMemType = x.MemType;
        this.accountTransferTrnForm.controls['AccountTypeTo'].setValue(
          this.accountTransferTrnForm.value.AccountTypeFrom
        );
        let dateData = this.accountTransferTrnForm.value.TransactionDate.toString();
        if (dateData.length > 10)
          this.accountTransferTrnForm.value.TransactionDate = this.datepipe.transform(
            this.accountTransferTrnForm.value.TransactionDate,
            'dd/MM/yyyy'
          );
        console.log(this.accountTransferTrnForm.value);
        this.transferService
          .ToMemAccTypeInfo(
            this.accountTransferTrnForm.value.MemberNoTo,
            this.accountTransferTrnForm.value.AccountTypeFrom,
            this.accountTransferTrnForm.value.AccountNoFrom
          )
          .pipe(first())
          .subscribe((x: any) => {
            console.log(x);
            if (!x.Success) {
              alert(x.Message);
              this.accountTransferTrnForm.controls['MemberNoTo'].setValue('');
              return;
            }
            this.toAccNoList = x.ToAccData;
            if (this.toAccNoList.length == 1) {
              this.accountTransferTrnForm.controls['AccountNoTo'].setValue(
                this.toAccNoList[0]
              );
              this.toAccBalance = x.Balance;
              this.toCtrlAccStatus = x.CtrlAccStatus;
            } else {
              this.accountTransferTrnForm.controls['AccountNoTo'].setValue(0);
            }
          });
      });
    this.spinner.hide();
  }

  fromAccTypeChange() {
    if (this.accountTransferTrnForm.value.AccountTypeFrom == '') return;
    if (this.accountTransferTrnForm.value.VoucherNo == '') {
      alert('Please enter the voucher No.');
      return;
    }
    let dateData = this.accountTransferTrnForm.value.TransactionDate.toString();
    if (dateData.length > 10)
      this.accountTransferTrnForm.value.TransactionDate = this.datepipe.transform(
        this.accountTransferTrnForm.value.TransactionDate,
        'dd/MM/yyyy'
      );
    let data = {
      AccType: this.accountTransferTrnForm.value.AccountTypeFrom,
      TransactionDate: this.accountTransferTrnForm.value.TransactionDate,
      VoucherNo: this.accountTransferTrnForm.value.VoucherNo,
      MemType: this.fromMemType,
      MemNo: this.accountTransferTrnForm.value.MemberNoFrom,
      MemberStatus: 1, // this is for a logic check on backend, as it is going through FROM Data so this value is 1.
    };
    this.spinner.show();
    this.transferService
      .FromMemAccTypeInfo(data)
      .pipe(first())
      .subscribe((x: any) => {
        this.spinner.hide();
        console.log(x);
        if (!x.Success) {
          alert(x.Message);
          this.accountTransferTrnForm.controls['AccountTypeFrom'].setValue(
            this.fromAccNoList[0]
          );
          return;
        }
        this.fromAccNoList = x.AccNo;
        this.accTypeName = x.AccTypeDescription;
        if (this.fromAccNoList.length == 1) {
          this.accountTransferTrnForm.controls['AccountNoFrom'].setValue(
            this.fromAccNoList[0]
          );
          this.fromAccBalance = x.Balance;
          this.fromCtrlAccStatus = x.CtrlAccStatus;
          this.fromTransactionList = x.TransctionList;
          console.log(this.fromTransactionList)
        } else {
          this.accountTransferTrnForm.controls['AccountNoFrom'].setValue(0);
        }
      }),(err=>{
        this.spinner.hide();
      });
  }

  fromAccNoChange() {
    if (this.accountTransferTrnForm.value.AccountNoFrom == 0) {
      alert('Please select an account no.');
    } else {
      this.transferService
        .AccountNoChangeFromData(
          this.accountTransferTrnForm.value.AccountNoFrom
        )
        .pipe(first())
        .subscribe((x: any) => {
          this.fromAccBalance = x.Balance;
          this.fromCtrlAccStatus = x.CtrlAccStatus;
          this.fromTransactionList = x.TransactionList;
        });
    }
  }

  toAccNoChange() {
    if (this.accountTransferTrnForm.value.AccountNoFrom == 0) {
      alert('Please select an account no.');
    } else {
      this.transferService
        .AccountNoChangeToData(this.accountTransferTrnForm.value.AccountNoTo)
        .pipe(first())
        .subscribe((x: any) => {
          this.toAccBalance = x.Balance;
          this.toCtrlAccStatus = x.CtrlAccStatus;
        });
    }
  }

  transfer(){
    this.spinner.show();
    if(this.accountTransferTrnForm.invalid){
      alert('Please Fill the Required field')
    }
    var fvalue = this.accountTransferTrnForm.value;
    console.log("coming here==> ", this.accountTransferTrnForm.value.TransactionDate.length)
    if (this.accountTransferTrnForm.value.TransactionDate.toString().length > 10){
      fvalue.TransactionDate = this.datepipe.transform(
        fvalue.TransactionDate,
        'dd/MM/yyyy'
      );
      console.log("coming here==> ", fvalue.TransactionDate)
    }
    let data = {
      FromAccNo: fvalue.AccountNoFrom,
      ToMemType: this.toMemType,
      ToMemNo: fvalue.MemberNoTo,
      ToAccType: fvalue.AccountTypeTo,
      ToAccNo: fvalue.AccountNoTo,
      TransactionDate: fvalue.TransactionDate,
      VoucherNo: fvalue.VoucherNo
    }
    console.log("this is data", data);
    this.transferService
    .Transfer(data)
    .pipe(first())
    .subscribe((x: any) => {
      this.spinner.hide();
      if(x.Success){
        alert(x.Message)
        this.initializeForm();
        location.reload();
      }else{
        alert("Something Went Wrong")
      }
    }),(err=>{
      alert("Something Went Wrong");
      this.spinner.hide();
    });

  }
}
