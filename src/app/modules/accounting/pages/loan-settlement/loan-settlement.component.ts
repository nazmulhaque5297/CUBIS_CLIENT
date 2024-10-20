import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import {
  LoanSettlementAccountViewModel,
  LoanSettlementCreateModel,
  LoanSettlementDataModel,
  LoanSettlementInputHelp,
  ILoanSettlementAccountDetails,
  ILoanSettlementTransactionModel,
} from '../../models/loan-settlement.model';
import { LoanSettlementService } from 'src/app/services/loan-settlement.service';
import { UserInfo } from 'src/app/Models/Common.model';
import { Store, select } from '@ngrx/store';
import { getUserInfo } from 'src/app/selector/user.selectors';
import { environment } from 'src/environments/environment';
import { TransferDepositAccountViewModel } from '../../models/transfer-deposit.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';

@Component({
  selector: 'app-loan-settlement',
  templateUrl: './loan-settlement.component.html',
  styleUrls: ['./loan-settlement.component.css'],
})
export class LoanSettlementComponent implements OnInit, OnDestroy {
  loanSettlementForm: FormGroup;
  UserData: UserInfo;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: LoanSettlementInputHelp = new LoanSettlementInputHelp();
  public detailsData: LoanSettlementDataModel = new LoanSettlementDataModel();
  public accountViewModel: LoanSettlementAccountViewModel;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public accountDetailsData: ILoanSettlementAccountDetails;
  public DepositedAccountList: FormArray;
  displayIFrame = false;
  VoucherNo: any;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: LoanSettlementService,
    private spinner: NgxSpinnerService,
    private store: Store,
    private aService: ReportCommonService
  ) {
    this.accountDetailsData = { Success: true };
    this.reportModel.ReportName = 'CCULB_rptCSTransactionVchLoanSettlement';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.store.pipe(select(getUserInfo)).subscribe((userInfo: UserInfo) => {
      this.UserData = userInfo;
    });
    this.initializeForm();
    this.getInputHelp();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.loanSettlementForm = this.fb.group({
      AccountTypeCode: new FormControl('', [Validators.required]),
      AccountTypeId: new FormControl('0'),
      AccountNo: new FormControl(''),
      MemberNo: new FormControl('', [Validators.required]),
      VoucherNo: new FormControl(''),
      BankChequeNo: new FormControl(),
      BankCode: new FormControl(''),
      BankId: new FormControl('0'),
      TransactionTypeCode: new FormControl(''),
      TransactionTypeId: new FormControl('0'),
      TotalAmount: new FormControl(0),
      MemType: new FormControl('0'),
      AccTypeClass: new FormControl('0'),
      AccProductGLCode: new FormControl('0'),
      DepositedAccountList: this.fb.array([]),
    });
  }

  private getInputHelp(): void {
    this.spinner.show();
    this.pService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        this.spinner.hide();
      });
  }

  onMemberChange(): void {
    this.spinner.show();
    var fValue = this.loanSettlementForm.value;
    this.pService
      .GetDetailsByMember(fValue.MemberNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.loanSettlementForm.controls['MemberNo'].setValue('');
          return;
        }
        this.detailsData = data;
        this.loanSettlementForm.controls['MemType'].setValue(data.MemType);
        document.getElementById(`AccountTypeCode`).focus();
      });
  }

  OnVoucherNoChange(): void {
    if (
      this.loanSettlementForm.get('VoucherNo').value == '' &&
      !this.UserData.AutoVchflag
    ) {
      alert('Please fill Voucher!');
      return;
    }
    this.spinner.show();
    var fValue = this.loanSettlementForm.value as LoanSettlementDataModel;
    fValue.AccountDetails = this.accountDetailsData;
    this.pService
      .OnVoucherNoChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        document.getElementById(`TransactionTypeCode`).focus();
      });
  }

  onAccountTypeChange(value: number): void {
    this.spinner.show();
    var item = new SelectListFilter().getItem(
      this.inputHelpData.AccountTypeList,
      value
    );
    this.loanSettlementForm.controls['AccountTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.loanSettlementForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );

    var fValue = this.loanSettlementForm.value;
    this.pService
      .OnAccountTypeChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.loanSettlementForm.controls['AccountTypeId'].setValue(0);
          this.loanSettlementForm.controls['AccountTypeCode'].setValue('');
          return;
        }
        this.accountViewModel = data;
        this.accountDetailsData = data.AccountDetails;
        this.loanSettlementForm.controls['AccountNo'].setValue(
          data.AccountDetails.AccountNo
        );
        this.loanSettlementForm.controls['AccProductGLCode'].setValue(
          data.AccProductGLCode
        );
        this.loanSettlementForm.controls['AccTypeClass'].setValue(
          data.AccTypeClass
        );
        if (!data.HasMultipleAccount) {
          if (!this.UserData?.AutoVchflag) {
            document.getElementById(`VoucherNo`).focus();
          } else {
            document.getElementById(`TransactionTypeCode`).focus();
          }
        }
      });
  }

  onTransTypeChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.TransactionTypeList,
      value
    );
    this.loanSettlementForm.controls['TransactionTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.loanSettlementForm.controls['TransactionTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    var fValue = this.getFormValue();
    fValue.MemRegNo = this.detailsData.MemRegNo;
    fValue.MemSubRegNo = this.detailsData.MemSubRegNo;
    fValue.MemColCode = this.detailsData.MemColCode;
    this.spinner.show();
    this.pService
      .OnTransTypeChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.spinner.hide();
          if (!data.Success) {
            alert(data.Message);
            this.loanSettlementForm.controls['TransactionTypeId'].setValue(0);
            this.loanSettlementForm.controls['TransactionTypeCode'].setValue(
              ''
            );
            return;
          }
          this.accountDetailsData.CalInterestAmt =
            data.DepositTransactions[1].TrnAmount.toString();
          this.detailsData.DepositTransactions = data.DepositTransactions;
          this.ReloadRepositList(data.DepositTransactions);
          setTimeout(
            () => document.getElementById(`TrnAmount${1}`).focus(),
            100
          );
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  onAccountNoSelect(value: string): void {
    this.spinner.show();
    this.pService
      .GetAccountDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.accountDetailsData = data;
        this.loanSettlementForm.controls['AccountNo'].setValue(data.AccountNo);
        this.accountViewModel.HasMultipleAccount = false;
        document.getElementById(`VoucherNo`).focus();
      });
  }

  private getFormValue(): LoanSettlementCreateModel {
    var fValue = this.loanSettlementForm.value as LoanSettlementCreateModel;
    fValue.DepositedAccountList = this.detailsData.DepositTransactions;
    fValue.AccountDetails = this.accountDetailsData;
    return fValue;
  }

  public addItem(x: ILoanSettlementTransactionModel): void {
    this.DepositedAccountList = this.loanSettlementForm.get(
      'DepositedAccountList'
    ) as FormArray;
    this.DepositedAccountList.push(this.AddToDepositedAccount(x));
  }

  public ReloadRepositList(data: ILoanSettlementTransactionModel[]): void {
    this.DepositedAccountList = this.loanSettlementForm.get(
      'DepositedAccountList'
    ) as FormArray;
    while (this.DepositedAccountList.length !== 0) {
      this.DepositedAccountList.removeAt(0);
    }
    data.forEach((x) => {
      this.addItem(x);
    });
    this.CalculateAmount();
  }

  private CalculateAmount(): void {
    let totalAmount = 0;
    this.detailsData.DepositTransactions.forEach((x) => {
      totalAmount += x.TrnAmount;
    });
    this.detailsData.TotalAmount = totalAmount;
    this.loanSettlementForm.controls['TotalAmount'].setValue(
      totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
  }

  private AddToDepositedAccount(x: ILoanSettlementTransactionModel): FormGroup {
    return this.fb.group({
      GLAccNo: [x.GLAccNo],
      GLAccDesc: [x.GLAccDesc],
      PayTypeDes: [x.PayTypeDes],
      TrnAmount: [
        x.TrnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      ],
    });
  }

  onAmountChange(i: number, x: FormGroup): void {
    console.log('this is I', i);
    var fValue = this.getFormValue() as LoanSettlementCreateModel;
    fValue.AccountDetails = this.accountDetailsData;
    var item = x.value as ILoanSettlementTransactionModel;
    fValue.DepositedAccountList[i].Selected = true;
    fValue.DepositedAccountList[i].TrnAmount = item.TrnAmount;
    fValue.MemRegNo = this.detailsData.MemRegNo;
    fValue.MemSubRegNo = this.detailsData.MemSubRegNo;
    fValue.MemColCode = this.detailsData.MemColCode;
    console.log('====', fValue);
    this.pService
      .onAmountChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        if (r.Success) {
          this.detailsData.DepositTransactions = r.DepositTransactions;
          this.ReloadRepositList(r.DepositTransactions);
          setTimeout(
            () => document.getElementById(`TrnAmount${i}`).focus(),
            100
          );
        } else {
          fValue.DepositedAccountList[i].TrnAmount = 0;
          this.ReloadRepositList(fValue.DepositedAccountList);
          alert(r.Message);
        }
      });
  }

  onAmountEnterHandler(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    console.log('this is I', i);
    var fValue = this.getFormValue() as LoanSettlementCreateModel;
    fValue.AccountDetails = this.accountDetailsData;
    var item = x.value as ILoanSettlementTransactionModel;
    fValue.DepositedAccountList[i].Selected = true;
    fValue.DepositedAccountList[i].TrnAmount = item.TrnAmount;
    fValue.MemRegNo = this.detailsData.MemRegNo;
    fValue.MemSubRegNo = this.detailsData.MemSubRegNo;
    fValue.MemColCode = this.detailsData.MemColCode;
    console.log('====', fValue);
    this.pService
      .onAmountChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        if (r.Success) {
          this.detailsData.DepositTransactions = r.DepositTransactions;
          this.ReloadRepositList(r.DepositTransactions);
          if (this.detailsData.DepositTransactions.length - 1 != i) {
            setTimeout(
              () => document.getElementById(`TrnAmount${i + 1}`).focus(),
              10
            );
          } else {
            document.getElementById(`update`).focus();
          }
        } else {
          fValue.DepositedAccountList[i].TrnAmount = 0;
          this.ReloadRepositList(fValue.DepositedAccountList);
          alert(r.Message);
        }
      });
  }
  onUpdate(): void {
    if (this.loanSettlementForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    if (
      this.loanSettlementForm.get('VoucherNo').value == '' &&
      !this.UserData.AutoVchflag
    ) {
      alert('Please fill Voucher!');
      return;
    }
    this.spinner.show();
    var fValue = this.getFormValue() as LoanSettlementCreateModel;
    fValue.AccountDetails = this.accountDetailsData;
    this.pService
      .SubmitDeposit(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.VoucherNo = data.VoucherNo;
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        alert(data.Message);
        if (
          this.inputHelpData.PrintFlag == 1 &&
          this.inputHelpData.PrintFOptFlag == 1
        ) {
          this.getReportToken();
        } else {
          location.reload();
        }
      });
  }

  public getReportToken = () => {
    if (this.loanSettlementForm.controls['MemberNo'].value == '') {
      alert('Please Input Member Number!');
      return;
    }
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
          location.reload();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setParameter(): void {
    var fValue = this.loanSettlementForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName = 'CCULB_rptCSTransactionVchLoanSettlement';
    console.log('PushedVaalue:', fValue.MemberNo);
    this.reportModel.Values.push(
      new ReportKeyValue('MemberNo', fValue.MemberNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('MemberName', this.detailsData.MemberName)
    );
    if (this.UserData?.AutoVchflag) {
      this.reportModel.Values.push(new ReportKeyValue('VchNo', this.VoucherNo));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('VchNo', fValue.VoucherNo)
      );
    }

    this.reportModel.Values.push(
      new ReportKeyValue('TransactionTypeCode', fValue.TransactionTypeCode)
    );
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;
    window.open(iFramePath, '_blank');
  };

  refresh() {
    location.reload();
  }
}
