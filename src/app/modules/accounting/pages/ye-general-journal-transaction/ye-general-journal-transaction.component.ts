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
import { first, takeUntil } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { YeGeneralJournalTransactionService } from 'src/app/services/ye-general-journal-transaction.service';
import { environment } from 'src/environments/environment';
import { CashDataModel } from '../../models/general-journal-transaction.model';
import { getUserInfo } from 'src/app/selector/user.selectors';
import {
  GLCatagoryModel,
  YeGeneralJounalTrnDepositTrnModel,
  YeGeneralJournalTrnSavedData,
} from '../../models/ye-general-journal-transaction.model';
import { UserInfo } from 'src/app/Models/Common.model';

@Component({
  selector: 'app-ye-general-journal-transaction',
  templateUrl: './ye-general-journal-transaction.component.html',
  styleUrls: ['./ye-general-journal-transaction.component.css'],
})
export class YeGeneralJournalTransactionComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  totalCreditAmount: number = 0;
  totalDebitAmount: number = 0;
  CashDataAll: CashDataModel;
  showEdit: boolean = false;
  yeGrneralJournalTransactionForm: FormGroup;
  public DepositTransactions: FormArray;
  TransactionTypeEnum: IdDescription[] = [];
  SavedTransactions: YeGeneralJournalTrnSavedData[] = [];
  BankCodeList: IdDescription[] = [];
  GLCatagory: GLCatagoryModel[] = [];
  GLCodeList: GLCatagoryModel[] = [];
  DepositTransactionData: YeGeneralJounalTrnDepositTrnModel[] = [];
  showGLCatagory: boolean = false;
  backGLCode: number = 0;
  showForm: boolean = true;
  showGLCode: boolean = false;
  showBank: boolean = false;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  UserData: UserInfo;
  VPrintFlag: any;
  VPrintFOptFlag: any;
  temporary: YeGeneralJounalTrnDepositTrnModel = new YeGeneralJounalTrnDepositTrnModel();
  storeVoucherNo: any;

  constructor(
    private yeGeneralJournalTrnService: YeGeneralJournalTransactionService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private aService: ReportCommonService,
    private store: Store
  ) {
    this.reportModel.ReportName = 'rptGLTransactionVchForYeGLTrn';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.showBank = false;
    this.showEdit = false;
    this.showGLCatagory = false;
    this.backGLCode = 0;
    this.showGLCode = false;
    this.store.pipe(select(getUserInfo)).subscribe((userInfo: UserInfo) => {
      this.UserData = userInfo;
    });
    this.initializeForm();
  }

  initializeForm() {
    this.yeGrneralJournalTransactionForm = this.fb.group({
      TrnMode: new FormControl('0'),
      CashCode: new FormControl(''),
      CashCodeDesc: new FormControl(''),
      CtrlProcDate: new FormControl(''),
      CtrlPrmGLAutoVchCtrl: new FormControl(''),
      CtrlPrmAutoVchFlag: new FormControl(''),
      TransactionType: new FormControl(''),
      TransactionTypeDDL: new FormControl('0'),
      BankType: new FormControl(''),

      ChequeNo: new FormControl(''),
      ChequeDescription: new FormControl(''),
      VoucherNo: new FormControl('', [Validators.required]),
      TotalDebitAmount: new FormControl(''),
      TotalCreditAmount: new FormControl(''),
      DepositTransactions: this.fb.array([]),
      VoucherDate: new FormControl(''),
    });
    this.onPageLoad();
  }
  onPageLoad() {
    this.spinner.show();
    this.yeGeneralJournalTrnService
      .generalJournalTrnPageLoad()
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log('AllData--->', x);
          this.TransactionTypeEnum = x.TransactionType;
          this.BankCodeList = x.BankCodeList;
          this.DepositTransactionData = x.DepositTransactions;
          this.VPrintFlag = x.VPrintFlag;
          this.VPrintFOptFlag = x.VPrintFOptFlag;
          console.log('VPrintFlag', this.VPrintFlag);
          console.log('this.VPrintFOptFlag', this.VPrintFOptFlag);
          this.yeGrneralJournalTransactionForm.controls['VoucherDate'].setValue(
            x.VoucherDate
          );
          x.DepositTransactions.forEach((data) => {
            this.addItem(data);
          });
          this.GLCatagory = x.GLCatagory;
          this.CashDataAll = x.CashDataAll;
          this.SavedTransactions = x.SavedTransactions;
          this.spinner.hide();
          setTimeout(
            () => document.getElementById(`TransactionTypeSet`).focus(),
            100
          );
        },
        (err) => {
          this.spinner.hide();
          alert('Something went wrong.');
        }
      );
    setTimeout(
      () => document.getElementById(`TransactionTypeSet`).focus(),
      100
    );
  }

  public addItem(x: YeGeneralJounalTrnDepositTrnModel): void {
    this.DepositTransactions = this.yeGrneralJournalTransactionForm.get(
      'DepositTransactions'
    ) as FormArray;
    this.DepositTransactions.push(this.AddToDepositedAccount(x));
    //this.getAccountDetails(x.AccNo);
  }

  private AddToDepositedAccount(
    x: YeGeneralJounalTrnDepositTrnModel
  ): FormGroup {
    return this.fb.group({
      GLAccNo: [x.GLAccNo == 0 ? '' : x.GLAccNo],
      GLAccDesc: [x.GLAccDesc],
      GLCreditAmt: [x.GLAccNo == 0 ? '' : x.GLCreditAmt],
      GLDebitAmt: [x.GLAccNo == 0 ? '' : x.GLDebitAmt],
      MarkRecord: [x.MarkRecord],
      TrnDesc: [x.TrnDesc],
      Id: [x.Id],
    });
  }

  showGLCodePress() {
    this.showGLCatagory = true;
    this.showForm = false;
    this.backGLCode += 1;
  }
  backGLCodePress() {
    console.log(this.backGLCode);
    if (this.backGLCode == 1) {
      this.showGLCatagory = false;
      this.showForm = true;
      this.backGLCode -= 1;
    } else {
      this.showGLCode = false;
      this.showGLCatagory = true;
      this.backGLCode -= 1;
    }
  }
  slectedCatagory(data: any) {
    //console.log(data);
    this.yeGeneralJournalTrnService
      .generalJournalGLCodeFind(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log(x);
          this.GLCodeList = x;
          this.showGLCode = true;
          this.showGLCatagory = false;
          this.backGLCode += 1;
        },
        (err) => {
          this.spinner.hide();
          alert('Something went wrong.');
        }
      );
  }

  changeTrnType(event: any) {
    let selectedCode = this.TransactionTypeEnum.find(
      (x) => x.Id == event.target.value
    );
    if (!selectedCode) {
      alert('Please Enter a valid Transaction Type');
    } else {
      if (event.target.value == '48') {
        this.showBank = true;
      } else {
        this.showBank = false;
      }
      this.yeGrneralJournalTransactionForm.controls['TransactionType'].setValue(
        event.target.value
      );
      this.yeGrneralJournalTransactionForm.controls[
        'TransactionTypeDDL'
      ].setValue(event.target.value);

      if (this.UserData?.AutoVchflag) {
        setTimeout(
          () => document.getElementById(`GLAccNoSet${0}`).focus(),
          100
        );
      } else {
        setTimeout(() => document.getElementById(`VoucherNoSet`).focus(), 100);
      }
    }
  }

  GlAccNoChangeHandler(event: any, i: number, item: FormGroup) {
    if (!event.target.value) return;
    if (this.yeGrneralJournalTransactionForm.value.TransactionType == '0') {
      alert('Please Enter Transaction Type');
      return;
    }
    this.yeGeneralJournalTrnService
      .generalJournalGLCodeInfo(+event.target.value)
      .pipe(first())
      .subscribe(
        (x: any) => {
          if (!x.Success) {
            alert('Invalid GL Code');
            return;
          }
          this.DepositTransactions = this.yeGrneralJournalTransactionForm.get(
            'DepositTransactions'
          ) as FormArray;
          var temp = this.DepositTransactions.value[
            this.DepositTransactions.length - 1
          ];
          this.DepositTransactions.removeAt(
            this.DepositTransactions.length - 1
          );

          this.temporary.GLAccNo = x.GLAccNo;
          this.temporary.GLAccDesc = x.GLAccDesc;
          this.temporary.GLCreditAmt = 0;
          this.temporary.GLDebitAmt = 0;
          this.temporary.MarkRecord = temp.MarkRecord;
          this.temporary.TrnDesc = temp.TrnDesc;
          this.temporary.Id = temp.Id;
          this.addItem(this.temporary);
          var len = this.DepositTransactions.length;
          setTimeout(
            () => document.getElementById(`TrnDescSet${len - 1}`).focus(),
            100
          );
        },
        (err) => {
          this.spinner.hide();
          alert('Something went wrong.');
        }
      );
  }

  onEnterGLAccNoHandler(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    if (x.value.GLAccNo != '') {
    } else {
      setTimeout(() => document.getElementById('btnUpdate').focus(), 1000);
    }
  }

  addToDepositTemp(data: any) {
    this.showForm = true;
    this.showGLCatagory = false;
    this.showGLCode = false;
    if (this.yeGrneralJournalTransactionForm.value.TransactionType == '0') {
      alert('Please Enter Transaction Type');
    } else {
      this.addToTable(data);
      var len = this.DepositTransactions.length;
      console.log(len);
      setTimeout(
        () => document.getElementById(`TrnDescSet${len - 1}`).focus(),
        100
      );
    }
  }

  addToTable(data: any) {
    let selectedCode = this.GLCodeList.find((x) => x.GLAccNo == data.GLAccNo);
    this.DepositTransactions = this.yeGrneralJournalTransactionForm.get(
      'DepositTransactions'
    ) as FormArray;
    var temp = this.DepositTransactions.value[
      this.DepositTransactions.length - 1
    ];
    this.DepositTransactions.removeAt(this.DepositTransactions.length - 1);

    this.temporary.GLAccNo = selectedCode.GLAccNo;
    this.temporary.GLAccDesc = selectedCode.GLAccDesc;
    this.temporary.GLCreditAmt = 0;
    this.temporary.GLDebitAmt = 0;
    this.temporary.MarkRecord = temp.MarkRecord;
    this.temporary.TrnDesc = temp.TrnDesc;
    this.temporary.Id = temp.Id;
    this.addItem(this.temporary);
  }

  reshapeData(index: number, check: number) {
    var tempListAfter = [];
    for (var i = index + 1; i < this.DepositTransactions.value.length; i++) {
      tempListAfter.push(this.DepositTransactions.value[i]);
    }
    while (this.DepositTransactions.value.length - 1 > index) {
      this.DepositTransactions.removeAt(
        this.DepositTransactions.value.length - 1
      );
    }
    var temp = this.DepositTransactions.value[index];
    //console.log(this.DepositTransactions.value);
    this.DepositTransactions.removeAt(index);
    //console.log(this.DepositTransactions.value);
    this.temporary.GLAccNo = temp.GLAccNo;
    this.temporary.GLAccDesc = temp.GLAccDesc;
    this.temporary.GLCreditAmt = check == 1 ? Number(temp.GLCreditAmt) : 0;
    this.temporary.GLDebitAmt = check == 2 ? Number(temp.GLDebitAmt) : 0;
    this.temporary.MarkRecord = temp.MarkRecord;
    this.temporary.TrnDesc = temp.TrnDesc;
    this.temporary.Id = temp.Id;
    this.addItem(this.temporary);
    for (var i = 0; i < tempListAfter.length; i++) {
      this.addItem(tempListAfter[i]);
    }
  }

  onChangeDesc(i: number, x: FormGroup) {
    if (x.value.TrnDesc == '') {
      alert('Please give the description');
    } else {
      if (x.value.GLDebitAmt != '') {
        this.onChangeDebit(i, x);
      } else if (x.value.GLCreditAmt != '') {
        this.onChangeCredit(i, x);
      } else {
        setTimeout(
          () => document.getElementById(`GLDebitAmtSet${i}`).focus(),
          100
        );
      }
    }
  }

  onChangeDebit(i: number, x: FormGroup) {
    if (
      this.yeGrneralJournalTransactionForm.value.DepositTransactions[i]
        .GLCreditAmt != '0'
    ) {
      this.reshapeData(i, 1);
      return;
    }
    var item = x.value as YeGeneralJounalTrnDepositTrnModel;
    if (
      this.yeGrneralJournalTransactionForm.value.DepositTransactions[i]
        .TrnDesc == ''
    ) {
      alert('Please give the description');
    } else if (i != 0) {
      if (
        (this.yeGrneralJournalTransactionForm.value.DepositTransactions[i - 1]
          .GLDebitAmt == 0 ||
          this.yeGrneralJournalTransactionForm.value.DepositTransactions[i - 1]
            .GLDebitAmt == '') &&
        this.yeGrneralJournalTransactionForm.value.TransactionType != '3' &&
        this.yeGrneralJournalTransactionForm.value.TransactionType != '4'
      ) {
        alert('Not Allowed Debit Transaction');
        setTimeout(
          () => document.getElementById(`GLCreditAmtSet${i}`).focus(),
          100
        );
        this.reshapeData(i, 1);
      } else {
        this.addToTempData(i, x);
        setTimeout(
          () => document.getElementById(`GLAccNoSet${i + 1}`).focus(),
          1000
        );
      }
    } else {
      this.addToTempData(i, x);
      setTimeout(
        () => document.getElementById(`GLAccNoSet${i + 1}`).focus(),
        1000
      );
    }
  }

  onEnterGLDebitAmtHandler(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    var val = this.DepositTransactions.length;
    console.log('This is debit value', x.value.GLDebitAmt);
    if (x.value.GLDebitAmt != '0') {
      setTimeout(
        () => document.getElementById(`GLAccNoSet${val}`).focus(),
        1000
      );
    } else {
      setTimeout(
        () => document.getElementById(`GLCreditAmtSet${i}`).focus(),
        1000
      );
    }
  }

  onChangeCredit(i: number, x: FormGroup) {
    console.log('here', i);
    if (
      this.yeGrneralJournalTransactionForm.value.DepositTransactions[i]
        .GLDebitAmt != '0'
    ) {
      this.reshapeData(i, 2);
      return;
    }
    var item = x.value as YeGeneralJounalTrnDepositTrnModel;
    if (
      this.yeGrneralJournalTransactionForm.value.DepositTransactions[i]
        .TrnDesc == ''
    ) {
      alert('Please give the description');
    } else if (i != 0) {
      console.log('coming here');
      console.log(
        this.yeGrneralJournalTransactionForm.value.DepositTransactions[i]
          .GLCreditAmt
      );
      console.log(this.yeGrneralJournalTransactionForm.value.TransactionType);
      if (
        (this.yeGrneralJournalTransactionForm.value.DepositTransactions[i - 1]
          .GLCreditAmt == '0' ||
          this.yeGrneralJournalTransactionForm.value.DepositTransactions[i - 1]
            .GLCreditAmt == '') &&
        this.yeGrneralJournalTransactionForm.value.TransactionType != '3' &&
        this.yeGrneralJournalTransactionForm.value.TransactionType != '4'
      ) {
        alert('Not Allowed Credit Transaction');
        setTimeout(
          () => document.getElementById(`GLDebitAmtSet${i}`).focus(),
          100
        );
        this.reshapeData(i, 2);
      } else {
        this.addToTempData(i, x);
        setTimeout(
          () => document.getElementById(`GLAccNoSet${i + 1}`).focus(),
          1000
        );
      }
    } else {
      this.addToTempData(i, x);
      setTimeout(
        () => document.getElementById(`GLAccNoSet${i + 1}`).focus(),
        1000
      );
    }
  }
  addToTempData(i: number, x: FormGroup) {
    var item = x.value as YeGeneralJounalTrnDepositTrnModel;
    var data = {
      Id: this.yeGrneralJournalTransactionForm.value.DepositTransactions[i].Id,
      CtrlProcDate: this.CashDataAll.CtrlProcDate,
      TrnTypeDes: this.yeGrneralJournalTransactionForm.value.TransactionType,
      GLAccNo: this.yeGrneralJournalTransactionForm.value.DepositTransactions[i]
        .GLAccNo,
      TrnDesc: this.yeGrneralJournalTransactionForm.value.DepositTransactions[i]
        .TrnDesc,
      GLAccDesc: this.yeGrneralJournalTransactionForm.value.DepositTransactions[
        i
      ].GLAccDesc,
      GLDebitAmt: this.yeGrneralJournalTransactionForm.value
        .DepositTransactions[i].GLDebitAmt,
      GLCreditAmt: this.yeGrneralJournalTransactionForm.value
        .DepositTransactions[i].GLCreditAmt,
      MarkRecord: this.yeGrneralJournalTransactionForm.value
        .DepositTransactions[i].MarkRecord,
      CashCode: this.CashDataAll.CashCode,
      IsUpdateSelf: i == this.DepositTransactions.length - 1 ? false : true,
    };
    console.log(data);
    this.yeGeneralJournalTrnService
      .generalJournalAddAndGetTempData(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.DepositTransactionData = x;
          console.log(x);
          this.DepositTransactions = this.yeGrneralJournalTransactionForm.get(
            'DepositTransactions'
          ) as FormArray;
          while (this.DepositTransactions.length !== 0) {
            this.DepositTransactions.removeAt(0);
          }
          this.totalCreditAmount = 0;
          this.totalDebitAmount = 0;
          this.DepositTransactionData.forEach((data) => {
            this.totalCreditAmount += data.GLCreditAmt;
            this.totalDebitAmount += data.GLDebitAmt;
            this.yeGrneralJournalTransactionForm.controls[
              'TotalDebitAmount'
            ].setValue(
              this.totalDebitAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })
            );
            this.yeGrneralJournalTransactionForm.controls[
              'TotalCreditAmount'
            ].setValue(
              this.totalCreditAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })
            );
            this.addItem(data);
          });
          console.log(this.DepositTransactionData);
        },
        (err) => {
          this.spinner.hide();
          alert('Something went wrong.');
        }
      );
  }

  updateVerify() {
    if (
      this.yeGrneralJournalTransactionForm.value.TransactionType == '3' &&
      this.totalDebitAmount != this.totalCreditAmount
    ) {
      alert('Total Debit & Credit Not Equal');
      return;
    }

    if (
      this.yeGrneralJournalTransactionForm.value.TransactionType == '0' ||
      this.yeGrneralJournalTransactionForm.value.TransactionType == ''
    ) {
      alert('Please Enter Transaction Type');
    } else if (
      this.yeGrneralJournalTransactionForm.value.VoucherNo == '' &&
      !this.UserData?.AutoVchflag
    ) {
      alert('Please Enter Voucher No');
    } else if (
      this.yeGrneralJournalTransactionForm.value.TransactionType == '48'
    ) {
      if (
        this.yeGrneralJournalTransactionForm.value.BankType == '' ||
        this.yeGrneralJournalTransactionForm.value.BankType == '0'
      ) {
        alert('Please Enter Bank Type');
      } else if (this.yeGrneralJournalTransactionForm.value.ChequeNo == '') {
        alert('Please Enter Cheque No');
      } else if (this.yeGrneralJournalTransactionForm.value.Description == '') {
        alert('Please Enter Cheque Description');
      } else {
        this.updateData();
      }
    } else if (this.totalDebitAmount == 0 && this.totalCreditAmount == 0) {
      alert('No Debit or Credit Added');
    } else {
      this.updateData();
    }
  }
  updateData() {
    this.yeGrneralJournalTransactionForm.controls['CashCode'].setValue(
      this.CashDataAll.CashCode
    );
    this.yeGrneralJournalTransactionForm.controls['CashCodeDesc'].setValue(
      this.CashDataAll.CashCodeDesc
    );
    this.yeGrneralJournalTransactionForm.controls[
      'CtrlPrmAutoVchFlag'
    ].setValue(this.CashDataAll.CtrlPrmAutoVchFlag);
    this.yeGrneralJournalTransactionForm.controls[
      'CtrlPrmGLAutoVchCtrl'
    ].setValue(this.CashDataAll.CtrlPrmGLAutoVchCtrl);
    this.yeGrneralJournalTransactionForm.controls['CtrlProcDate'].setValue(
      this.CashDataAll.CtrlProcDate
    );

    console.log(this.yeGrneralJournalTransactionForm.value);
    this.yeGeneralJournalTrnService
      .generalJournalFinalUpdateData(this.yeGrneralJournalTransactionForm.value)
      .pipe(first())
      .subscribe(
        (x: any) => {
          if (x.Success) {
            this.storeVoucherNo = x.VoucherNo;
            alert(x.Message);
            console.log('This is update call data :', x);
            if (this.VPrintFlag == 1 && this.VPrintFOptFlag == 1) {
              this.getReportToken();
            }
            this.ngOnInit();
          } else {
            alert('Data did not updated.');
          }
        },
        (err) => {
          this.spinner.hide();
          alert('Something went wrong.');
        }
      );
  }

  checkVoucher(event: any) {
    if (
      this.yeGrneralJournalTransactionForm.value.TransactionType == '0' ||
      this.yeGrneralJournalTransactionForm.value.TransactionType == ''
    ) {
      alert('Please Enter Transaction Type');
      this.yeGrneralJournalTransactionForm.controls['VoucherNo'].setValue('');
    } else {
      let selectedCode = this.SavedTransactions.find(
        (x) => x.VchNo == event.target.value
      );
      if (selectedCode) {
        this.showEdit = true;
      } else {
        this.showEdit = false;
      }
      var len = this.DepositTransactions.length;
      setTimeout(
        () => document.getElementById(`GLAccNoSet${len - 1}`).focus(),
        100
      );
    }
  }
  modalYes() {
    this.showEdit = false;
    console.log('coming here');
    this.DepositTransactions = this.yeGrneralJournalTransactionForm.get(
      'DepositTransactions'
    ) as FormArray;
    while (this.DepositTransactions.length !== 0) {
      this.DepositTransactions.removeAt(0);
    }
    this.yeGeneralJournalTrnService
      .generalJournalEditVoucharData(
        this.yeGrneralJournalTransactionForm.value.VoucherNo
      )
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log(x);
          x.forEach((data) => {
            this.addItem(data);
          });
          this.SavedTransactions = x;
          console.log(this.SavedTransactions);
        },
        (err) => {
          this.spinner.hide();
          alert('Something went wrong.');
        }
      );
  }
  modalNo() {
    this.showEdit = false;
    this.yeGrneralJournalTransactionForm.controls['VoucherNo'].setValue('');
  }

  exitPage() {
    this.router.navigate(['accounting/']);
  }
  cancelPage() {
    this.ngOnInit();
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
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setParameter(): void {
    var fValue = this.yeGrneralJournalTransactionForm.value;
    this.reportModel.Values = [];

    if (fValue.TransactionType == 1) {
      this.reportModel.Values.push(new ReportKeyValue('TrnTitle', 'CASH'));
    } else if (fValue.TransactionType == 48) {
      this.reportModel.Values.push(new ReportKeyValue('TrnTitle', 'BANK'));
      this.reportModel.Values.push(
        new ReportKeyValue('BankCode', fValue.BankType)
      );
      let selectedBank = this.BankCodeList.find((x) => x.Id == fValue.BankType);
      this.reportModel.Values.push(
        new ReportKeyValue('BankCodeDesc', selectedBank.Description)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('ChequeDescription', fValue.ChequeDescription)
      );
    } else if (fValue.TransactionType == 3) {
      this.reportModel.Values.push(new ReportKeyValue('TrnTitle', 'TRANSFER'));
    } else {
      this.reportModel.Values.push(new ReportKeyValue('TrnTitle', ' '));
    }

    this.reportModel.Values.push(
      new ReportKeyValue('TransactionType', fValue.TransactionType)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('VchNo', this.storeVoucherNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('CashCode', fValue.CashCode)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('CashCodeDesc', fValue.CashCodeDesc)
    );

    console.log(this.reportModel.Values);
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };
  changeBankCode(event: any) {
    let selectedCode = this.BankCodeList.find(
      (x) => x.Id == event.target.value
    );
    if (selectedCode) {
      this.yeGrneralJournalTransactionForm.controls['BankType'].setValue(
        event.target.value
      );
      // this.yeGrneralJournalTransactionForm.controls['BankTypeDesc'].setValue(
      //   event.target.value
      // );
    } else {
      alert('Please enter a valid Bank Type');
    }
  }
}
