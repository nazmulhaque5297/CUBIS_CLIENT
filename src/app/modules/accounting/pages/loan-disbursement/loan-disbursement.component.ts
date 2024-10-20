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
import { LoanDisbursementService } from 'src/app/services/loan-disbursement.service';
import {
  DisbursementAccountViewModel,
  IDisbursementAccountDetails,
  IDisbursementTransactionModel,
  LoanDisbursementCreateModel,
  LoanDisbursementDataModel,
  LoanDisbursementInputHelp,
} from '../../models/loan-disbursement.model';
import { UserInfo } from 'src/app/Models/Common.model';
import { Store, select } from '@ngrx/store';
import { getUserInfo } from 'src/app/selector/user.selectors';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-loan-disbursement',
  templateUrl: './loan-disbursement.component.html',
  styleUrls: ['./loan-disbursement.component.css'],
})
export class LoanDisbursementComponent implements OnInit, OnDestroy {
  UserData: UserInfo;
  loanDisbursementForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: LoanDisbursementInputHelp =
    new LoanDisbursementInputHelp();
  public detailsData: LoanDisbursementDataModel =
    new LoanDisbursementDataModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  displayIFrame = false;
  public accountViewModel: DisbursementAccountViewModel;
  public accountDetailsData: IDisbursementAccountDetails;
  public Transactions: FormArray;
  public transactionList: IDisbursementTransactionModel[];
  public isDisabled: boolean = false;
  public PrintFOptFlag: any;
  public PrintFlag: any;
  VoucherNo:any;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: LoanDisbursementService,
    private spinner: NgxSpinnerService,
    private store: Store,
    private aService: ReportCommonService,
    private imageService: ImageProcessingService,
    private route: ActivatedRoute
  ) {
    this.accountDetailsData = { Success: true };
    this.reportModel.ReportName = 'CCULB_rptCSContraTransactionVchLoanDisburse';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.store.pipe(select(getUserInfo)).subscribe((userInfo: UserInfo) => {
      this.UserData = userInfo;
      console.log("All Store Data--->>>", this.UserData)
    });
    this.initializeForm();
    this.getInputHelp();
    document.getElementById(`applicationNo`).focus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.loanDisbursementForm = this.fb.group({
      AccountTypeCode: new FormControl('', [Validators.required]),
      AccountTypeId: new FormControl('0'),
      AccountNo: new FormControl(''),
      ApplicationNo: new FormControl(''),
      ApplicationDate: new FormControl(''),
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
      MemRegNo: new FormControl('0'),
      MemColCode: new FormControl(''),
      Transactions: this.fb.array([]),
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
        this.transactionList = data.Transactions;
        data.Transactions.forEach((x) => {
          this.addItem(x);
        });
        this.spinner.hide();
      });
  }

  onApplicationChange(): void {
    this.spinner.show();
    var fValue = this.loanDisbursementForm.value as LoanDisbursementCreateModel;
    this.pService
      .GetApplicationDetails(fValue.ApplicationNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.loanDisbursementForm.controls['ApplicationNo'].setValue('');
          document.getElementById(`ApplicationNo`).focus();
        } else {
          this.accountDetailsData = data.AccountInfo.AccountDetails;
          this.accountViewModel = data.AccountInfo;
          this.detailsData = data.MemberDetails;
          this.setApplicationData();
          if (!this.UserData?.AutoVchflag) {
            document.getElementById(`VoucherNo`).focus();
          } else {
            document.getElementById(`TransactionTypeCode`).focus();
          }
        }
      });
  }

  onApplicationNoEvent(e:KeyboardEvent) {
    if (e.keyCode != 13) return;
    if(!this.loanDisbursementForm.value.ApplicationNo){
      document.getElementById(`MemberNo`).focus();
    }else{
      if (!this.UserData?.AutoVchflag) {
        document.getElementById(`VoucherNo`).focus();
      } else {
        document.getElementById(`TransactionTypeCode`).focus();
      }

    }
  }

  setApplicationData(): void {
    this.loanDisbursementForm.controls['MemType'].setValue(
      this.detailsData.MemType
    );
    this.loanDisbursementForm.controls['AccProductGLCode'].setValue(
      this.accountViewModel.AccProductGLCode
    );
    this.loanDisbursementForm.controls['MemberNo'].setValue(
      this.detailsData.MemberNo
    );
    this.loanDisbursementForm.controls['AccountTypeCode'].setValue(
      this.accountViewModel.AccTypeCode.toString()
    );
    this.loanDisbursementForm.controls['AccountTypeId'].setValue(
      this.accountViewModel.AccTypeCode.toString()
    );
    this.loanDisbursementForm.controls['AccTypeClass'].setValue(
      this.accountViewModel.AccTypeClass
    );
    this.loanDisbursementForm.controls['AccountNo'].setValue(
      this.accountDetailsData.AccountNo
    );
    this.loanDisbursementForm.controls['ApplicationDate'].setValue(
      this.accountDetailsData.AccLoanAppDate
    );
  }

  onMemberChange(): void {
    this.spinner.show();
    var fValue = this.loanDisbursementForm.value;
    this.pService
      .GetDetailsByMember(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        console.log("this is member data=> ",data);
        this.detailsData = data;
        this.loanDisbursementForm.controls['MemType'].setValue(data.MemType);
        document.getElementById(`AccountTypeCode`).focus();
      });
  }

  OnVoucherNoChange(): void {
    this.spinner.show();
    var fValue = this.loanDisbursementForm.value as LoanDisbursementDataModel;
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
    this.loanDisbursementForm.controls['AccountTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.loanDisbursementForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );

    var fValue = this.loanDisbursementForm.value;
    this.pService
      .OnAccountTypeChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.loanDisbursementForm.controls['AccountTypeId'].setValue(0);
          this.loanDisbursementForm.controls['AccountTypeCode'].setValue('');
          return;
        }
        this.accountViewModel = data;
        this.accountDetailsData = data.AccountDetails;
        this.loanDisbursementForm.controls['AccProductGLCode'].setValue(
          data.AccProductGLCode
        );
        this.loanDisbursementForm.controls['AccTypeClass'].setValue(
          data.AccTypeClass
        );
        this.loanDisbursementForm.controls['AccountNo'].setValue(
          this.accountDetailsData.AccountNo
        );
        this.loanDisbursementForm.controls['ApplicationNo'].setValue(
          this.accountDetailsData.AccLoanAppNo
        );
        this.loanDisbursementForm.controls['ApplicationDate'].setValue(
          this.accountDetailsData.AccLoanAppDate
        );
        if (!this.UserData?.AutoVchflag) {
          document.getElementById(`VoucherNo`).focus();
        } else {
          document.getElementById(`TransactionTypeCode`).focus();
        }
      });
  }

  onTransTypeChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.TransactionTypeList,
      value
    );
    this.loanDisbursementForm.controls['TransactionTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.loanDisbursementForm.controls['TransactionTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    var fValue = this.getFormValue();
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
        this.transactionList = data.Transactions;
        this.ReloadTransactions(data.Transactions);

        this.isDisabled = true;
        if (fValue.TransactionTypeCode !== 48) {
          setTimeout(() => document.getElementById(`TypeDes${0}`).focus(), 100);
        }
      });
  }

  private getFormValue(): LoanDisbursementCreateModel {
    var fValue = this.loanDisbursementForm.value as LoanDisbursementCreateModel;
    fValue.Transactions = this.transactionList;
    fValue.AccountDetails = this.accountDetailsData;
    return fValue;
  }

  onChequeHandler() {
    document.getElementById(`BankCode`).focus();
  }

  onBankChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.BankList,
      value
    );
    this.loanDisbursementForm.controls['BankId'].setValue(
      item != null ? item.Id : 0
    );
    this.loanDisbursementForm.controls['BankCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    this.spinner.show();
    var fValue = this.getFormValue();
    this.pService
      .OnTransTypeChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.transactionList = data.Transactions;
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.ReloadTransactions(data.Transactions);

        setTimeout(() => document.getElementById(`TypeDes${0}`).focus(), 100);

        this.isDisabled = true;
      });
  }

  public addItem(x: IDisbursementTransactionModel): void {
    this.Transactions = this.loanDisbursementForm.get(
      'Transactions'
    ) as FormArray;
    this.Transactions.push(this.AddToTransactions(x));
  }

  public ReloadTransactions(data: IDisbursementTransactionModel[]): void {
    this.Transactions = this.loanDisbursementForm.get(
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
    this.transactionList.forEach((x) => {
      totalAmount += x.TrnAmount;
    });
    this.detailsData.TotalAmount = totalAmount;
    this.loanDisbursementForm.controls['TotalAmount'].setValue(
      totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
  }

  private AddToTransactions(x: IDisbursementTransactionModel): FormGroup {
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
    var fValue = this.getFormValue() as LoanDisbursementCreateModel;
    var item = x.value as IDisbursementTransactionModel;
    fValue.Transactions[i].Selected = true;
    fValue.Transactions[i].PayTypeDes = item.PayTypeDes;
    fValue.Transactions[i].TrnAmount = item.TrnAmount;

    this.pService
      .onItemChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        if (!r.Success) {
          alert(r.Message);
        }
        this.transactionList = r.Transactions;
        this.ReloadTransactions(r.Transactions);
      });
  }

  onAmountEnterHandler(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    var fValue = this.getFormValue() as LoanDisbursementCreateModel;
    var item = x.value as IDisbursementTransactionModel;
    fValue.Transactions[i].Selected = true;
    fValue.Transactions[i].PayTypeDes = item.PayTypeDes;
    fValue.Transactions[i].TrnAmount = item.TrnAmount;
    fValue.MemRegNo = this.detailsData.MemRegNo;
    fValue.MemColCode = this.detailsData.MemColCode;
    console.log(this.detailsData.MemColCode);
    this.pService
      .onItemChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        if (!r.Success) {
          alert(r.Message);
        }
        this.transactionList = r.Transactions;
        this.ReloadTransactions(r.Transactions);
        document.getElementById(`update`).focus();
      });
  }
  onItemEnterChange(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    document.getElementById(`TrnAmount`).focus();
  }
  onCreate(): void {
    if (this.loanDisbursementForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    this.spinner.show();
    var fValue = this.getFormValue() as LoanDisbursementCreateModel;
    fValue.AutoVchflag = this.UserData.AutoVchflag;
    this.pService
      .Submit(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.VoucherNo=data.VoucherNo;
        console.log("data---->",data)
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

  onCancel(): void {
    location.reload();
  }

  public getReportToken = () => {
    if (this.loanDisbursementForm.controls['MemberNo'].value == '') {
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
    var fValue = this.loanDisbursementForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName = 'CCULB_rptCSContraTransactionVchLoanDisburse';
    console.log('PushedVaalue:', fValue.MemberNo);
    this.reportModel.Values.push(
      new ReportKeyValue('MemberNo', fValue.MemberNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('MemberName', this.detailsData.MemberName)
    );
    if( this.UserData.AutoVchflag)
    {
      this.reportModel.Values.push(new ReportKeyValue('VchNo', this.VoucherNo));
    }
    else{
      this.reportModel.Values.push(new ReportKeyValue('VchNo', fValue.VoucherNo));
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
