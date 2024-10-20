import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first, takeUntil } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import { GeneralJournalTransactionService } from 'src/app/services/general-journal-transaction.service';
import {
  CashDataModel,
  GLCodeDropDownModel,
  GvDepositTrnInfoModel,
  TransactionGridViewInfoModel,
} from '../../models/general-journal-transaction.model';
import { environment } from 'src/environments/environment';
import { ReportCommonService } from 'src/app/services/report-common.service';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { Subject } from 'rxjs';
import { YeGeneralJournalTransactionService } from 'src/app/services/ye-general-journal-transaction.service';

@Component({
  selector: 'app-general-journal-transaction',
  templateUrl: './general-journal-transaction.component.html',
  styleUrls: ['./general-journal-transaction.component.css'],
})
export class GeneralJournalTransactionComponent implements OnInit {
  module: string = '1';
  TransactionTypeEnum: IdDescription[] = [];
  GLCodeDropDown: GLCodeDropDownModel[] = [];
  GLBankCodeDropDown: GLCodeDropDownModel[] = [];
  GLCashCodeDropDown: GLCodeDropDownModel[] = [];
  grneralJournalTransactionForm: FormGroup;
  GvDepositTransInformation: GvDepositTrnInfoModel[] = [];
  TransactionGridViewInfo: TransactionGridViewInfoModel[] = [];
  showCash: boolean = false;
  showBank: boolean = false;
  temporary: GvDepositTrnInfoModel = new GvDepositTrnInfoModel();
  CashDataAll: CashDataModel;
  totalDebitAmount: number = 0;
  totalCreditAmount: number = 0;
  isDuplicate: boolean = false;
  public VoucherList: FormArray;
  showVoucher: boolean = false;
  ctrlVoucherFlag: number;
  showEdit = false;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  private destroy$: Subject<void> = new Subject<void>();
  Voucher: string = '';
  PrintFlag: any;
  PrintFOptFlag: any;

  constructor(
    private yeGeneralJournalTrnService: YeGeneralJournalTransactionService,
    private generalJournalTrnService: GeneralJournalTransactionService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private aService: ReportCommonService
  ) {
    this.reportModel.ReportName = 'CCULB_rptGLTransactionVch3';
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
    this.Voucher = '';
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
    this.isDuplicate = false;
    this.showBank = false;
    this.showCash = false;
    this.showEdit = false;
    this.showVoucher = false;
    this.initializeForm();
  }
  onPageLoad() {
    this.spinner.show();
    this.generalJournalTrnService
      .generalJournalTrnPageNewLoad(this.module)
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log('Alll Data--->>>', x);
          this.PrintFlag = x.PrintFlag;
          this.PrintFOptFlag = x.PrintFOptFlag;
          this.TransactionTypeEnum = x.TrancsactionTypeDropDown;
          this.GLCodeDropDown = x.GLCodeDropDown;
          this.GLBankCodeDropDown = x.GLBankCodeDropDown;
          this.GLCashCodeDropDown = x.GLCashCodeDropDown;
          this.CashDataAll = x.CashDataAll;
          this.ctrlVoucherFlag = this.CashDataAll.CtrlPrmAutoVchFlag;
          if (this.ctrlVoucherFlag == 1) {
            this.showVoucher = false;
          } else {
            this.showVoucher = true;
          }
          this.GvDepositTransInformation = x.GvDepositTransIformation;
          this.grneralJournalTransactionForm.controls[
            'GLCashCodeDesc'
          ].setValue(this.GLCashCodeDropDown[0].GLAccDesc);
          this.grneralJournalTransactionForm.controls['GLCashCode'].setValue(
            this.GLCashCodeDropDown[0].GLAccNo
          );
          this.TransactionGridViewInfo = x.TransactionGridViewInfo;
          x.GvDepositTransIformation.forEach((data) => {
            this.addItem(data);
          });
          this.grneralJournalTransactionForm.controls['CashCode'].setValue(
            this.CashDataAll.CashCode
          );
          this.grneralJournalTransactionForm.controls['CashCodeDesc'].setValue(
            this.CashDataAll.CashCodeDesc
          );
          this.grneralJournalTransactionForm.controls['CtrlProcDate'].setValue(
            this.CashDataAll.CtrlProcDate
          );
          this.grneralJournalTransactionForm.controls[
            'CtrlPrmGLAutoVchCtrl'
          ].setValue(this.CashDataAll.CtrlPrmGLAutoVchCtrl);
          this.grneralJournalTransactionForm.controls[
            'CtrlPrmAutoVchFlag'
          ].setValue(this.CashDataAll.CtrlPrmAutoVchFlag);
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
  }
  initializeForm() {
    this.grneralJournalTransactionForm = this.fb.group({
      TrnMode: new FormControl('0'),
      CashCode: new FormControl(''),
      CashCodeDesc: new FormControl(''),
      CtrlProcDate: new FormControl(''),
      CtrlPrmGLAutoVchCtrl: new FormControl(''),
      CtrlPrmAutoVchFlag: new FormControl(''),
      TransactionType: new FormControl('0'),
      BankType: new FormControl('0'),
      ChequeNo: new FormControl(''),
      ChequeDescription: new FormControl(''),
      VoucherNo: new FormControl('', [Validators.required]),
      GLCodeDropDown: new FormControl(''),
      GLCashCode: new FormControl(''),
      GLCashCodeDesc: new FormControl(''),
      TotalDebitAmount: new FormControl(''),
      TotalCreditAmount: new FormControl(''),
      VoucherList: this.fb.array([]),
      ModuleNo: new FormControl(''),
    });
    this.onPageLoad();
  }

