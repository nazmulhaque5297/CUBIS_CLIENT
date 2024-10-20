import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { UserInfo } from 'src/app/Models/Common.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { getUserInfo } from 'src/app/selector/user.selectors';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { TransferDepositService } from 'src/app/services/transfer-deposit.service';
import { environment } from 'src/environments/environment';
import {
  ITransferDepositAccountDetails,
  ITransferDepositTransactionModel,
  TransferDepositAccountViewModel,
  TransferDepositCreateModel,
  TransferDepositInputHelp,
  TransferDepositViewModel,
} from '../../../models/transfer-deposit.model';

@Component({
  selector: 'app-transfer-deposit',
  templateUrl: './transfer-deposit.component.html',
  styleUrls: ['./transfer-deposit.component.css'],
})
export class TransferDepositComponent implements OnInit, OnDestroy {
  cashDepositForm: FormGroup;
  UserData: UserInfo;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: TransferDepositInputHelp = new TransferDepositInputHelp();
  public detailsData: TransferDepositViewModel = new TransferDepositViewModel();
  public accountViewModel: TransferDepositAccountViewModel;
  public accountDetailsData: ITransferDepositAccountDetails;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public DepositedAccountList: FormArray;
  atyclass1: boolean = false;
  atyclass2: boolean = false;
  atyclass3: boolean = false;
  atyclass4: boolean = false;
  PrintFOptFlag: any;
  PrintFlag: any;
  displayIFrame = false;
  VoucherNo: any;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: TransferDepositService,
    private spinner: NgxSpinnerService,
    private store: Store,
    private aService: ReportCommonService
  ) {
    this.accountDetailsData = { Success: true };
    this.reportModel.ReportName = 'CCULB_rptCSTransactionVchTransferDepoTrans';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.store.pipe(select(getUserInfo)).subscribe((userInfo: UserInfo) => {
      this.UserData = userInfo;
    });
    this.initializeForm();
    this.getInputHelp();
    document.getElementById('memberno').focus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.cashDepositForm = this.fb.group({
      AccountTypeCode: new FormControl('', [Validators.required]),
      AccountTypeId: new FormControl('0'),
      AccountNo: new FormControl(''),
      MemberNo: new FormControl('', [Validators.required]),
      VoucherNo: new FormControl(''),
      TotalAmount: new FormControl(0),
      MemType: new FormControl('0'),
      AccProductGLCode: new FormControl('0'),
      AccTypeClass: new FormControl('0'),
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
        data.DepositTransactions.forEach((x) => {
          this.addItem(x);
        });
        this.spinner.hide();
      });
  }

  onMemberChange(): void {
    this.spinner.show();
    var fValue = this.cashDepositForm.value;
    this.pService
      .GetDetailsByMember(fValue.MemberNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.spinner.hide();
          if (!data.Success) {
            alert(data.Message);
            this.cashDepositForm.controls['MemberNo'].setValue('');
            location.reload();
            return;
          }
          this.detailsData = data;
          this.cashDepositForm.controls['MemType'].setValue(data.MemType);
          document.getElementById(`AccountTypeCode`).focus();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  onAccountTypeChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.AccountTypeList,
      value
    );
    this.cashDepositForm.controls['AccountTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.cashDepositForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );

    var fValue = this.cashDepositForm.value;
    this.spinner.show();
    this.pService
      .OnAccountTypeChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.cashDepositForm.controls['AccountTypeId'].setValue(0);
          this.cashDepositForm.controls['AccountTypeCode'].setValue('');
          return;
        }
        this.accountViewModel = data;

        this.accountDetailsData = data.AccountDetails;
        if (this.accountDetailsData.AccAtyClass == 1) {
          this.atyclass1 = true;
          this.atyclass2 = false;
          this.atyclass3 = false;
          this.atyclass4 = false;
          console.log(this.atyclass1);
        } else if (this.accountDetailsData.AccAtyClass == 2) {
          this.atyclass1 = true;
          this.atyclass2 = true;
          this.atyclass3 = false;
          this.atyclass4 = false;
        } else if (this.accountDetailsData.AccAtyClass == 6) {
          this.atyclass1 = true;
          this.atyclass3 = true;
          this.atyclass4 = false;
          this.atyclass2 = false;
        } else if (this.accountDetailsData.AccAtyClass == 7) {
          this.atyclass1 = true;
          this.atyclass4 = true;
          this.atyclass2 = false;
          this.atyclass3 = false;
        }
        this.cashDepositForm.controls['AccountNo'].setValue(
          data.AccountDetails.AccountNo
        );
        this.cashDepositForm.controls['AccProductGLCode'].setValue(
          data.AccProductGLCode
        );
        this.cashDepositForm.controls['AccTypeClass'].setValue(
          data.AccTypeClass
        );
        if (!this.UserData?.AutoVchflag) {
          document.getElementById(`VoucherNo`).focus();
        } else {
          this.OnVoucherNoChange();
        }
      });
  }

  // newly added
  onAccountNoSelect(value: string): void {
    // var fValue = this.getFormValue();
    var fValue = this.cashDepositForm.value;
    fValue.AccountNo = value;
    this.spinner.show();
    this.pService
      .GetAccountDetails(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.accountViewModel = data;

        this.accountDetailsData = data.AccountDetails;
        if (this.accountDetailsData.AccAtyClass == 1) {
          this.atyclass1 = true;
          this.atyclass2 = false;
          this.atyclass3 = false;
          this.atyclass4 = false;
          console.log(this.atyclass1);
        } else if (this.accountDetailsData.AccAtyClass == 2) {
          this.atyclass1 = true;
          this.atyclass2 = true;
          this.atyclass3 = false;
          this.atyclass4 = false;
        } else if (this.accountDetailsData.AccAtyClass == 6) {
          this.atyclass1 = true;
          this.atyclass3 = true;
          this.atyclass4 = false;
          this.atyclass2 = false;
        } else if (this.accountDetailsData.AccAtyClass == 7) {
          this.atyclass1 = true;
          this.atyclass4 = true;
          this.atyclass2 = false;
          this.atyclass3 = false;
        }
        this.cashDepositForm.controls['AccountNo'].setValue(
          data.AccountDetails.AccountNo
        );
        this.cashDepositForm.controls['AccProductGLCode'].setValue(
          data.AccProductGLCode
        );
        this.cashDepositForm.controls['AccTypeClass'].setValue(
          data.AccTypeClass
        );
        this.accountViewModel.HasMultipleAccount = false;
        if (!this.UserData?.AutoVchflag) {
          document.getElementById(`VoucherNo`).focus();
        } else {
          this.OnVoucherNoChange();
        }
      });
    //   this.accountDetailsData = data.AccountDetails;
    //   console.log('This is account details>>', this.accountDetailsData);
    //   this.cashDepositForm.controls['AccountNo'].setValue(
    //     data.AccountDetails.AccountNo
    //   );

    //   this.accountViewModel.HasMultipleAccount = false;
    //   if (!this.UserData?.AutoVchflag) {
    //     document.getElementById(`VoucherNo`).focus();
    //   } else {
    //     //document.getElementById(`TransactionTypeCode`).focus();
    //   }
    // });
  }

  private getFormValue(): TransferDepositCreateModel {
    var fValue = this.cashDepositForm.value as TransferDepositCreateModel;
    // fValue.AccProvisionMode = this.accountViewModel.AccProvisionMode;
    // fValue.AccExpenseMode = this.accountViewModel.AccExpenseMode;
    fValue.DepositedAccountList = this.detailsData.DepositTransactions;
    fValue.AccountDetails = this.accountDetailsData;
    return fValue;
  }

  OnVoucherNoChange(): void {
    this.spinner.show();
    var fValue = this.cashDepositForm.value as TransferDepositViewModel;
    fValue.AccountDetails = this.accountDetailsData;
    this.pService
      .OnVoucherNoChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.cashDepositForm.controls['VoucherNo'].setValue('');
          return;
        }

        console.log('VCHChangeeee===>>', data);
        this.detailsData.DepositTransactions = data.DepositTransactions;
        this.ReloadRepositList(data.DepositTransactions);
        setTimeout(() => document.getElementById(`TrnAmount${0}`).focus(), 100);
      });
  }

  onAmountChange(i: number, x: FormGroup): void {
    var item = x.value as ITransferDepositTransactionModel;
    this.detailsData.DepositTransactions[i].Selected = true;
    this.detailsData.DepositTransactions[i].TrnAmount = item.TrnAmount;
    console.log(this.detailsData);
    this.pService
      .onAmountChange(this.detailsData)
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
          alert(r.Message);
        }
      });
  }

  onAmountEnterEvent(e: KeyboardEvent, i: number, x: FormGroup): void {
    if (e.keyCode != 13) return;
    var item = x.value as ITransferDepositTransactionModel;
    this.detailsData.DepositTransactions[i].Selected = true;
    this.detailsData.DepositTransactions[i].TrnAmount = item.TrnAmount;
    console.log(this.detailsData);
    this.pService
      .onAmountChange(this.detailsData)
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
          alert(r.Message);
        }
      });
  }

  public addItem(x: ITransferDepositTransactionModel): void {
    this.DepositedAccountList = this.cashDepositForm.get(
      'DepositedAccountList'
    ) as FormArray;
    this.DepositedAccountList.push(this.AddToDepositedAccount(x));
  }

  public ReloadRepositList(data: ITransferDepositTransactionModel[]): void {
    this.DepositedAccountList = this.cashDepositForm.get(
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
    this.cashDepositForm.controls['TotalAmount'].setValue(
      totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
  }

  private AddToDepositedAccount(
    x: ITransferDepositTransactionModel
  ): FormGroup {
    return this.fb.group({
      GLAccNo: [x.GLAccNo],
      GLAccDesc: [x.GLAccDesc],
      PayTypeDes: [x.PayTypeDes],
      TrnAmount: [
        x.TrnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      ],
      MarkRecord: [x.MarkRecord],
    });
  }

  onUpdate(): void {
    if (this.cashDepositForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    this.spinner.show();
    var fValue = this.cashDepositForm.value as TransferDepositCreateModel;
    fValue.DepositedAccountList = this.detailsData.DepositTransactions;
    fValue.AccountDetails = this.accountDetailsData;
    fValue.MemColCode = this.detailsData.MemColCode;
    fValue.AutoVchflag = this.UserData.AutoVchflag;
    this.pService
      .SubmitDeposit(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.VoucherNo = data.VoucherNo;
        console.log('Voucheeeeeer:', this.VoucherNo);
        this.spinner.hide();
        console.log('AllVchData::::->', data);

        if (!data.Success) {
          alert(data.Message);
          location.reload();
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
    if (this.cashDepositForm.controls['MemberNo'].value == '') {
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
    var fValue = this.cashDepositForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName = 'CCULB_rptCSTransactionVchTransferDepoTrans';
    console.log('PushedVaalue:', fValue.MemberNo);
    this.reportModel.Values.push(
      new ReportKeyValue('MemberNo', fValue.MemberNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('MemberName', this.detailsData.MemberName)
    );
    console.log('Testttt->', this.UserData);
    if (this.UserData?.AutoVchflag) {
      this.reportModel.Values.push(new ReportKeyValue('VchNo', this.VoucherNo));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('VchNo', fValue.VoucherNo)
      );
    }
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;
    window.open(iFramePath, '_blank');
  };
  refresh() {
    location.reload();
  }
}
