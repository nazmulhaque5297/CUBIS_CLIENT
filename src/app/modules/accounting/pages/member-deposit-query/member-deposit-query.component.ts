import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
import { DepositQueryService } from 'src/app/services/deposit-query.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import {
  DepositQueryCreateModel,
  DepositQueryDataModel,
  DepositQueryInputHelp,
  IDepositQueryTransactionModel,
  OldMemberViewModel,
} from '../../models/deposit-query.model';

@Component({
  selector: 'app-member-deposit-query',
  templateUrl: './member-deposit-query.component.html',
  styleUrls: ['./member-deposit-query.component.css'],
})
export class MemberDepositQueryComponent implements OnInit, OnDestroy {
  depositQueryForm: FormGroup;
  UserData: UserInfo;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  ApplicationNoReject: any;
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: DepositQueryInputHelp = new DepositQueryInputHelp();
  public queryDataDetails: DepositQueryDataModel = new DepositQueryDataModel();
  public Transactions: FormArray;
  public transactionList: IDepositQueryTransactionModel[];
  public isDisabled: boolean = false;
  public PrintFlag: any;
  public PrintFOptFlag: any;
  VoucherNo: any;
  ManualAccNoFlag:boolean=false;
  CorrAccNo:any;
  CorrAccBalance:any;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: DepositQueryService,
    private spinner: NgxSpinnerService,
    private store: Store,
    private sanitizer: DomSanitizer,
    private aService: ReportCommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reportModel.ReportName = '';
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
    this.depositQueryForm = this.fb.group({
      IsCashDeposit: new FormControl('true'),
      AccountTypeCode: new FormControl(''),
      AccountTypeId: new FormControl('0'),
      MemberName: new FormControl(''),
      OldAccountNo: new FormControl(''),
      ManualAccountNo: new FormControl(''),
      CorrAccountNo: new FormControl(''),
      CorrAccountBalance: new FormControl('0'),
      MemberNo: new FormControl('', [Validators.required]),
      VoucherNo: new FormControl(''),
      MemType: new FormControl(''),
      TotalAmount: new FormControl(0),
      Transactions: this.fb.array([]),
    });
  }

  private getInputHelp(): void {
    this.spinner.show();
    this.pService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('All Data:', data);
        if(data.ManualAccNo==1)
        {
          this.ManualAccNoFlag=true;
        }
        this.inputHelpData = data;
        console.log('FlagValue', this.inputHelpData.PrintFOptFlag);
        this.spinner.hide();
      });
  }

  onOldAccNoChange(): void {
    var data = {
      OldMemNo: +this.depositQueryForm.controls['OldAccountNo'].value,
      AccType: +this.depositQueryForm.controls['AccountTypeCode'].value,
    };
    var fValue = data as OldMemberViewModel;
    this.spinner.show();
    this.pService
      .GetDetailsByOldMemberNo(data as OldMemberViewModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.depositQueryForm.controls['OldAccountNo'].setValue('');
          alert(data.Message);
          return;
        }
        this.depositQueryForm.controls['MemberNo'].setValue(data.MemNo);
        this.spinner.show();
        var fValue = this.depositQueryForm.value;
        this.pService
          .GetDetailsByMember(fValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            this.spinner.hide();
            this.queryDataDetails = data;
            this.transactionList = data.Transactions;
            this.depositQueryForm.controls['MemType'].setValue(data.MemType);
            this.depositQueryForm.controls['CorrAccountNo'].setValue(
              data.CorrAccDetails.CorrAccountNo
            );
            this.depositQueryForm.controls['CorrAccountBalance'].setValue(
              data.CorrAccDetails.AccBalance
            );
            this.ReloadTransactions(data.Transactions);
            if (!data.Success) {
              alert(data.Message);
            }
          });
      });
  }
  onEnterOldAccHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (!this.depositQueryForm.controls['OldAccountNo'].value) {
      document.getElementById(`MemberNo`).focus();
      return;
    }
    else{
      document.getElementById(`VoucherNo`).focus();
    }
  }
  onMemberChange(): void {
    this.spinner.show();
    var fValue = this.depositQueryForm.value;
    fValue.UserCashCode = this.inputHelpData.UserCashCode;
    this.pService
      .GetDetailsByMember(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log("All Data====>>>>",data)
        this.CorrAccNo=data.CorrAccDetails.CorrAccountNo;
        this.CorrAccBalance=data.CorrAccDetails.CorrAccountBalance;
        this.spinner.hide();
        if (!data.Success) {
          this.depositQueryForm.controls['MemberNo'].setValue('');
          alert(data.Message);
          return;
        }
        this.queryDataDetails = data;
        this.transactionList = data.Transactions;
        console.log(data);
        this.depositQueryForm.controls['MemType'].setValue(data.MemType);
        this.depositQueryForm.controls['CorrAccountNo'].setValue(
          data.CorrAccDetails.CorrAccountNo
        );
        this.depositQueryForm.controls['CorrAccountBalance'].setValue(
          data.CorrAccDetails.AccBalance
        );
        this.ReloadTransactions(data.Transactions);

        if (!this.UserData?.AutoVchflag) {
          document.getElementById(`VoucherNo`).focus();
        } else {
          setTimeout(
            () => document.getElementById(`TrnAmount${0}`).focus(),
            100
          );
        }
      });
  }

  OnVoucherNoChange(): void {
    this.spinner.show();
    var fValue = this.getFormValue() as DepositQueryCreateModel;
    this.pService
      .OnVoucherNoChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.depositQueryForm.controls['VoucherNo'].setValue('');
          alert(data.Message);
        } else {
          document.getElementById(`TrnAmount${0}`).focus();
        }
      });
  }

  onAccountTypeChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.AccountTypeList,
      value
    );
    this.depositQueryForm.controls['AccountTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.depositQueryForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    if (this.inputHelpData.ShowOldAccNo) {
      document.getElementById(`OldAccountNo`).focus();
    } else {
      document.getElementById(`MemberNo`).focus();
    }
  }
  onAccountTypeEventChange(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.inputHelpData.ShowOldAccNo) {
      document.getElementById(`OldAccountNo`).focus();
    } else {
      document.getElementById(`MemberNo`).focus();
    }
  }

  private getFormValue(): DepositQueryCreateModel {
    var fValue = this.depositQueryForm.value as DepositQueryCreateModel;
    fValue.Transactions = this.transactionList;
    fValue.UserCashCode = this.inputHelpData.UserCashCode;
    fValue.DepositQueryModel = this.queryDataDetails;
    return fValue;
  }

  public addItem(x: IDepositQueryTransactionModel): void {
    this.Transactions = this.depositQueryForm.get('Transactions') as FormArray;
    this.Transactions.push(this.AddToTransactions(x));
  }

  public ReloadTransactions(data: IDepositQueryTransactionModel[]): void {
    this.Transactions = this.depositQueryForm.get('Transactions') as FormArray;
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
    this.depositQueryForm.controls['TotalAmount'].setValue(
      totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
  }

  private AddToTransactions(x: IDepositQueryTransactionModel): FormGroup {
    console.log(x);
    return this.fb.group({
      GLAccNo: [x.GLAccNo],
      GLAccDesc: [x.GLAccDesc],
      AccType: [x.AccType],
      AccNo: [x.AccNo],
      TrnAmount: [
        x.TrnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      ],
      AccBalance: [
        x.AccBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      ],
    });
  }

  onItemChange(i: number, x: FormGroup): void {
    this.spinner.show();
    var fValue = this.getFormValue() as DepositQueryCreateModel;
    var item = x.value as IDepositQueryTransactionModel;
    fValue.Transactions[i].Selected = true;
    fValue.Transactions[i].TrnAmount = item.TrnAmount;

    this.pService
      .OnItemChange(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        this.spinner.hide();
        if (!r.Success) {
          // this.Transactions.removeAt(0);
          r.Transactions.forEach((x, ind) => {
            if (ind == i) {
              x.TrnAmount = 0;
            }
          });
          this.transactionList = r.Transactions;
          this.ReloadTransactions(r.Transactions);
          alert(r.Message);
          return;
        }
        if (this.depositQueryForm.value.IsCashDeposit == 'false') {
          this.queryDataDetails.CorrAccDetails.RemainingBalance =
            fValue?.DepositQueryModel.CorrAccDetails.RemainingBalance -
            fValue.Transactions[i].TrnAmount;
        }
        this.transactionList = r.Transactions;
        this.ReloadTransactions(r.Transactions);
        if (this.transactionList.length - 1 != i) {
          setTimeout(
            () => document.getElementById(`TrnAmount${i + 1}`).focus(),
            100
          );
          console.log('Tran', this.transactionList);
        } else {
          document.getElementById(`update`).focus();
        }
      });
  }

  onAmountEnterHandler(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    if( i+1 == this.Transactions.length )
      setTimeout(() => document.getElementById(`update`).focus(), 100);
    setTimeout(() => document.getElementById(`TrnAmount${i + 1}`).focus(), 100);
    // this.spinner.show();
    // var fValue = this.getFormValue() as DepositQueryCreateModel;
    // var item = x.value as IDepositQueryTransactionModel;
    // fValue.Transactions[i].Selected = true;
    // fValue.Transactions[i].TrnAmount = item.TrnAmount;

    // this.pService
    //   .OnItemChange(fValue)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((r) => {
    //     if (!r.Success) {
    //       alert(r.Message);
    //     }
    //     this.spinner.hide();
    //     this.transactionList = r.Transactions;
    //     this.ReloadTransactions(r.Transactions);
    //     if (this.transactionList.length - 1 != i) {
    //       setTimeout(
    //         () => document.getElementById(`TrnAmount${i + 1}`).focus(),
    //         100
    //       );
    //       console.log('Tran', this.transactionList);
    //     } else {
    //       document.getElementById(`update`).focus();
    //     }
    //   });
  }

  onCreate(): void {

    if(!this.depositQueryForm.value.IsCashDeposit && (this.CorrAccNo==null || this.CorrAccBalance==null)){
      alert('Insufficent Corr. A/C Balance');
      return;
    }
    if (this.depositQueryForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    if (
      +this.queryDataDetails.CorrAccDetails.RemainingBalance <= 0 &&
      this.depositQueryForm.value.IsCashDeposit == 'false'
    ) {
      alert('Insufficent Corr. A/C Balance');
      return;
    }


    var fValue = this.getFormValue() as DepositQueryCreateModel;
    this.spinner.show();
    fValue.MemColCode = this.queryDataDetails.MemColCode;
    fValue.MemType = this.queryDataDetails.MemType;
    fValue.MemRegNo = this.queryDataDetails.MemRegNo;
    fValue.MemSubRegNo = this.queryDataDetails.MemSubRegNo;
    fValue.AutoVchflag = this.UserData.AutoVchflag;
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

        console.log(
          'this.inputHelpData.PrintFlag---->',
          this.inputHelpData.PrintFlag
        );
        alert(data.Message);
        if (
          this.inputHelpData.PrintFlag == 1 &&
          this.inputHelpData.PrintFOptFlag == 1
        ) {
          this.setParameter();
        } else {
          location.reload();
        }
      });
  }

  onCancel(): void {
    location.reload();
  }

  public getReportToken = () => {
    this.spinner.show();
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
  public setParameter(): void {
    var fValue = this.depositQueryForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName = 'CCULB_rptCSTransactionVchForDepositQuery';
    console.log('PushedVaalue:', fValue.MemberNo);
    this.reportModel.Values.push(
      new ReportKeyValue('MemberNo', fValue.MemberNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('MemberName', this.queryDataDetails.MemberName)
    );
    if (this.UserData?.AutoVchflag) {
      this.reportModel.Values.push(new ReportKeyValue('VchNo', this.VoucherNo));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('VchNo', fValue.VoucherNo)
      );
    }

    this.getReportToken();
  }

  public setParameter1(): void {
    var fValue = this.depositQueryForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName = 'rptCSDepositQueryTransaction';

    console.log('PushedVaalue:', fValue.MemberNo);
    this.reportModel.Values.push(
      new ReportKeyValue('MemberNo', fValue.MemberNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('MemberName', this.queryDataDetails.MemberName)
    );
    if (this.UserData?.AutoVchflag) {
      this.reportModel.Values.push(new ReportKeyValue('VchNo', this.VoucherNo));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('VchNo', fValue.VoucherNo)
      );
    }

    this.getReportToken();
  }


  public onEnterUpdateHandler(e: KeyboardEvent): void{
    if( e.keyCode != 13 ) return;
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;
    window.open(iFramePath, '_blank');
  };

  exitPage() {
    this.router.navigate(['accounting/']);
  }
}
