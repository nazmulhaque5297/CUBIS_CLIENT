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
import { takeUntil, first } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import {
  FixedDepositAccountViewModel,
  FixedDepositCreateModel,
  FixedDepositDataModel,
  FixedDepositInputHelp,
  IFixedDepositAccountDetails,
  IFixedDepositTransactionModel,
} from '../../models/fixed-deposit.model';
import { FixedDepositService } from 'src/app/services/fixed-deposit.service';
import { UserInfo } from 'src/app/Models/Common.model';
import { Store, select } from '@ngrx/store';
import * as UserSelectors from 'src/app/selector/user.selectors';
import { environment } from 'src/environments/environment';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { YeGeneralJournalTransactionService } from 'src/app/services/ye-general-journal-transaction.service';

@Component({
  selector: 'app-new-fixed-deposit',
  templateUrl: './new-fixed-deposit.component.html',
  styleUrls: ['./new-fixed-deposit.component.css'],
})
export class NewFixedDepositComponent implements OnInit, OnDestroy {
  fixedDepositForm: FormGroup;
  UserData: UserInfo;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: FixedDepositInputHelp = new FixedDepositInputHelp();
  public detailsData: FixedDepositDataModel = new FixedDepositDataModel();
  public accountViewModel: FixedDepositAccountViewModel;
  public accountDetailsData: IFixedDepositAccountDetails;
  public DepositedAccountList: FormArray;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  displayIFrame = false;
  PrintFlag: any;
  PrintFOptionFlag: any;
  VoucherNo: any;
  constructor(
    private yeGeneralJournalTrnService: YeGeneralJournalTransactionService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: FixedDepositService,
    private spinner: NgxSpinnerService,
    private store: Store,
    private aService: ReportCommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.accountDetailsData = { Success: true };
    this.reportModel.ReportName = 'CCULB_FixedDepositCSTransactionVch';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.store
      .pipe(select(UserSelectors.getUserInfo))
      .subscribe((userInfo: UserInfo) => {
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
    this.fixedDepositForm = this.fb.group({
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
        console.log('AllData:', data);
        this.inputHelpData = data;
        this.PrintFlag = this.inputHelpData.PrintFlag;
        this.PrintFOptionFlag = this.inputHelpData.PrintFOptFlag;
        this.spinner.hide();
      });
  }

  onMemberChange(): void {
    this.spinner.show();
    var fValue = this.fixedDepositForm.value;
    this.pService
      .GetDetailsByMember(fValue.MemberNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.fixedDepositForm.controls['MemberNo'].setValue('');
          location.reload();
          return;
        }
        this.detailsData = data;
        this.fixedDepositForm.controls['MemType'].setValue(data.MemType);
        document.getElementById(`AccountTypeCode`).focus();
      });
  }