  public addItem(x: any): void {
    this.VoucherList = this.grneralJournalTransactionForm.get(
      'VoucherList'
    ) as FormArray;
    this.VoucherList.push(this.AddToDepositedAccount(x));
    //this.getAccountDetails(x.AccNo);
  }

  private AddToDepositedAccount(x: GvDepositTrnInfoModel): FormGroup {
    return this.fb.group({
      GLAccNo: [x.GLAccNo == 0 ? '' : x.GLAccNo],
      GLAccDesc: [x.GLAccDesc],
      GLAccType: [x.GLAccType],
      GLCreditAmt: [x.GLAccNo == 0 ? '' : x.GLCreditAmt],
      GLDebitAmt: [x.GLAccNo == 0 ? '' : x.GLDebitAmt],
      MarkRecord: [x.MarkRecord],
      TrnDesc: [x.TrnDesc],
      Id: [x.Id],
    });
  }

  selectChangeHandler(event: any) {
    var val = event.target.value;
    var splitted = val.split(' ', 1);
    event.target.value = splitted[0];
    let selectedCode = this.GvDepositTransInformation.find(
      (x) => x.GLAccNo == event.target.value
    );
    if (this.grneralJournalTransactionForm.value.TransactionType == '0') {
      alert('Please Select Transaction Type');
      this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
        ''
      );
    } else if (
      this.grneralJournalTransactionForm.value.TransactionType == '48'
    ) {
      if (this.grneralJournalTransactionForm.value.BankType == '0') {
        alert('Please Select Bank Code');
        this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
          ''
        );
      } else if (this.grneralJournalTransactionForm.value.ChequeNo == '') {
        alert('Please Enter Cheque No');
        this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
          ''
        );
      } else if (
        this.grneralJournalTransactionForm.value.ChequeDescription == ''
      ) {
        alert('Please Enter Cheque Description');
        this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
          ''
        );
      } else if (
        this.grneralJournalTransactionForm.value.VoucherNo == '' &&
        this.showVoucher == true
      ) {
        alert('Please Enter Voucher No');
        this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
          ''
        );
      } else if (
        this.grneralJournalTransactionForm.value.BankType == event.target.value
      ) {
        alert('Not Allowed Bank GL Code');
        this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
          ''
        );
      } else if (selectedCode) {
        if (this.isDuplicate) {
          this.addToTable(event);
          this.grneralJournalTransactionForm.controls[
            'GLCodeDropDown'
          ].setValue('');
        } else {
          alert('Duplicate GL Code');
          this.grneralJournalTransactionForm.controls[
            'GLCodeDropDown'
          ].setValue('');
        }
      } else {
        if (selectedCode) {
          if (this.isDuplicate) {
            this.addToTable(event);
            this.grneralJournalTransactionForm.controls[
              'GLCodeDropDown'
            ].setValue('');
          } else {
            alert('Duplicate GL Code');
            this.grneralJournalTransactionForm.controls[
              'GLCodeDropDown'
            ].setValue('');
          }
        } else {
          this.addToTable(event);
          this.grneralJournalTransactionForm.controls[
            'GLCodeDropDown'
          ].setValue('');
        }
      }
    } else if (
      this.grneralJournalTransactionForm.value.VoucherNo == '' &&
      this.showVoucher == true
    ) {
      alert('Please Enter Voucher No');
      this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
        ''
      );
    } else {
      if (selectedCode) {
        if (this.isDuplicate) {
          this.addToTable(event);
          this.grneralJournalTransactionForm.controls[
            'GLCodeDropDown'
          ].setValue('');
        } else {
          alert('Duplicate GL Code');
          this.grneralJournalTransactionForm.controls[
            'GLCodeDropDown'
          ].setValue('');
        }
      } else {
        this.addToTable(event);
        this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
          ''
        );
      }
    }
  }
  GlAccNoChangeHandler(event: any, i: number, item: FormGroup) {
    if (!event.target.value) return;
    if( event.keyCode == 13 ) return;
    if (this.grneralJournalTransactionForm.value.TransactionType == '0') {
      alert('Please Select Transaction Type');
      this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
        ''
      );
      return;
    } else if (
      this.grneralJournalTransactionForm.value.TransactionType == '48'
    ) {
      if (this.grneralJournalTransactionForm.value.BankType == '0') {
        alert('Please Select Bank Code');
        this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
          ''
        );
        return;
      } else if (this.grneralJournalTransactionForm.value.ChequeNo == '') {
        alert('Please Enter Cheque No');
        this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
          ''
        );
        return;
      } else if (
        this.grneralJournalTransactionForm.value.ChequeDescription == ''
      ) {
        alert('Please Enter Cheque Description');
        this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
          ''
        );
        return;
      } else if (
        this.grneralJournalTransactionForm.value.VoucherNo == '' &&
        this.showVoucher == true
      ) {
        alert('Please Enter Voucher No');
        this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
          ''
        );
        return;
      } else if (
        this.grneralJournalTransactionForm.value.BankType == event.target.value
      ) {
        alert('Not Allowed Bank GL Code');
        this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
          ''
        );
        return;
      }
    } else if (
      this.grneralJournalTransactionForm.value.VoucherNo == '' &&
      this.showVoucher == true
    ) {
      alert('Please Enter Voucher No');
      this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
        ''
      );
      return;
    }

    var selectedCode;
    if (event.target.value.length == 6) {
      selectedCode = this.GLCodeDropDown.find(
        (x) => x.GLAccNo.toString().slice(2, 8) == event.target.value
      );
    } else if (event.target.value.length == 8) {
      selectedCode = this.GLCodeDropDown.find(
        (x) => x.GLAccNo == event.target.value
      );
    } else {
      if (!event.target.value) alert('Invalid GL Code!');
      return;
    }

    // this.yeGeneralJournalTrnService
    //   .generalJournalGLCodeInfo(+event.target.value)
    //   .pipe(first())
    //   .subscribe((x: any) => {
    //     if (!x.Success) {
    //       alert('Invalid GL Code');
    //       return;
    //     }
    //   },(err)=>{
    //     this.spinner.hide();
    //     alert('Something went wrong.')
    //   });

    var selectedCode1 = this.GvDepositTransInformation.find(
      (x) => x.GLAccNo == event.target.value
    );
    if (!this.isDuplicate && selectedCode1) {
      alert('Duplicate GL Code');
      this.grneralJournalTransactionForm.controls['GLCodeDropDown'].setValue(
        ''
      );
      this.clearData(i, 0);
      var len = this.VoucherList.length;
      setTimeout(() => document.getElementById(`GLAccNoSet${i}`).focus(), 100);
      return;
    }

    this.VoucherList = this.grneralJournalTransactionForm.get(
      'VoucherList'
    ) as FormArray;
    var temp = this.VoucherList.value[this.VoucherList.length - 1];
    this.VoucherList.removeAt(this.VoucherList.length - 1);

    this.temporary.GLAccNo = selectedCode.GLAccNo;
    this.temporary.GLAccDesc = selectedCode.GLAccDesc;
    this.temporary.GLAccType = temp.GLAccType;
    this.temporary.GLCreditAmt = 0;
    this.temporary.GLDebitAmt = 0;
    this.temporary.MarkRecord = temp.MarkRecord;
    this.temporary.TrnDesc = temp.TrnDesc;
    this.temporary.Id = temp.Id;
    console.log(this.VoucherList.length);
    var len = this.VoucherList.length;
    setTimeout(() => document.getElementById(`TrnDescSet${len}`).focus(), 100);
    this.addItem(this.temporary);
  }

  addToTable(event: any) {
    let selectedCode = this.GLCodeDropDown.find(
      (x) => x.GLAccNo == event.target.value
    );
    this.VoucherList = this.grneralJournalTransactionForm.get(
      'VoucherList'
    ) as FormArray;
    var temp = this.VoucherList.value[this.VoucherList.length - 1];
    this.VoucherList.removeAt(this.VoucherList.length - 1);

    this.temporary.GLAccNo = selectedCode.GLAccNo;
    this.temporary.GLAccDesc = selectedCode.GLAccDesc;
    this.temporary.GLAccType = temp.GLAccType;
    this.temporary.GLCreditAmt = 0;
    this.temporary.GLDebitAmt = 0;
    this.temporary.MarkRecord = temp.MarkRecord;
    this.temporary.TrnDesc = temp.TrnDesc;
    this.temporary.Id = temp.Id;
    console.log(this.VoucherList.length);
    var len = this.VoucherList.length;
    setTimeout(() => document.getElementById(`TrnDescSet${len}`).focus(), 100);
    this.addItem(this.temporary);
  }

  changeTrnType(event: any) {
    let selectedCode = this.TransactionTypeEnum.find(
      (x) => x.Id == event.target.value
    );
    if (selectedCode) {
      this.grneralJournalTransactionForm.controls['TransactionType'].setValue(
        event.target.value
      );
      if (event.target.value == '1') {
        this.showCash = true;
        this.showBank = false;
      } else if (event.target.value == '48') {
        this.grneralJournalTransactionForm.controls['TransactionType'].setValue(
          event.target.value
        );
        this.showBank = true;
        this.showCash = false;
      } else {
        this.showBank = false;
        this.showCash = false;
      }

      if (this.showVoucher == false) {
        var len = this.VoucherList.length;
        setTimeout(
          () => document.getElementById(`GLAccNoSet${0}`).focus(),
          100
        );
      } else {
        setTimeout(() => document.getElementById(`VoucherNoSet`).focus(), 100);
      }
    } else {
      if (event.target.value != '0') {
        alert('Please enter a valid Transaction Type');
      } else {
        this.grneralJournalTransactionForm.controls['TransactionType'].setValue(
          event.target.value
        );
        this.showBank = false;
        this.showCash = false;
      }
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

  clearData(index: number, check: number) {
    console.log('coming here   ', index);
    var tempListAfter = [];
    for (var i = index + 1; i < this.VoucherList.value.length; i++) {
      tempListAfter.push(this.VoucherList.value[i]);
    }
    while (this.VoucherList.value.length - 1 > index) {
      this.VoucherList.removeAt(this.VoucherList.value.length - 1);
    }
    var temp = this.VoucherList.value[index];
    //console.log(this.VoucherList.value);
    this.VoucherList.removeAt(index);
    //console.log(this.VoucherList.value);
    let data = {
      GLAccNo: '',
      GLAccDesc: '',
      GLCreditAmt: '',
      GLDebitAmt: '',
      MarkRecord: '',
      TrnDesc: '',
      Id: temp.Id,
    };
    this.addItem(data);
    for (var i = 0; i < tempListAfter.length; i++) {
      this.addItem(tempListAfter[i]);
    }
  }

  reshapeData(index: number, check: number) {
    console.log('coming here   ', index);
    var tempListAfter = [];
    for (var i = index + 1; i < this.VoucherList.value.length; i++) {
      tempListAfter.push(this.VoucherList.value[i]);
    }
    while (this.VoucherList.value.length - 1 > index) {
      this.VoucherList.removeAt(this.VoucherList.value.length - 1);
    }
    var temp = this.VoucherList.value[index];
    //console.log(this.VoucherList.value);
    this.VoucherList.removeAt(index);
    //console.log(this.VoucherList.value);
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

  onChangeDebit(i: number, x: FormGroup) {
    var item = x.value as GvDepositTrnInfoModel;
    if (
      this.grneralJournalTransactionForm.value.VoucherList[i].GLCreditAmt != '0'
    ) {
      this.reshapeData(i, 1);
      return;
    }
    if (this.grneralJournalTransactionForm.value.VoucherList[i].TrnDesc == '') {
      alert('Please give the description');
    } else if (i != 0) {
      if (
        (this.grneralJournalTransactionForm.value.VoucherList[i - 1]
          .GLDebitAmt == 0 ||
          this.grneralJournalTransactionForm.value.VoucherList[i - 1]
            .GLDebitAmt == '') &&
        this.grneralJournalTransactionForm.value.TransactionType != '3'
      ) {
        alert('Not Allowed Debit Transaction');
        this.reshapeData(i, 1);
      } else {
        this.addToTempData(i, x);
        var val = this.VoucherList.length;
        setTimeout(
          () => document.getElementById(`GLAccNoSet${val}`).focus(),
          1000
        );

        // if (x.value.GLDebitAmt != '0') {
        //   this.addToTempData(i, x);
        //   // setTimeout(
        //   //   () => document.getElementById(`GLAccNoSet${val}`).focus(),
        //   //   1000
        //   // );
        // } else {
        //   // setTimeout(
        //   //   () => document.getElementById(`GLCreditAmtSet${i}`).focus(),
        //   //   1000
        //   // );
        // }

        var val = this.VoucherList.length;
      }
    } else {
      this.addToTempData(i, x);
      var val = this.VoucherList.length;
      setTimeout(
        () => document.getElementById(`GLAccNoSet${val}`).focus(),
        1000
      );
    }
  }

  onEnterGLDebitAmtHandler(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    var val = this.VoucherList.length;
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
  onEnterGLAccNoHandler(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    if (x.value.GLAccNo != '') {
      let index = this.GLCodeDropDown.findIndex( a => a.GLAccNo == x.value.GLAccNo );
      let desc = this.GLCodeDropDown[index].GLAccDesc;
      x.controls['GLAccDesc'].setValue( desc );

      let val = this.VoucherList.length-1;
      if( i < val ){
        this.addToTempData(i, x);
        setTimeout(
          () => document.getElementById(`GLAccNoSet${val}`).focus(),
          500
        );
      }

      
    } else {
      setTimeout(() => document.getElementById('btnUpdate').focus(), 1000);
    }
  }

  onChangeCredit(i: number, x: FormGroup) {
    console.log('here', i);
    if (
      this.grneralJournalTransactionForm.value.VoucherList[i].GLDebitAmt != '0'
    ) {
      this.reshapeData(i, 2);
      return;
    }
    var item = x.value as GvDepositTrnInfoModel;
    if (this.grneralJournalTransactionForm.value.VoucherList[i].TrnDesc == '') {
      alert('Please give the description');
    } else if (i != 0) {
      console.log('coming here');
      console.log(
        this.grneralJournalTransactionForm.value.VoucherList[i].GLCreditAmt
      );
      if (
        (this.grneralJournalTransactionForm.value.VoucherList[i - 1]
          .GLCreditAmt == '0' ||
          this.grneralJournalTransactionForm.value.VoucherList[i - 1]
            .GLCreditAmt == '') &&
        this.grneralJournalTransactionForm.value.TransactionType != '3'
      ) {
        alert('Not Allowed Credit Transaction');
        this.reshapeData(i, 2);
      } else {
        this.addToTempData(i, x);
        var val = this.VoucherList.length;
        setTimeout(
          () => document.getElementById(`GLAccNoSet${val}`).focus(),
          1000
        );
      }
    } else {
      this.addToTempData(i, x);
      var val = this.VoucherList.length;
      setTimeout(
        () => document.getElementById(`GLAccNoSet${val}`).focus(),
        1000
      );
    }
  }
  addToTempData(i: number, x: FormGroup) {
    var item = x.value as GvDepositTrnInfoModel;
    var data = {
      Id: this.grneralJournalTransactionForm.value.VoucherList[i].Id,
      CtrlProcDate: this.CashDataAll.CtrlProcDate,
      CtrlTrnType: this.grneralJournalTransactionForm.value.TransactionType,
      CtrlGLCode: this.grneralJournalTransactionForm.value.VoucherList[i]
        .GLAccNo,
      CtrlTrnDesc: this.grneralJournalTransactionForm.value.VoucherList[i]
        .TrnDesc,
      CtrlGLCodeDesc: this.grneralJournalTransactionForm.value.VoucherList[i]
        .GLAccDesc,
      CtrlDRAmount: this.grneralJournalTransactionForm.value.VoucherList[i]
        .GLDebitAmt,
      CtrlCRAmount: this.grneralJournalTransactionForm.value.VoucherList[i]
        .GLCreditAmt,
      CtrlMarkFlag: this.grneralJournalTransactionForm.value.VoucherList[i]
        .MarkRecord,
      CashCode: this.CashDataAll.CashCode,
      IsUpdateSelf: i == this.VoucherList.length - 1 ? false : true,
    };
    console.log(data);
    this.spinner.show();
    this.generalJournalTrnService
      .generalJournalTrnTempDataAdd(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.GvDepositTransInformation = x;
          console.log(this.GvDepositTransInformation);
          this.VoucherList = this.grneralJournalTransactionForm.get(
            'VoucherList'
          ) as FormArray;
          while (this.VoucherList.length !== 0) {
            this.VoucherList.removeAt(0);
          }
          this.totalCreditAmount = 0;
          this.totalDebitAmount = 0;
          this.GvDepositTransInformation.forEach((data) => {
            this.totalCreditAmount += data.GLCreditAmt;
            this.totalDebitAmount += data.GLDebitAmt;
            this.grneralJournalTransactionForm.controls[
              'TotalDebitAmount'
            ].setValue(
              this.totalDebitAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })
            );
            this.grneralJournalTransactionForm.controls[
              'TotalCreditAmount'
            ].setValue(
              this.totalCreditAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })
            );
            this.addItem(data);
          });
          console.log('total credit', this.totalCreditAmount);
          console.log('total debit', this.totalDebitAmount);
          console.log(
            'type => ',
            this.grneralJournalTransactionForm.value.TransactionType
          );
          this.grneralJournalTransactionForm.controls[
            'GLCodeDropDown'
          ].setValue('');
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          alert('Something went wrong.');
        }
      );
  }

  changeBankCode(event: any) {
    let selectedCode = this.GLBankCodeDropDown.find(
      (x) => x.GLAccNo == event.target.value
    );
    if (selectedCode) {
      this.grneralJournalTransactionForm.controls['BankType'].setValue(
        event.target.value
      );
    } else {
      alert('Please enter a valid Bank Type');
    }
  }

  duplicateChange() {
    if (this.isDuplicate == false) {
      this.isDuplicate = true;
    } else {
      this.isDuplicate = false;
    }
  }

  exitPage() {
    this.router.navigate(['accounting/']);
  }

  allUpdate() {
    if (
      this.grneralJournalTransactionForm.value.TransactionType == '3' &&
      this.totalCreditAmount != this.totalDebitAmount
    ) {
      alert('Total Debit and Credit amount are not equal');
      return;
    }
    if (this.grneralJournalTransactionForm.value.TransactionType == '0') {
      alert('Please select Transaction Type');
      return;
    }

    this.grneralJournalTransactionForm.controls['ModuleNo'].setValue(
      Number(this.module)
    );
    console.log(this.grneralJournalTransactionForm.value);
    console.log(this.module);
    this.spinner.show();
    this.generalJournalTrnService
      .generalJournalFinalUpdateData(this.grneralJournalTransactionForm.value)
      .pipe(first())
      .subscribe(
        (x: any) => {
          if (x.Success) {
            this.spinner.hide();
            this.Voucher = x.VoucherNo;
            alert(x.Message);
            console.log('This is update call data :', x);
            if (this.PrintFlag == 1 && this.PrintFOptFlag == 1) {
              this.getReportToken();
            }
            this.ngOnInit();
          } else {
            this.spinner.hide();
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
    this.grneralJournalTransactionForm.controls['TrnMode'].setValue('0');
    let selectedCode = this.TransactionGridViewInfo.find(
      (x) => x.VchNo == event.target.value
    );
    console.log(selectedCode);
    if (selectedCode) {
      this.showEdit = true;
    } else {
      this.showEdit = false;
      console.log(this.VoucherList.length);
      var len = this.VoucherList.length;
      setTimeout(
        () => document.getElementById(`GLAccNoSet${len - 1}`).focus(),
        100
      );
    }
  }
  modalYes() {
    this.showEdit = false;
    console.log('coming here');
    this.VoucherList = this.grneralJournalTransactionForm.get(
      'VoucherList'
    ) as FormArray;
    while (this.VoucherList.length !== 0) {
      this.VoucherList.removeAt(0);
    }
    this.grneralJournalTransactionForm.controls['TrnMode'].setValue('1');
    this.generalJournalTrnService
      .generalJournalEditVoucharData(
        this.grneralJournalTransactionForm.value.VoucherNo
      )
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log(x);
          x.forEach((data) => {
            this.addItem(data);
          });
          this.VoucherList = x;
        },
        (err) => {
          this.spinner.hide();
          alert('Something went wrong.');
        }
      );
  }
  modalNo() {
    this.showEdit = false;
    this.grneralJournalTransactionForm.controls['VoucherNo'].setValue('');
  }
  cancelPage() {
    this.ngOnInit();
  }
  voucherTransactionChange() {
    if (this.showVoucher == false) {
      this.showVoucher = true;
    } else {
      this.showVoucher = false;
    }
  }
  public getReportToken = () => {
    this.setParameter();
    this.spinner.show();

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
    var fValue = this.grneralJournalTransactionForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('TrnType', fValue.TransactionType)
    );

    this.reportModel.Values.push(new ReportKeyValue('VchNo', this.Voucher));
  }
  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };
}
