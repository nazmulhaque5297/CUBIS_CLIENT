import { Component, OnInit } from '@angular/core';
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
import { EncashmentService } from 'src/app/services/encashment.service';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import {
  EncashmentAccountViewModel,
  EncashmentCreateModel,
  EncashmentDataModel,
  EncashmentInputHelp,
  IEncashmentAccountDetails,
  IEncashmentTransactionModel,
  OldMemberViewModel,
} from '../../models/encashment.model';
@Component({
  selector: 'app-encashment',
  templateUrl: './encashment.component.html',
  styleUrls: ['./encashment.component.css'],
})
export class EncashmentComponent implements OnInit {
  EncashmentForm: FormGroup;
  UserData: UserInfo;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: EncashmentInputHelp = new EncashmentInputHelp();
  public accountViewModel: EncashmentAccountViewModel;
  public detailsData: EncashmentDataModel = new EncashmentDataModel();
  public accountDetailsData: IEncashmentAccountDetails;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  displayIFrame = false;
  public Transactions: FormArray;
  imageUrl: string = '';
  sigUrl: string = '';
  VoucherNo: any;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: EncashmentService,
    private imageService: ImageProcessingService,
    private spinner: NgxSpinnerService,
    private store: Store,
    private aService: ReportCommonService
  ) {
    this.accountDetailsData = { Success: true };
    this.reportModel.ReportName =
      'CCULB_rptCSContraEncashmentTransactionVchForEncashment';
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
    this.EncashmentForm = this.fb.group({
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
        this.inputHelpData = data;
        this.spinner.hide();
      });
  }
  public addItem(x: IEncashmentTransactionModel): void {
    this.Transactions = this.EncashmentForm.get('Transactions') as FormArray;
    this.Transactions.push(this.AddToTransactions(x));
  }
  public ReloadTransactions(data: IEncashmentTransactionModel[]): void {
    this.Transactions = this.EncashmentForm.get('Transactions') as FormArray;
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
    totalAmount =
      this.detailsData.Transactions[3].TrnAmount +
      this.detailsData.Transactions[4].TrnAmount;
    this.detailsData.TotalAmount = totalAmount;
    this.EncashmentForm.controls['TotalAmount'].setValue(
      totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
  }
  private AddToTransactions(x: IEncashmentTransactionModel): FormGroup {
    return this.fb.group({
      GLAccNo: [x.GLAccNo],
      GLAccDesc: [x.GLAccDesc],
      PayTypeDes: [x.PayTypeDes],
      TrnAmount: [
        x.TrnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      ],
    });
  }
  private getFormValue(): EncashmentCreateModel {
    var fValue = this.EncashmentForm.value as EncashmentCreateModel;
    fValue.AccProvisionMode = this.accountViewModel.AccProvisionMode;
    fValue.AccExpenseMode = this.accountViewModel.AccExpenseMode;
    fValue.Transactions = this.detailsData.Transactions;
    fValue.AccountDetails = this.accountDetailsData;
    return fValue;
  }

  onAccountTypeChange(value: number): void {
    this.spinner.show();
    var item = new SelectListFilter().getItem(
      this.inputHelpData.AccountTypeList,
      value
    );
    this.EncashmentForm.controls['AccountTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.EncashmentForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );

    var fValue = this.EncashmentForm.value;
    this.pService
      .OnAccountTypeChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.EncashmentForm.controls['AccountTypeId'].setValue(0);
          this.EncashmentForm.controls['AccountTypeCode'].setValue('');
          return;
        }
        this.accountViewModel = data;
        this.EncashmentForm.controls['AccProductGLCode'].setValue(
          data.AccProductGLCode
        );
        this.EncashmentForm.controls['AccTypeClass'].setValue(
          data.AccTypeClass
        );
        if (this.inputHelpData.ShowOldAccNo) {
          document.getElementById(`OldAccountNo`).focus();
        } else {
          document.getElementById(`MemberNo`).focus();
        }
      });
  }

  onOldAccNoChange(): void {
    var data = {
      OldMemNo: +this.EncashmentForm.controls['OldAccountNo'].value,
      AccType: +this.EncashmentForm.controls['AccountTypeCode'].value,
    };
    this.spinner.show();
    this.pService
      .GetDetailsByOldMemberNo(data as OldMemberViewModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.EncashmentForm.controls['OldAccountNo'].setValue('');
          alert(data.Message);
          return;
        }
        this.spinner.show();
        this.EncashmentForm.controls['MemberNo'].setValue(data.MemNo);
        var fValue = this.EncashmentForm.value;
        this.pService
          .GetDetailsByMember(fValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            this.spinner.hide();
            if (!data.Success) {
              alert(data.Message);
              return;
            }
            this.detailsData = data;
            this.EncashmentForm.controls['MemType'].setValue(data.MemType);
            this.accountDetailsData = data.AccountDetails;
            this.EncashmentForm.controls['AccountNo'].setValue(
              data.AccountDetails.AccountNo
            );
          });
      });
  }

  onEnterOldAccHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (!this.EncashmentForm.controls['OldAccountNo'].value) {
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
    this.spinner.show();
    var fValue = this.EncashmentForm.value;
    this.pService
      .GetDetailsByMember(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        console.log('this is data', data);
        if (!data.Success) {
          alert(data.Message);
          this.EncashmentForm.controls['MemberNo'].setValue('');
          return;
        }
        this.detailsData = data;
        this.ViewImage();
        this.accountDetailsData = data.AccountDetails;
        this.EncashmentForm.controls['MemType'].setValue(data.MemType);
        this.EncashmentForm.controls['AccountNo'].setValue(
          data.AccountDetails.AccountNo
        );
        this.EncashmentForm.controls['OldAccountNo'].setValue(
          data.AccountDetails.OldAccountNo
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
    var fValue = this.getFormValue();
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
        this.accountDetailsData = data.AccountDetails;
        console.log('This is account details>>', this.accountDetailsData);
        this.EncashmentForm.controls['AccountNo'].setValue(
          data.AccountDetails.AccountNo
        );
        this.EncashmentForm.controls['OldAccountNo'].setValue(
          data.AccountDetails.OldAccountNo
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
    var fValue = this.EncashmentForm.value as EncashmentDataModel;
    this.pService
      .OnVoucherNoChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.EncashmentForm.controls['VoucherNo'].setValue('');
          alert(data.Message);
          return;
        }
        document.getElementById(`TransactionTypeCode`).focus();
      });
  }

  onTransTypeChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.TransactionTypeList,
      value
    );
    this.EncashmentForm.controls['TransactionTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.EncashmentForm.controls['TransactionTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    var fValue = this.getFormValue();
    fValue.MemRegNo = this.detailsData.MemRegNo;
    fValue.MemSubRegNo = this.detailsData.MemSubRegNo;
    fValue.MemColCode = this.detailsData.MemColCode;
    if (fValue.TransactionTypeCode == 48) {
      setTimeout(() => document.getElementById(`BankChequeNo`).focus(), 100);
      return;
    }
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
        this.accountDetailsData = data.AccountDetails;
        this.detailsData.Transactions = data.Transactions;
        this.ReloadTransactions(data.Transactions);
        setTimeout(() => document.getElementById(`TrnAmount${2}`).focus(), 100);
      });
  }

  onCheckHandler() {
    document.getElementById(`BankCode`).focus();
  }

  onBankChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.BankList,
      value
    );
    this.EncashmentForm.controls['BankId'].setValue(item != null ? item.Id : 0);
    this.EncashmentForm.controls['BankCode'].setValue(
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
        this.accountDetailsData = data.AccountDetails;
        this.detailsData.Transactions = data.Transactions;
        this.ReloadTransactions(data.Transactions);
        setTimeout(() => document.getElementById(`TrnAmount${0}`).focus(), 100);
      });
  }

  onItemChange(i: number, x: FormGroup): void {
    var fValue = this.getFormValue() as EncashmentCreateModel;
    fValue.AccountDetails = this.accountDetailsData;
    var item = x.value as IEncashmentTransactionModel;
    fValue.Transactions[i].Selected = true;
    fValue.Transactions[i].TrnAmount = item.TrnAmount;
    this.pService
      .onAmountChange(fValue, i)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        if (r.Success) {
          this.detailsData.Transactions = r.Transactions;
          this.ReloadTransactions(r.Transactions);
        } else {
          alert(r.Message);
        }
      });
  }

  onItemChangeEnterHandler(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    if (i == 2) document.getElementById(`update`).focus();
    if (i == 0) document.getElementById(`TrnAmount${i + 2}`).focus();
    if (i == 1) document.getElementById(`TrnAmount${2}`).focus();
    var fValue = this.getFormValue() as EncashmentCreateModel;
    fValue.AccountDetails = this.accountDetailsData;
    var item = x.value as IEncashmentTransactionModel;
    fValue.Transactions[i].Selected = true;
    fValue.Transactions[i].TrnAmount = item.TrnAmount;
    this.pService
      .onAmountChange(fValue, i)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        if (r.Success) {
          this.detailsData.Transactions = r.Transactions;
          this.ReloadTransactions(r.Transactions);
        } else {
          alert(r.Message);
        }
      });
  }

  onUpdate(): void {
    if (this.EncashmentForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    var fValue = this.getFormValue() as EncashmentCreateModel;
    fValue.AccountDetails = this.accountDetailsData;
    fValue.AutoVchflag = this.UserData.AutoVchflag;
    this.spinner.show();
    this.pService
      .SubmitEncashment(fValue)
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

  ViewImage() {
    this.spinner.show();
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

        console.log('This is image data >', data);
      });
  }

  hideImageModal() {
    this.imageUrl = '';
  }
  hideSigModal() {
    this.sigUrl = '';
  }

  public getReportToken = () => {
    if (this.EncashmentForm.controls['MemberNo'].value == '') {
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
    var fValue = this.EncashmentForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName =
      'CCULB_rptCSContraEncashmentTransactionVchForEncashment';
    console.log('PushedVaalue:', fValue.MemberNo);
    this.reportModel.Values.push(
      new ReportKeyValue('MemberNo', fValue.MemberNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('MemberName', this.detailsData.MemberName)
    );
    if (this.UserData.AutoVchflag) {
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
