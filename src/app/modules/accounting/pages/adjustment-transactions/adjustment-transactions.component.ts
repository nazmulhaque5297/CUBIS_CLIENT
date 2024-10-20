import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { AdjustmentService } from 'src/app/services/adjustment-transaction.service';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import {
  AdjustmentAccountViewModel,
  AdjustmentCreateModel,
  AdjustmentDataModel,
  AdjustmentInputHelp,
  IAdjustmentAccountDetails,
  IAdjustmentTransactionModel,
  OldMemberViewModel,
} from '../../models/adjustment-transaction.model';

@Component({
  selector: 'app-adjustment-transactions',
  templateUrl: './adjustment-transactions.component.html',
  styleUrls: ['./adjustment-transactions.component.css'],
})
export class AdjustmentTransactionsComponent implements OnInit, OnDestroy {
  UserData: UserInfo;
  adjustmentForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: AdjustmentInputHelp = new AdjustmentInputHelp();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  displayIFrame = false;
  public detailsData: AdjustmentDataModel = new AdjustmentDataModel();
  public accountViewModel: AdjustmentAccountViewModel;
  public accountDetailsData: IAdjustmentAccountDetails;
  public Transactions: FormArray;
  public transactionList: IAdjustmentTransactionModel[];
  public isDisabled: boolean = false;
  public ShowCloseDiv: boolean = false;
  public DepositedVoucher: string = '';
  PrintFOptFlag: any;
  PrintFlag: any;
  VoucherNo: any;
  ManualAccNoFlag: boolean = false;
  imageUrl: string = '';
  sigUrl : string='';

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: AdjustmentService,
    private spinner: NgxSpinnerService,
    private store: Store,
    private imageService: ImageProcessingService,
    private route: ActivatedRoute,
    private aService: ReportCommonService
  ) {
    this.accountDetailsData = { Success: true };
    this.reportModel.ReportName =
      'CCULB_rptCSContraTransactionVchForAdjustment';
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
    this.adjustmentForm = this.fb.group({
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
      AccountHeadId: new FormControl('0'),
      TransactionTypeCode: new FormControl(''),
      TransactionTypeId: new FormControl('0'),
      TotalDrAmount: new FormControl(0),
      TotalCrAmount: new FormControl(0),
      MemType: new FormControl('0'),
      AccTypeClass: new FormControl('0'),
      AccProductGLCode: new FormControl('0'),
      Transactions: this.fb.array([]),
      DebitAmount: new FormControl('0'),
      CreditAmount: new FormControl('0'),
    });
  }

  private getInputHelp(): void {
    this.spinner.show();
    this.pService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data.ManualAccNo == 1) {
          this.ManualAccNoFlag = true;
        }
        this.inputHelpData = data;
        console.log('AllData:', data);
        this.transactionList = data.Transactions;
        this.PrintFlag = this.inputHelpData.PrintFlag;
        this.PrintFOptFlag = this.inputHelpData.PrintFOptFlag;
        data.Transactions.forEach((x) => {
          this.addItem(x);
        });
        this.spinner.hide();
      });
  }

  onOldAccNoChange(): void {
    var data = {
      OldMemNo: +this.adjustmentForm.controls['OldAccountNo'].value,
      AccType: +this.adjustmentForm.controls['AccountTypeCode'].value,
    };
    var fValue = data as OldMemberViewModel;
    this.spinner.show();
    this.pService
      .GetDetailsByOldMemberNo(data as OldMemberViewModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.adjustmentForm.controls['OldAccountNo'].setValue('');
          alert(data.Message);
          return;
        }
        this.adjustmentForm.controls['MemberNo'].setValue(data.MemNo);
        this.spinner.show();
        var fValue = this.adjustmentForm.value;
        this.pService
          .GetDetailsByMember(fValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            this.spinner.hide();
            this.detailsData = data;
            this.accountDetailsData = data.AccountDetails;
            this.adjustmentForm.controls['MemType'].setValue(data.MemType);
            this.adjustmentForm.controls['AccountNo'].setValue(
              this.accountDetailsData.AccountNo
            );
            this.adjustmentForm.controls['OldAccountNo'].setValue(
              this.accountDetailsData.OldAccountNo
            );
            if (!data.Success) {
              alert(data.Message);
            }
          });
      });
  }

  onEnterOldAccHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (!this.adjustmentForm.controls['OldAccountNo'].value) {
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
    var fValue = this.adjustmentForm.value;
    this.pService
      .GetDetailsByMember(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.detailsData = data;
        this.ViewImage();
        this.accountDetailsData = data.AccountDetails;
        this.adjustmentForm.controls['MemType'].setValue(data.MemType);
        this.adjustmentForm.controls['AccountNo'].setValue(
          this.accountDetailsData.AccountNo
        );
        this.adjustmentForm.controls['OldAccountNo'].setValue(
          this.accountDetailsData.OldAccountNo
        );
        if (!this.UserData?.AutoVchflag) {
          document.getElementById(`VoucherNo`).focus();
        } else {
          document.getElementById(`TransactionTypeCode`).focus();
        }
        if (!data.Success) {
          alert(data.Message);
          this.adjustmentForm.controls['MemberNo'].setValue('');
          document.getElementById(`MemberNo`).focus();
        }
      });
  }
  hideImageModal() {
    this.imageUrl = '';
  }
  hideSigModal(){
    this.sigUrl='';
  }
  ViewImage() {
    console.log('This is memno', this.adjustmentForm.value.MemberNo);
    this.spinner.show();
    var fValue = this.getFormValue();
    console.log('This is details data', this.detailsData);
    this.imageService
      .GetMemberImages(Number(fValue.MemberNo), this.detailsData.MemType)
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
  onMemberEnterEvent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.adjustmentForm.value.MemberNo) {
      // this.spinner.show();
      // var fValue = this.adjustmentForm.value;
      // this.pService
      //   .GetDetailsByMember(fValue)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe((data) => {
      //     this.spinner.hide();
      //     this.detailsData = data;
      //     this.accountDetailsData = data.AccountDetails;
      //     this.adjustmentForm.controls['MemType'].setValue(data.MemType);
      //     this.adjustmentForm.controls['AccountNo'].setValue(
      //       this.accountDetailsData.AccountNo
      //     );
      //     this.adjustmentForm.controls['OldAccountNo'].setValue(
      //       this.accountDetailsData.OldAccountNo
      //     );
      if (!this.UserData?.AutoVchflag) {
        document.getElementById(`VoucherNo`).focus();
      } else {
        document.getElementById(`TransactionTypeCode`).focus();
      }
      //   if (!data.Success) {
      //     alert(data.Message);
      //     location.reload();
      //   }
      // });
    }
  }

  OnVoucherNoChange(): void {
    document.getElementById(`TransactionTypeCode`).focus();
  }

  onAccountTypeChange(value: number): void {
    this.spinner.show();
    var item = new SelectListFilter().getItem(
      this.inputHelpData.AccountTypeList,
      value
    );
    this.adjustmentForm.controls['AccountTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.adjustmentForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );

    var fValue = this.adjustmentForm.value;
    this.pService
      .OnAccountTypeChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.adjustmentForm.controls['AccountTypeId'].setValue(0);
          this.adjustmentForm.controls['AccountTypeCode'].setValue('');
          return;
        }
        this.accountViewModel = data;
        this.adjustmentForm.controls['AccProductGLCode'].setValue(
          data.AccProductGLCode
        );
        this.adjustmentForm.controls['AccTypeClass'].setValue(
          data.AccTypeClass
        );
        if (this.inputHelpData.ShowOldAccNo) {
          document.getElementById(`OldAccountNo`).focus();
        } else {
          document.getElementById(`MemberNo`).focus();
        }
      });
  }

  onTransTypeChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.TransactionTypeList,
      value
    );
    this.adjustmentForm.controls['TransactionTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.adjustmentForm.controls['TransactionTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    var fValue = this.getFormValue();

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
        if (fValue.TransactionTypeCode != 3) {
          this.inputHelpData.BankList = data.GlContraList;
          if (fValue.TransactionTypeCode == 1) {
            var item = new SelectListFilter().getItem(
              this.inputHelpData.BankList,
              10101001
            );
            this.adjustmentForm.controls['BankCode'].setValue(
              item != null ? item.Id : 0
            );
            this.adjustmentForm.controls['BankId'].setValue(
              item != null ? item.Id.toString() : ''
            );
          }
        } else {
          this.inputHelpData.BankList = [];
          this.inputHelpData.AccountHeadList = data.GlContraList;
        }
        if (fValue.TransactionTypeCode == 48 || fValue.TransactionTypeCode == 3)
          return;
        this.transactionList = data.Transactions;
        this.ReloadTransactions(data.Transactions);
        this.isDisabled = true;
        if (fValue.TransactionTypeCode == 1) {
          setTimeout(
            () => document.getElementById(`PayTypeDes${0}`).focus(),
            100
          );
        } else if (fValue.TransactionTypeCode == 48) {
          document.getElementById(`bankcode`).focus();
        }
      });
  }

  onPayTypeDesEnterHandler(e: KeyboardEvent, i: number, item: FormGroup) {
    if (e.keyCode != 13) return;
    setTimeout(() => document.getElementById(`DebitAmount${0}`).focus(), 100);
  }

  onDebitAmountEnterHandler(e: KeyboardEvent, i: number, item: FormGroup) {
    if (e.keyCode != 13) return;
    setTimeout(() => document.getElementById(`CreditAmount${0}`).focus(), 100);
  }
  onCreditAmountEnterHandler(e: KeyboardEvent, i: number, item: FormGroup) {
    if (e.keyCode != 13) return;
    document.getElementById(`update`).focus();
    return;
  }

  onAccountHeadChange(value: number): void {
    this.spinner.show();
    this.pService
      .GetTrfHeadDetailCodeList(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.inputHelpData.BankList = data;
      });
  }

  private getFormValue(): AdjustmentCreateModel {
    var fValue = this.adjustmentForm.value as AdjustmentCreateModel;
    fValue.Transactions = this.transactionList;
    fValue.AccountDetails = this.accountDetailsData;
    return fValue;
  }

  onBankChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.BankList,
      value
    );
    this.adjustmentForm.controls['BankId'].setValue(item != null ? item.Id : 0);
    this.adjustmentForm.controls['BankCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    this.spinner.show();
    var fValue = this.getFormValue();
    this.pService
      .OnBankChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.transactionList = data.Transactions;
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.ReloadTransactions(data.Transactions);
        this.isDisabled = true;
      });
  }

  public addItem(x: IAdjustmentTransactionModel): void {
    this.Transactions = this.adjustmentForm.get('Transactions') as FormArray;
    this.Transactions.push(this.AddToTransactions(x));
  }

  public ReloadTransactions(data: IAdjustmentTransactionModel[]): void {
    this.Transactions = this.adjustmentForm.get('Transactions') as FormArray;
    while (this.Transactions.length !== 0) {
      this.Transactions.removeAt(0);
    }
    data.forEach((x) => {
      this.addItem(x);
    });
    // this.CalculateAmount();
  }

  // private CalculateAmount():void{
  //   let totalAmount=0;
  //   this.transactionList.forEach(x => {
  //     totalAmount+=x.DebitAmount;
  //   });
  //   this.detailsData.TotalDrAmount=totalAmount;
  //   this.adjustmentForm.controls['TotalDrAmount'].setValue(totalAmount);
  // }

  private AddToTransactions(x: IAdjustmentTransactionModel): FormGroup {
    console.log(x);
    return this.fb.group({
      GLAccNo: [x.GLAccNo],
      GLAccDesc: [x.GLAccDesc],
      PayTypeDes: [x.PayTypeDes],
      DebitAmount: [x.DebitAmount],
      CreditAmount: [x.CreditAmount],
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
        this.adjustmentForm.controls['AccountNo'].setValue(data.AccountNo);
        this.detailsData.HasMultipleAccount = false;
        if (!this.UserData?.AutoVchflag) {
          document.getElementById(`VoucherNo`).focus();
        }
      });
  }

  onItemChange(i: number, x: FormGroup): void {
    var fValue = this.getFormValue() as AdjustmentCreateModel;
    var item = x.value as IAdjustmentTransactionModel;
    fValue.Transactions[i].Selected = true;
    fValue.Transactions[i].PayTypeDes = item.PayTypeDes;
    fValue.Transactions[i].DebitAmount = item.DebitAmount;
    fValue.Transactions[i].CreditAmount = item.CreditAmount;

    this.pService
      .onItemChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        if (!r.Success) {
          alert(r.Message);
          this.Transactions.removeAt(0);
          fValue.Transactions.forEach((x) => {
            x.DebitAmount = 0;
            this.addItem(x);
          });
          return;
        }
        this.transactionList = r.Transactions;
        this.ReloadTransactions(r.Transactions);
        let value =
          r.Transactions[0].DebitAmount ?? r.Transactions[0].CreditAmount;
        this.adjustmentForm.controls['DebitAmount'].setValue(
          value.toLocaleString('en-US', { minimumFractionDigits: 2 })
        );
        this.adjustmentForm.controls['CreditAmount'].setValue(
          value.toLocaleString('en-US', { minimumFractionDigits: 2 })
        );
        document.getElementById(`update`).focus();
      });
  }

  onUpdate(): void {
    if (this.adjustmentForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    this.spinner.show();
    var fValue = this.getFormValue() as AdjustmentCreateModel;
    fValue.AutoVchflag = this.UserData.AutoVchflag;
    this.pService
      .Submit(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.spinner.hide();
          console.log('ResponseData---->>', data);
          this.VoucherNo = data.VoucherNo;
          if (!data.Success) {
            alert(data.Message);
            return;
          }
          if (data.ShowCloseWarning) {
            this.ShowCloseDiv = true;
            this.DepositedVoucher = data.VoucherNo;
            return;
          }
          alert(data.Message);
          if (this.PrintFlag == 1 && this.PrintFOptFlag == 1) {
            this.getReportToken();
          } else {
            location.reload();
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  CloseModalYes() {
    this.ShowCloseDiv = false;
    this.spinner.show();
    var fValue = this.getFormValue() as AdjustmentCreateModel;
    fValue.AutoVchflag = this.UserData.AutoVchflag;
    fValue.TrnAmount =
      fValue.Transactions[0].DebitAmount ?? fValue.Transactions[0].CreditAmount;
    fValue.VoucherNo = this.DepositedVoucher;
    this.pService
      .CloseAccount(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.spinner.hide();
          if (!data.Success) {
            alert(data.Message);
            return;
          }
          alert(data.Message);
          if (this.PrintFlag == 1 && this.PrintFOptFlag == 1) {
            this.getReportToken();
          } else {
            location.reload();
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  CloseModalNo() {
    this.ShowCloseDiv = false;
    if (this.PrintFlag == 1 && this.PrintFOptFlag == 1) {
      this.getReportToken();
    } else {
      if (this.UserData.AutoVchflag) {
        alert(
          'TRANSACTION SUCESSFULLY DONE. \nGenerated Auto Voucher No. = ' +
            this.DepositedVoucher
        );
      } else {
        alert('TRANSACTION SUCESSFULLY DONE');
      }
    }
  }

  onCancel(): void {
    location.reload();
  }

  public getReportToken = () => {
    if (this.adjustmentForm.controls['MemberNo'].value == '') {
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
    var fValue = this.adjustmentForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName =
      'CCULB_rptCSContraTransactionVchForAdjustment';
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
      new ReportKeyValue('transactionTypeCode', fValue.TransactionTypeCode)
    );
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;
    window.open(iFramePath, '_blank');
  };
}