  OnVoucherNoChange(): void {
    this.spinner.show();
    var fValue = this.fixedDepositForm.value as FixedDepositDataModel;
    fValue.AccountDetails = this.accountDetailsData;
    this.pService
      .OnVoucherNoChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.fixedDepositForm.controls['VoucherNo'].setValue('');
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
    this.fixedDepositForm.controls['AccountTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.fixedDepositForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );

    var fValue = this.fixedDepositForm.value;
    console.log('This is fValue while AccType change', fValue);
    this.pService
      .OnAccountTypeChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.fixedDepositForm.controls['AccountTypeId'].setValue(0);
          this.fixedDepositForm.controls['AccountTypeCode'].setValue('');
          return;
        }
        if (!data.HasMultipleAccount) {
          if (!this.UserData?.AutoVchflag) {
            document.getElementById(`VoucherNo`).focus();
          } else {
            document.getElementById(`TransactionTypeCode`).focus();
          }
        }
        this.accountViewModel = data;
        this.accountDetailsData = data.AccountDetails;
        this.fixedDepositForm.controls['AccountNo'].setValue(
          data.AccountDetails.AccountNo
        );
        this.fixedDepositForm.controls['AccProductGLCode'].setValue(
          data.AccProductGLCode
        );
        this.fixedDepositForm.controls['AccTypeClass'].setValue(
          data.AccTypeClass
        );
      });
  }

  onTransTypeChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.TransactionTypeList,
      value
    );
    this.fixedDepositForm.controls['TransactionTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.fixedDepositForm.controls['TransactionTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    var fValue = this.getFormValue();
    if (fValue.TransactionTypeCode == 48) {
      setTimeout(() => document.getElementById(`BankChequeNo`).focus(), 100);
      return;
    } else {
      document.getElementById(`update`).focus();
    }
    fValue.MemRegNo = this.detailsData.MemRegNo;
    fValue.MemSubRegNo = this.detailsData.MemSubRegNo;
    fValue.MemColCode = this.detailsData.MemColCode;
    console.log('This is fvalue when TrnType change>>', fValue);
    this.spinner.show();
    this.pService
      .OnTransTypeChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('---->', data);
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.detailsData.DepositTransactions = data.DepositTransactions;
        this.ReloadRepositList(data.DepositTransactions);
        setTimeout(() => document.getElementById(`TrnAmount${0}`).focus(), 100);
      });
  }

  onAccountNoSelect(value: string): void {
    this.spinner.show();
    this.pService
      .GetAccountDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.accountDetailsData = data;
        this.fixedDepositForm.controls['AccountNo'].setValue(data.AccountNo);
        this.accountViewModel.HasMultipleAccount = false;
        document.getElementById(`VoucherNo`).focus();
      });
  }

  private getFormValue(): FixedDepositCreateModel {
    var fValue = this.fixedDepositForm.value as FixedDepositCreateModel;
    fValue.DepositedAccountList = this.detailsData.DepositTransactions;
    fValue.AccountDetails = this.accountDetailsData;
    return fValue;
  }

  onCheckHandler() {
    document.getElementById(`BankCode`).focus();
  }

  onBankChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.BankList,
      value
    );
    this.fixedDepositForm.controls['BankId'].setValue(
      item != null ? item.Id : 0
    );
    this.fixedDepositForm.controls['BankCode'].setValue(
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
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.detailsData.DepositTransactions = data.DepositTransactions;
        this.ReloadRepositList(data.DepositTransactions);
        document.getElementById(`update`).focus();
      });
  }

  public addItem(x: IFixedDepositTransactionModel): void {
    this.DepositedAccountList = this.fixedDepositForm.get(
      'DepositedAccountList'
    ) as FormArray;
    this.DepositedAccountList.push(this.AddToDepositedAccount(x));
  }

  public ReloadRepositList(data: IFixedDepositTransactionModel[]): void {
    this.DepositedAccountList = this.fixedDepositForm.get(
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
      totalAmount += +x.TrnAmount;
    });
    this.detailsData.TotalAmount = totalAmount;
    this.fixedDepositForm.controls['TotalAmount'].setValue(
      totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
  }

  private AddToDepositedAccount(x: IFixedDepositTransactionModel): FormGroup {
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
    var fValue = this.getFormValue() as FixedDepositCreateModel;
    fValue.AccountDetails = this.accountDetailsData;
    var item = x.value as IFixedDepositTransactionModel;
    fValue.DepositedAccountList[i].Selected = true;
    fValue.DepositedAccountList[i].TrnAmount = item.TrnAmount;
    // newly added
    fValue.DepositedAccountList[i].GLAccNo = item.GLAccNo;
    fValue.DepositedAccountList[i].GLAccDesc = item.GLAccDesc;
    fValue.DepositedAccountList[i].PayTypeDes = item.PayTypeDes;
    fValue.AccProductGLCode = item.GLAccNo;
    // newly added

    fValue.MemRegNo = this.detailsData.MemRegNo;
    fValue.MemSubRegNo = this.detailsData.MemSubRegNo;
    fValue.MemColCode = this.detailsData.MemColCode;
    console.log('This is fvalue when Amount change>>', fValue);
    this.pService
      .onAmountChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        if (r.Success) {
          this.detailsData.DepositTransactions = r.DepositTransactions;
          this.ReloadRepositList(r.DepositTransactions);
          var val = this.DepositedAccountList.length - 1;
          setTimeout(
            () => document.getElementById(`GLAccNoSet${val}`).focus(),
            100
          );
        } else {
          fValue.DepositedAccountList[i].TrnAmount = 0;
          this.ReloadRepositList(fValue.DepositedAccountList);
          alert(r.Message);
        }
      });
  }
  onEnterGlAccNoHandler(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    if (x.value.GLAccNo != '') {
    } else {
      setTimeout(() => document.getElementById('update').focus(), 100);
    }
  }
  onEnterTrnAmountHandler(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    var fValue = this.getFormValue();

    this.spinner.show();
    this.pService
      .AddNewBlankRow(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.detailsData.DepositTransactions = data.DepositTransactions;
        this.ReloadRepositList(data.DepositTransactions);
        var val = this.DepositedAccountList.length - 1;
        setTimeout(
          () => document.getElementById(`GLAccNoSet${val}`).focus(),
          100
        );
      });

    //document.getElementById(`PassportIssuePlace`).focus();
  }

  // GlAccNoChangeHandler(event: any, i: number, item: FormGroup) {
  //   if (!event.target.value) return;
  //   this.yeGeneralJournalTrnService
  //     .generalJournalGLCodeInfo(+event.target.value)
  //     .pipe(first())
  //     .subscribe(
  //       (x: any) => {
  //         if (!x.Success) {
  //           alert('Invalid GL Code');
  //           // this.fixedDepositForm.controls['GLAccNo'].setValue(
  //           //   ''
  //           // );

  //           this.fixedDepositForm.value.DepositedAccountList[i].GLAccNo = '';
  //           this.ReloadRepositList(
  //             this.fixedDepositForm.value.DepositedAccountList
  //           );
  //           return;
  //         } else {
  //           // update blank row with glcode
  //           setTimeout(() => this.UpdateBlankRow(item, i), 1000);
  //         }
  //       },
  //       (err) => {
  //         this.spinner.hide();
  //         alert('Something went wrong.');
  //       }
  //     );
  // }
  GlAccNoChangeHandler(event: any, i: number, item: FormGroup) {
    if (!event.target.value) return;
    var fValue = this.getFormValue();
    var item2 = item.value as IFixedDepositTransactionModel;
    fValue.AccProductGLCode = item2.GLAccNo;
    this.yeGeneralJournalTrnService
      .newFixedDepositGLCodeInfo(fValue)
      .pipe(first())
      .subscribe(
        (x: any) => {
          if (!x.Success) {
            alert('Invalid GL Code');
            // this.fixedDepositForm.controls['GLAccNo'].setValue(
            //   ''
            // );

            this.fixedDepositForm.value.DepositedAccountList[i].GLAccNo = '';
            this.ReloadRepositList(
              this.fixedDepositForm.value.DepositedAccountList
            );
            return;
          } else {
            // update blank row with glcode
            setTimeout(() => this.UpdateBlankRow(item, i), 1000);
          }
        },
        (err) => {
          this.spinner.hide();
          alert('Something went wrong.');
        }
      );
  }
  UpdateBlankRow(x: FormGroup, i: number): void {
    var fValue = this.getFormValue();
    var item = x.value as IFixedDepositTransactionModel;
    fValue.MemRegNo = this.detailsData.MemRegNo;
    fValue.MemSubRegNo = this.detailsData.MemSubRegNo;
    fValue.MemColCode = this.detailsData.MemColCode;
    fValue.AccProductGLCode = item.GLAccNo;
    fValue.DepositedAccountList[i].Selected = true;
    console.log('This is fvalue when GLAccNo change>>', fValue);
    this.spinner.show();
    this.pService
      .OnGLAccNoChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          console.log('---->', data);
          this.spinner.hide();
          if (!data.Success) {
            alert(data.Message);
            return;
          }
          this.detailsData.DepositTransactions = data.DepositTransactions;
          this.ReloadRepositList(data.DepositTransactions);
          var val = this.DepositedAccountList.length - 1;
          setTimeout(
            () => document.getElementById(`TrnAmount${val}`).focus(),
            100
          );
        },
        (err) => {
          this.spinner.hide();
          alert('Something went wrong.');
        }
      );
  }

  onUpdate(): void {
    if (this.fixedDepositForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    if (
      this.fixedDepositForm.get('VoucherNo').value == '' &&
      !this.UserData.AutoVchflag
    ) {
      alert('Please fill Voucher!');
      return;
    }
    this.spinner.show();
    var fValue = this.getFormValue() as FixedDepositCreateModel;
    fValue.AccountDetails = this.accountDetailsData;
    this.pService
      .SubmitDeposit(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log();
        this.spinner.hide();
        this.VoucherNo = data.VoucherNo;
        console.log('Voucherrrrr--->:', this.VoucherNo);
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        alert(data.Message);
        if (this.PrintFlag == 1 && this.PrintFOptionFlag == 1) {
          this.getReportToken();
        } else {
          location.reload();
        }
      });
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
          location.reload();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setParameter(): void {
    var fValue = this.fixedDepositForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName = 'CCULB_FixedDepositCSTransactionVch';

    this.reportModel.Values.push(
      new ReportKeyValue('memberNo', fValue.MemberNo)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('memberName', this.detailsData.MemberName)
    );

    if (fValue.TransactionTypeCode == '1') {
      this.reportModel.Values.push(new ReportKeyValue('tranType', 'Cash'));
    } else if (fValue.TransactionTypeCode == '3') {
      this.reportModel.Values.push(new ReportKeyValue('tranType', 'Transfer'));
    } else if (fValue.TransactionTypeCode == '48') {
      this.reportModel.Values.push(new ReportKeyValue('tranType', 'CASH BANK'));
    }
    if (this.UserData?.AutoVchflag) {
      this.reportModel.Values.push(new ReportKeyValue('VchNo', this.VoucherNo));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('VchNo', fValue.VoucherNo)
      );
    }

    console.log(this.reportModel.Values);
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;
    window.open(iFramePath, '_blank');
  };

  refresh() {
    location.reload();
  }
}
