import { IWithdrawCreate } from './../../models/payment-withdrawal.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { async, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { PaymentWithdrawalService } from 'src/app/services/payment-withdrawal.service';
import {
  IAccountDetails,
  IWithdrawTransactionModel,
  MemberChangeMode,
  WithdrawAccountViewModel,
  WithdrawalInputHelpViewModel,
  WithdrawalViewModel,
  OldMemberViewModel,
} from '../../models/payment-withdrawal.model';
import { AccountingService } from '../../services/accounting.service';
import { PaymentWithdrawalEventService } from '../../services/payment-withdrawal-event-service';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { UserInfo } from 'src/app/Models/Common.model';
import { Store, select } from '@ngrx/store';
import { getUserInfo } from 'src/app/selector/user.selectors';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { promise } from 'protractor';
import { environment } from 'src/environments/environment';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { ChequeBookCounterModalComponent } from '../counter-cheque-book/cheque-book-counter-modal/cheque-book-counter-modal.component';
import { ChequeIssueServiceService } from '../../services/cheque-issue-service.service';

@Component({
  selector: 'app-payment-transaction-withdrawal',
  templateUrl: './payment-transaction-withdrawal.component.html',
  styleUrls: ['./payment-transaction-withdrawal.component.css'],
})
export class PaymentTransactionWithdrawalComponent
  implements OnInit, OnDestroy {
  paymentWithdrawalForm: FormGroup;
  module: string = '1';
  private destroy$: Subject<void> = new Subject<void>();

  public viewData: WithdrawalInputHelpViewModel = new WithdrawalInputHelpViewModel();
  public detailsData: IAccountDetails;
  public accountViewModel: WithdrawAccountViewModel;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  hideDiv: boolean = false;
  showModal: boolean = false;
  displayIFrame = false;
  trnHistoryData = [];
  LoanDefaulterList = [];
  totalAmount: any;
  availableAmount: any;
  ledgerBalance: any;
  UserData: UserInfo;
  PrintFlag: any;
  PrintFOptFlag: any;
  VoucherNo: any;
  ManualAccNoFlag: boolean = false;

  public Transactions: FormArray;
  imageUrl: string = '';
  sigUrl: string = '';

  public withdrawalViewModel = new WithdrawalViewModel();
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: PaymentWithdrawalService,
    private cService: ChequeIssueServiceService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private accService: AccountingService,
    private aService: ReportCommonService,
    private imageService: ImageProcessingService,
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.detailsData = {
      Success: true,
    };
    this.reportModel.ReportName =
      'CCULB_rptCSContraTransactionVchForWithdrawal';
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
    this.paymentWithdrawalForm = this.fb.group({
      AccountTypeCode: new FormControl('', [Validators.required]),
      AccountTypeId: new FormControl('0'),
      OldAccountNo: new FormControl(''),
      ManualAccountNo: new FormControl(''),
      AccountNo: new FormControl(''),
      MemberNo: new FormControl(''),
      TransactionTypeCode: new FormControl(''),
      TransactionType: new FormControl('0'),
      VoucherOrChqNo: new FormControl(''),
      BankChequeNo: new FormControl(''),
      BankCode: new FormControl(''),
      BankId: new FormControl('0'),
      SpInstruction: new FormControl(''),
      TotalAmount: new FormControl(0),
      MemType: new FormControl('0'),
      AccTypeClass: new FormControl('0'),
      AccProductGLCode: new FormControl('0'),
      VoucherNo: new FormControl(''),
      Transactions: this.fb.array([]),
      ModuleNo: new FormControl(''),
    });
  }
  public addItem(x: IWithdrawTransactionModel): void {
    this.Transactions = this.paymentWithdrawalForm.get(
      'Transactions'
    ) as FormArray;
    this.Transactions.push(this.AddToDepositedAccount(x));
    //this.getAccountDetails(x.AccNo);
  }

  private AddToDepositedAccount(x: IWithdrawTransactionModel): FormGroup {
    return this.fb.group({
      GLAccNo: [x.GLAccNo],
      GLAccDesc: [x.GLAccDesc],
      PayTypeDes: [x.PayTypeDes],
      TrnAmount: [
        x.TrnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      ],
      Id: [x.Id],
    });
  }

  private getInputHelp(): void {
    this.spinner.show();
    this.pService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data.ManualAccNo === 1) {
          this.ManualAccNoFlag = true;
        }
        this.viewData = data;
        console.log('Flag Value All--->', this.viewData);
        data.Transactions.forEach((x) => {
          this.addItem(x);
        });
        this.spinner.hide();
      });
  }

  onAccountTypeChange(value: number): void {
    new PaymentWithdrawalEventService(
      this.paymentWithdrawalForm,
      this.viewData
    ).setAccountType(value);

    var fValue = this.paymentWithdrawalForm.value;
    this.cService.AccTypeCode = value ? value : '0';
    this.pService
      .OnAccountTypeChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.toaster.warning(data.Message);
          this.paymentWithdrawalForm.controls['AccountTypeId'].setValue(0);
          this.paymentWithdrawalForm.controls['AccountTypeCode'].setValue('');
          return;
        }

        this.accountViewModel = data;
        this.paymentWithdrawalForm.controls['AccProductGLCode'].setValue(
          data.AccProductGLCode
        );
        this.paymentWithdrawalForm.controls['AccTypeClass'].setValue(
          data.AccTypeClass
        );
        if (this.viewData.ShowOldAccount) {
          document.getElementById(`OldAccountNo`).focus();
        } else {
          document.getElementById(`MemberNo`).focus();
        }
      });
  }

  onAccountNoSelect(value: string): void {
    this.spinner.show();
    this.pService
      .GetAccountDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.detailsData = data;
        this.paymentWithdrawalForm.controls['AccountNo'].setValue(
          data.AccountNo
        );
        var fValue = this.paymentWithdrawalForm.value;
        document.getElementById(`TransactionTypeCode`).focus();
        this.cService.AccNo = this.detailsData?.AccountNo
          ? this.detailsData?.AccountNo
          : '0';
        this.cService.OldAccNO = this.detailsData?.OldAccountNo
          ? this.detailsData?.OldAccountNo
          : '0';
        this.cService.MemType = this.detailsData?.MemType
          ? this.detailsData?.MemType
          : '0';
        this.cService.MemNo = fValue.MemberNo ? fValue.MemberNo : '0';
        this.detailsData = data;
        this.detailsData.ShowGroupAccInfo = false;
      });
  }

  onTransactionTypeChange(value: number): void {
    console.log('I am calling');
    var AccNo = this.detailsData.AccountNo.toString();
    console.log('CheckkingAccNo==>', AccNo);

    this.pService
      .GetCorrAccNo(AccNo)
      .pipe()
      .subscribe((data: any) => {
        console.log('Checkking==>', data);
        if (data.Message != null && value != 1 && value != 47 && value != 48) {
          alert(data.Message);
          return;
        }
      });

    new PaymentWithdrawalEventService(
      this.paymentWithdrawalForm,
      this.viewData
    ).setTransactionType(value);
    if ((value == 1 || value == 3) && this.UserData.AutoVchflag)
      this.onVoucherChange();
    if ((value == 1 || value == 3) && !this.UserData.AutoVchflag)
      document.getElementById(`VoucherOrChqNo`).focus();
    if (value == 47)
      setTimeout(() => document.getElementById(`BankCode`).focus(), 100);
    if (value == 48)
      setTimeout(() => document.getElementById(`BankChequeNo`).focus(), 100);
  }

  onOldAccNoChange(): void {
    var data = {
      OldMemNo: +this.paymentWithdrawalForm.controls['OldAccountNo'].value,
      AccType: +this.paymentWithdrawalForm.controls['AccountTypeCode'].value,
    };
    var fValue = data as OldMemberViewModel;
    this.spinner.show();
    this.pService
      .GetDetailsByOldMemberNo(data as OldMemberViewModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.paymentWithdrawalForm.controls['OldAccountNo'].setValue('');
          alert(data.Message);
          return;
        }
        this.paymentWithdrawalForm.controls['MemberNo'].setValue(data.MemNo);
        this.spinner.show();
        var fValue = this.paymentWithdrawalForm.value;
        this.viewData.AccountTypeId = fValue.AccountTypeId;
        this.viewData.MemberNo = fValue.MemberNo;
        this.pService
          .GetDetailsByMember(this.viewData)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            this.spinner.hide();
            if (!data.Success) {
              this.toaster.warning(data.Message);
              this.paymentWithdrawalForm.controls['MemberNo'].setValue('');
              return;
            }
            this.detailsData = data;
            this.LoanDefaulterList = data.LoanDefaulterList ?? [];
            this.paymentWithdrawalForm.controls['OldAccountNo'].setValue(
              data.OldAccountNo
            );
            this.paymentWithdrawalForm.controls['AccountNo'].setValue(
              data.AccountNo
            );
          });
        this.TrnHistory();
      });
  }

  onEnterOldAccHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (!this.paymentWithdrawalForm.controls['OldAccountNo'].value) {
      document.getElementById(`MemberNo`).focus();
      return;
    } else {
      document.getElementById(`TransactionTypeCode`).focus();
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

  async onMemberChange() {
    this.spinner.show();
    var fValue = this.paymentWithdrawalForm.value;
    this.viewData.AccountTypeId = fValue.AccountTypeId;
    this.viewData.MemberNo = fValue.MemberNo;
    await this.pService
      .GetDetailsByMember(this.viewData)
      .pipe(takeUntil(this.destroy$))
      .toPromise()
      .then((data) => {
        if (!data.Success) {
          this.spinner.hide();
          alert(data.Message);
          this.paymentWithdrawalForm.controls['MemberNo'].setValue('');
          return;
        }
        this.detailsData = data;
        console.log('this is my member change response', this.detailsData);
        this.LoanDefaulterList = data.LoanDefaulterList ?? [];
        this.paymentWithdrawalForm.controls['OldAccountNo'].setValue(
          data.OldAccountNo
        );
        this.paymentWithdrawalForm.controls['AccountNo'].setValue(
          data.AccountNo
        );
        if (!this.detailsData.ShowGroupAccInfo) {
          setTimeout(() => {
            document.getElementById(`TransactionTypeCode`).focus();
          }, 100);
        }

        this.cService.AccNo = this.detailsData?.AccountNo
          ? this.detailsData?.AccountNo
          : '0';
        this.cService.OldAccNO = this.detailsData?.OldAccountNo
          ? this.detailsData?.OldAccountNo
          : '0';
        this.cService.MemType = this.detailsData?.MemType
          ? this.detailsData?.MemType
          : '0';
        this.cService.MemNo = fValue.MemberNo ? fValue.MemberNo : '0';
        this.detailsData = data;
      });
    await this.TrnHistory();
    this.ViewImage();
  }

  // onMemberChange(): void {
  //   if (this.paymentWithdrawalForm.value.AccountTypeCode == '') {
  //     alert('Please Input Account Type');
  //     this.paymentWithdrawalForm.controls['MemberNo'].setValue('');
  //     return;
  //   }
  //   this.spinner.show();
  //   var fValue = this.paymentWithdrawalForm.value;
  //   this.pService
  //     .GetDetailsByMember(fValue)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data) => {
  //       this.spinner.hide();
  //       if (!data.Success) {
  //         alert(data.Message);
  //         this.paymentWithdrawalForm.controls['MemberNo'].setValue('');
  //         return;
  //       }
  //       this.detailsData = data;
  //       console.log('this is my member change response', this.detailsData);
  //       //this.ViewImage();
  //       this.paymentWithdrawalForm.controls['MemType'].setValue(data.MemType);
  //       this.paymentWithdrawalForm.controls['OldAccountNo'].setValue(
  //         this.detailsData?.OldAccountNo
  //       );

  //       this.paymentWithdrawalForm.controls['AccountNo'].setValue(
  //         data.AccountNo
  //       );
  //       if (!this.detailsData.ShowGroupAccInfo) {
  //         if (!this.UserData?.AutoVchflag) {
  //           document.getElementById(`VoucherNo`).focus();
  //         } else {
  //           document.getElementById(`TransactionTypeCode`).focus();
  //         }
  //       }
  //     });
  // }

  async onMemberEnterChange(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (!this.paymentWithdrawalForm.value.MemberNo) {
      document.getElementById(`MemberNo`).focus();
      return;
    }
  }

  async TrnHistory() {
    this.spinner.show();
    let data2 = new MemberChangeMode();
    data2.AccType = this.paymentWithdrawalForm.value.AccountTypeCode;
    data2.MemNo = this.paymentWithdrawalForm.value.MemberNo;
    this.pService
      .TrnHistory(data2)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data2: any) => {
        console.log('this is member change response', data2);
        this.trnHistoryData = data2;
        this.spinner.hide();
      });
  }

  onCheckHandler() {
    document.getElementById(`BankCode`).focus();
  }

  onBankChange(value: number): void {
    var item = new SelectListFilter().getItem(this.viewData.BankList, value);
    this.paymentWithdrawalForm.controls['BankId'].setValue(
      item != null ? item.Id : 0
    );
    this.paymentWithdrawalForm.controls['BankCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    if (this.UserData.AutoVchflag) this.onVoucherChange();
    document.getElementById(`VoucherOrChqNo`).focus();
  }

  private getFormValue(): IWithdrawCreate {
    var fValue = this.paymentWithdrawalForm.value as IWithdrawCreate;
    fValue.AccountDetails = this.detailsData;
    fValue.ModuleNo = Number(this.module);
    return fValue;
  }
  onPayTypeDesEnterHandler(e: KeyboardEvent, i: number, item: FormGroup) {
    if (e.keyCode != 13) return;
    setTimeout(() => document.getElementById(`TrnAmount${0}`).focus(), 100);
  }
  onAmoutEnterHandler(e: KeyboardEvent, i: number, item: FormGroup) {
    if (e.keyCode != 13) return;
    setTimeout(() => document.getElementById(`update`).focus(), 100);
  }
  onItemChange(i: number, x: IWithdrawTransactionModel): void {
    var fValue = this.paymentWithdrawalForm.value as IWithdrawCreate;
    fValue.AccountDetails = this.detailsData;
    fValue.MemType = this.detailsData.MemType;
    fValue.CheckTrnWithDrawalValidity = true;
    fValue.AutoVchflag = this.UserData.AutoVchflag;
    this.spinner.show();
    this.pService
      .onVoucherNoChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.Transactions.removeAt(0);
          fValue.Transactions.forEach((x) => {
            x.TrnAmount = 0;
            this.addItem(x);
          });
          return;
        }
        this.Transactions.removeAt(0);
        data.Transactions.forEach((x) => {
          this.addItem(x);
          this.paymentWithdrawalForm.controls['TotalAmount'].setValue(
            x.TrnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
          var temp = '';
          for (var i = 0; i < this.detailsData.LienAmt.length; i++) {
            if (this.detailsData.LienAmt[i] != ',') {
              temp += this.detailsData.LienAmt[i];
            }
          }

          var temp2 = '';
          for (var i = 0; i < this.detailsData.LadgerBalance.length; i++) {
            if (this.detailsData.LadgerBalance[i] != ',') {
              temp2 += this.detailsData.LadgerBalance[i];
            }
          }
          this.ledgerBalance = temp2;
          this.availableAmount = Number(temp) + Number(x.TrnAmount);
          if (data.DivChqBookMSG) {
            this.showModal = true;
          } else {
          }
        });
      });
  }

  onUpdate(): void {
    if (
      this.paymentWithdrawalForm.get('VoucherOrChqNo').value == '' &&
      !this.UserData.AutoVchflag
    ) {
      alert('Please fill Voucher!');
      return;
    }
    if (this.paymentWithdrawalForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    this.spinner.show();
    var fValue = this.getFormValue();
    this.pService
      .Submit(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.VoucherNo = data.VoucherNo;
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        alert(data.Message);
        if (this.viewData.PrintFlag == 1 && this.viewData.PrintFOptFlag == 1) {
          this.getReportToken();
        } else {
          location.reload();
        }
      });
  }

  onVoucherChange(): void {
    var fValue = this.paymentWithdrawalForm.value as IWithdrawCreate;
    fValue.AccountDetails = this.detailsData;
    fValue.MemType = this.detailsData.MemType;
    fValue.MemRegNo = this.detailsData.MemRegNo;
    fValue.MemSubRegNo = this.detailsData.MemSubRegNo;
    fValue.MemColCode = this.detailsData.MemColCode;
    fValue.AutoVchflag = this.UserData.AutoVchflag;
    this.spinner.show();
    console.log('This is voucher change fvalue>>', fValue);
    this.pService
      .onVoucherNoChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.spinner.hide();
          if (!data.Success) {
            if (data.DivChqBookMSG) {
              this.showModal = true;
            } else {
              alert(data.Message);
            }

            this.paymentWithdrawalForm.controls['VoucherNo'].setValue('');
            return;
          }
          this.Transactions.removeAt(0);
          data.Transactions.forEach((x) => {
            this.addItem(x);
          });

          setTimeout(
            () => document.getElementById(`PayTypeDes${0}`).focus(),
            100
          );
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  callChequebookModal() {
    this.showModal = false;
    this.accService.showHideDiv = false;
    this.accService.showDiv = true;
    const modalRef = this.modalService.open(ChequeBookCounterModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'my-modal',
    });
  }

  hideModal() {
    this.showModal = false;
    this.paymentWithdrawalForm.controls['VoucherOrChqNo'].setValue('');
  }

  hideImageModal() {
    this.imageUrl = '';
  }
  hideSigModal() {
    this.sigUrl = '';
  }
  refresh() {
    location.reload();
  }

  ViewImage() {
    console.log('This is memno', this.paymentWithdrawalForm.value.MemberNo);
    this.spinner.show();
    var fValue = this.getFormValue();
    console.log('This is details data', this.detailsData);
    this.imageService
      .GetMemberImages(fValue.MemberNo, this.detailsData.MemType)
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

  public getReportToken = () => {
    if (this.paymentWithdrawalForm.controls['MemberNo'].value == '') {
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
    var fValue = this.paymentWithdrawalForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName =
      'CCULB_rptCSContraTransactionVchForWithdrawal';
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
        new ReportKeyValue('VchNo', fValue.VoucherOrChqNo)
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
