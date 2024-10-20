import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
import { InterestWithdrawalService } from 'src/app/services/interest-withdrawal.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import {
  IInterestAccountDetails,
  IInterestTransactionModel,
  InterestAccountViewModel,
  InterestWithdrawCreateModel,
  InterestWithdrawDataModel,
  InterestWithdrawInputHelp,
  OldMemberViewModel,
} from '../../models/interest-withdrawal.model';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { getUserInfo } from 'src/app/selector/user.selectors';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-benefit-withdrawal',
  templateUrl: './benefit-withdrawal.component.html',
  styleUrls: ['./benefit-withdrawal.component.css'],
})
export class BenefitWithdrawalComponent implements OnInit, OnDestroy {
  module: string = '1';
  UserData: UserInfo;
  interestWithdrawalForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: InterestWithdrawInputHelp = new InterestWithdrawInputHelp();
  public detailsData: InterestWithdrawDataModel = new InterestWithdrawDataModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public accountViewModel: InterestAccountViewModel;
  public accountDetailsData: IInterestAccountDetails;
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  public Transactions: FormArray;
  imageUrl: string = '';
  sigUrl: string = '';
  TrnAmount: number = 0;
  TransactionType: any;
  PrintFlag: any;
  PrintFOptionFlag: any;
  VoucherNo: any;
  ManualAccNoFlag: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: InterestWithdrawalService,
    private imageService: ImageProcessingService,
    private aService: ReportCommonService,
    private spinner: NgxSpinnerService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.accountDetailsData = { Success: true };
    this.reportModel.ReportName =
      'CCULB_rptCSContraTransactionVchIntWithdrawal';
    this.reportModel.Values = [];
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    let url = route.pathFromRoot
      .map((v) => v.url.map((segment) => segment.toString()).join('/'))
      .join('/');
    const queryParam = route.queryParamMap;
    if (queryParam.keys.length > 0) {
      url +=
        '?' +
        queryParam.keys
          .map((key) =>
            queryParam
              .getAll(key)
              .map((value) => key + '=' + value)
              .join('&')
          )
          .join('&');
    }
    return this.getModuleName(url);
  }
  getModuleName(urlData: any) {
    console.log(urlData);
    var result = '';
    for (var i = 1; i < urlData.length; i++) {
      if (urlData[i] == '/') return result;
      result += urlData[i];
    }
  }

  ngOnInit(): void {
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
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
    this.interestWithdrawalForm = this.fb.group({
      AccountTypeCode: new FormControl('', [Validators.required]),
      AccountTypeId: new FormControl('0'),
      AccountNo: new FormControl(''),
      OldAccountNo: new FormControl(''),
      ManualAccountNo: new FormControl(''),
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
      Transactions: this.fb.array([]),
    });
  }

  private getInputHelp(): void {
    this.spinner.show();
    this.pService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('AllData===>', data);
        if (data.ManualAccNo == 1) {
          this.ManualAccNoFlag = true;
        }
        this.inputHelpData = data;
        this.PrintFlag = this.inputHelpData.PrintFlag;
        this.PrintFOptionFlag = this.inputHelpData.PrintFOptFlag;
        this.spinner.hide();
      });
  }

  onAccountTypeChange(value: number): void {
    this.spinner.show();
    var item = new SelectListFilter().getItem(
      this.inputHelpData.AccountTypeList,
      value
    );
    this.interestWithdrawalForm.controls['AccountTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.interestWithdrawalForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );

    var fValue = this.interestWithdrawalForm.value;
    this.pService
      .OnAccountTypeChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.interestWithdrawalForm.controls['AccountTypeId'].setValue(0);
          this.interestWithdrawalForm.controls['AccountTypeCode'].setValue('');
          return;
        }
        this.accountViewModel = data;
        this.interestWithdrawalForm.controls['AccProductGLCode'].setValue(
          data.AccProductGLCode
        );
        this.interestWithdrawalForm.controls['AccTypeClass'].setValue(
          data.AccTypeClass
        );
        if (this.inputHelpData.ShowOldAccNo) {
          if (this.inputHelpData.ShowOldAccNo && this.module != '3') {
            document.getElementById(`OldAccountNo`).focus();
          } else {
            document.getElementById(`MemberNo`).focus();
          }
        }
      });
  }

  onOldAccNoChange(): void {
    var data = {
      OldMemNo: +this.interestWithdrawalForm.controls['OldAccountNo'].value,
      AccType: +this.interestWithdrawalForm.controls['AccountTypeCode'].value,
    };
    var fValue = data as OldMemberViewModel;
    this.spinner.show();
    this.pService
      .GetDetailsByOldMemberNo(data as OldMemberViewModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.interestWithdrawalForm.controls['OldAccountNo'].setValue('');
          alert(data.Message);
          return;
        }
        this.interestWithdrawalForm.controls['MemberNo'].setValue(data.MemNo);
        this.spinner.show();
        var fValue = this.interestWithdrawalForm.value;
        this.pService
          .GetDetailsByMember(fValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            this.spinner.hide();
            if (!data.Success) {
              alert(data.Message);
              this.interestWithdrawalForm.controls['MemberNo'].setValue('');
              return;
            }
            this.detailsData = data;
            this.interestWithdrawalForm.controls['MemType'].setValue(
              data.MemType
            );
            this.accountDetailsData = data.AccountDetails;
            this.accountDetailsData.Module = Number(this.module);
            this.interestWithdrawalForm.controls['AccountNo'].setValue(
              data.AccountDetails.AccountNo
            );
          });
      });
  }

  onEnterOldAccHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (!this.interestWithdrawalForm.controls['OldAccountNo'].value) {
      document.getElementById(`MemberNo`).focus();
      return;
    } else {
      document.getElementById(`VoucherNo`).focus();
    }
  }

  // onEnterOldAccHandler(e: KeyboardEvent) {
  //   if (e.keyCode != 13) return;
  //   document.getElementById(`ManualAccountNo`).focus();
  //   return;
  // }

  onEnterManualAccHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemberNo`).focus();
    return;
  }

  onMemberChange(): void {
    if (this.interestWithdrawalForm.value.AccountTypeCode == '') {
      alert('Please Input Account Type');
      this.interestWithdrawalForm.controls['MemberNo'].setValue('');
      return;
    }
    this.spinner.show();
    var fValue = this.interestWithdrawalForm.value;
    this.pService
      .GetDetailsByMember(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.interestWithdrawalForm.controls['MemberNo'].setValue('');
          return;
        }
        this.detailsData = data;
        this.ViewImage();
        this.interestWithdrawalForm.controls['MemType'].setValue(data.MemType);
        this.interestWithdrawalForm.controls['OldAccountNo'].setValue(
          data.OldAccountNo == 0 ? '' : data.OldAccountNo
        );
        this.accountDetailsData = data.AccountDetails;
        this.accountDetailsData.Module = Number(this.module);
        this.interestWithdrawalForm.controls['AccountNo'].setValue(
          data.AccountDetails.AccountNo
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

  onAccountNoSelect(value: string): void {
    this.spinner.show();
    this.interestWithdrawalForm.controls['AccountNo'].setValue(value);
    var fValue = this.interestWithdrawalForm.value;

    this.pService
      .GetAccountDetails(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.accountDetailsData = data;
        this.accountDetailsData.Module = Number(this.module);
        this.interestWithdrawalForm.controls['AccountNo'].setValue(
          data.AccountNo
        );
        this.interestWithdrawalForm.controls['OldAccountNo'].setValue(
          data.OldAccountNo == '0' ? '' : data.OldAccountNo
        );
        this.detailsData.HasMultipleAccount = false;
        if (!this.UserData?.AutoVchflag) {
          document.getElementById(`VoucherNo`).focus();
        } else {
          document.getElementById(`TransactionTypeCode`).focus();
        }
      });
  }

  OnVoucherNoChange(): void {
    this.spinner.show();
    var fValue = this.interestWithdrawalForm.value as InterestWithdrawDataModel;
    this.pService
      .OnVoucherNoChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.interestWithdrawalForm.controls['VoucherNo'].setValue('');
          alert(data.Message);
          return;
        }
        document.getElementById(`TransactionTypeCode`).focus();
      });
  }

  onTransTypeChange(value: number): void {
    console.log('Value:', value);
    var item = new SelectListFilter().getItem(
      this.inputHelpData.TransactionTypeList,
      value
    );
    this.TransactionType = item.Description;
    console.log('OnChangeItem:', item.Description);
    this.interestWithdrawalForm.controls['TransactionTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.interestWithdrawalForm.controls['TransactionTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );

    console.log('Alll Details===>', this.detailsData);
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
        this.detailsData.Transactions = data.Transactions;
        this.ReloadTransactions(data.Transactions);
        this.TrnAmount = data.Transactions[0].TrnAmount;
        if (fValue.TransactionTypeCode == 48) {
          setTimeout(
            () => document.getElementById(`BankChequeNo`).focus(),
            100
          );
          return;
        } else {
          setTimeout(
            () => document.getElementById(`PayTypeDes${0}`).focus(),
            100
          );
          return;
        }
      });
  }

  onPayTypeDesEnterHandler(e: KeyboardEvent, i: number, item: FormGroup) {
    if (e.keyCode != 13) return;
    setTimeout(() => document.getElementById(`TrnAmount${0}`).focus(), 100);
  }
  onAmountEnterHandler(e: KeyboardEvent, i: number, item: FormGroup) {
    if (e.keyCode != 13) return;
    setTimeout(() => document.getElementById(`update`).focus(), 100);
  }

  private getFormValue(): InterestWithdrawCreateModel {
    var fValue = this.interestWithdrawalForm
      .value as InterestWithdrawCreateModel;
    fValue.AccProvisionMode = this.accountViewModel?.AccProvisionMode;
    fValue.Transactions = this.detailsData.Transactions;
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
    this.interestWithdrawalForm.controls['BankId'].setValue(
      item != null ? item.Id : 0
    );
    this.interestWithdrawalForm.controls['BankCode'].setValue(
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
        this.detailsData.Transactions = data.Transactions;
        this.ReloadTransactions(data.Transactions);
        this.TrnAmount = data.Transactions[0].TrnAmount;
        setTimeout(
          () => document.getElementById(`PayTypeDes${0}`).focus(),
          100
        );
      });
  }

  public addItem(x: IInterestTransactionModel): void {
    this.Transactions = this.interestWithdrawalForm.get(
      'Transactions'
    ) as FormArray;
    this.Transactions.push(this.AddToTransactions(x));
  }

  public ReloadTransactions(data: IInterestTransactionModel[]): void {
    this.Transactions = this.interestWithdrawalForm.get(
      'Transactions'
    ) as FormArray;
    while (this.Transactions.length !== 0) {
      this.Transactions.removeAt(0);
    }
    data.forEach((x) => {
      this.addItem(x);
    });
    this.CalculateAmount();
  }

  private CalculateAmount(): void {
    let totalAmount = 0;
    this.detailsData.Transactions.forEach((x) => {
      totalAmount += x.TrnAmount;
    });
    this.detailsData.TotalAmount = totalAmount;
    this.interestWithdrawalForm.controls['TotalAmount'].setValue(
      totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
  }

  private AddToTransactions(x: IInterestTransactionModel): FormGroup {
    return this.fb.group({
      GLAccNo: [x.GLAccNo],
      GLAccDesc: [x.GLAccDesc],
      PayTypeDes: [x.PayTypeDes],
      TrnAmount: [
        x.TrnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      ],
    });
  }

  onItemChange(i: number, x: FormGroup): void {
    var fValue = this.getFormValue() as InterestWithdrawCreateModel;
    fValue.AccountDetails = this.accountDetailsData;
    var item = x.value as IInterestTransactionModel;
    fValue.Transactions[i].Selected = true;
    fValue.Transactions[i].PayTypeDes = item.PayTypeDes;
    fValue.Transactions[i].TrnAmount = item.TrnAmount;
    fValue.TrnAmount = this.TrnAmount;
    console.log(
      'this.detailsData.Transactions===',
      this.detailsData.Transactions
    );
    this.pService
      .onItemChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        if (r.Success) {
          this.detailsData.Transactions = r.Transactions;
          this.ReloadTransactions(r.Transactions);
        } else {
          alert(r.Message);
          this.Transactions.removeAt(0);
          fValue.Transactions.forEach((x) => {
            x.TrnAmount = 0;
            this.addItem(x);
          });
        }
      });
  }

  onUpdate(): void {
    if (this.interestWithdrawalForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    this.spinner.show();
    var fValue = this.getFormValue() as InterestWithdrawCreateModel;
    fValue.AccountDetails = this.accountDetailsData;
    fValue.AutoVchflag = this.UserData.AutoVchflag;
    fValue.Module = Number(this.module);
    this.pService
      .SubmitDeposit(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.VoucherNo = data.VoucherNo;
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.toaster.success(data.Message);
        if (this.PrintFlag == 1 && this.PrintFOptionFlag == 1) {
          this.getReportToken();
        } else {
          location.reload();
        }
      });
  }

  ViewImage() {
    this.spinner.show();
    var fValue = this.getFormValue();
    this.imageService
      .GetMemberImages(this.detailsData.MemberNo, this.detailsData.MemType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.imageUrl = data.ImagePicture;
        if (data.ImageSignature == null) {
          this.sigUrl = '';
        } else {
          this.sigUrl = data.ImageSignature;
        }
      });
  }

  refresh() {
    location.reload();
  }
  hideImageModal() {
    this.imageUrl = '';
  }
  hideSigModal() {
    this.sigUrl = '';
  }

  //
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
    var fValue = this.interestWithdrawalForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName =
      'CCULB_rptCSContraTransactionVchIntWithdrawal';
    this.reportModel.Values.push(
      new ReportKeyValue('transType', this.TransactionType)
    );
    this.reportModel.Values.push(new ReportKeyValue('memNo', fValue.MemberNo));

    this.reportModel.Values.push(
      new ReportKeyValue('memName', this.detailsData.MemberName)
    );
    if (this.UserData.AutoVchflag) {
      this.reportModel.Values.push(new ReportKeyValue('vchNo', this.VoucherNo));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('vchNo', fValue.VoucherNo)
      );
    }
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };

  exitPage() {
    this.router.navigate(['accounting/']);
  }
}
