import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IApplicationCommonModel, UserInfo } from 'src/app/Models/Common.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { getUserInfo } from 'src/app/selector/user.selectors';
import { CashDepositService } from 'src/app/services/cash-deposit.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import {
  CashDepositInputHelp,
  CashDepositViewModel,
  ICashDepositAccountDetails,
  ICashDepositTransactionModel,
  OldMemberViewModel,
} from '../../models/cash-deposit.model';
import { CashDepositEventService } from '../../services/cash-deposit-event-service';

@Component({
  selector: 'app-cash-deposit',
  templateUrl: './cash-deposit.component.html',
  styleUrls: ['./cash-deposit.component.css'],
})
export class CashDepositComponent implements OnInit, OnDestroy {
  module: string = '1';
  cashDepositForm: FormGroup;
  commonData: IApplicationCommonModel;
  UserData: UserInfo;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  ApplicationNoReject: any;
  iFrameUrl: SafeResourceUrl;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: CashDepositInputHelp = new CashDepositInputHelp();
  public detailsData: CashDepositViewModel = new CashDepositViewModel();
  public accountDetailsData: ICashDepositAccountDetails;
  public DepositedAccountList: FormArray;
  public masterAccTypeList: ICashDepositTransactionModel[] = [];
  showModal: boolean = false;
  showUpdateModal: boolean = false;
  displayIFrame = false;
  showPensionMessage: boolean = false;
  isMultipleAcc:boolean=false;
  uniq_values = [];
  orginal_data: any[] = [];
  atyclass1: boolean = false;
  atyclass2: boolean = false;
  atyclass3: boolean = false;
  atyclass4: boolean = false;
  PrintFOptFlag: any;
  PrintFlag: any;
  totalAmt: any;
  VoucherNo: any;
  token: any;
  ReportDDLName: any;
  tokenDesc: any;
  ManualAccFlag: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: CashDepositService,
    private spinner: NgxSpinnerService,
    private store: Store,
    private sanitizer: DomSanitizer,
    private aService: ReportCommonService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.accountDetailsData = {
      Success: true,
    };
    {
      this.reportModel.ReportName = 'rptMCsGenerateVchWiseTransaction02';
      this.reportModel.Values = [];
    }
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
    var result = '';
    for (var i = 1; i < urlData.length; i++) {
      if (urlData[i] == '/') return result;
      result += urlData[i];
    }
  }

  ngOnInit(): void {
    this.masterAccTypeList = [];
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
    this.store.pipe(select(getUserInfo)).subscribe((userInfo: UserInfo) => {
      this.UserData = userInfo;
      console.log('UserInFoooo---->', this.UserData);
    });
    this.initializeForm();
    this.getInputHelp();
    this.showUpdateModal = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.cashDepositForm = this.fb.group({
      AccountTypeCode: new FormControl(''),
      AccountType: new FormControl('0'),
      OldAccountNo: new FormControl(''),
      ManualAccountNo: new FormControl(''),
      MemberNo: new FormControl('', [Validators.required]),
      VoucherNo: new FormControl(''),
      SpecialInstruction: new FormControl(''),
      GLCodeHelp: new FormControl(false),
      TotalAmount: new FormControl(0),
      AmountReceived: new FormControl(0),
      RefundAmount: new FormControl(0),
      TrnMode: new FormControl(0),
      DepositedAccountList: this.fb.array([]),
      ModuleNo: new FormControl(''),
      CheckValidation: new FormControl('0'),
      CtrlAccCloseFlag: new FormControl('0'),
    });
    // this.addItem(new MemberGroupAccount());
    document.getElementById(`AccountTypeCode`).focus();
    this.token = localStorage.getItem('accountTypeCode');
  }

  private getInputHelp(): void {
    this.spinner.show();
    this.pService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('AlllData:', data);
        if (data.ManualAccNo == 1) {
          this.ManualAccFlag = true;
        }
        this.inputHelpData = data;

        let selectedCode = this.inputHelpData.AccountTypeList.find(
          (x) => x.Id == this.token
        );
        console.log('token-->', this.token);
        if (this.token) {
          this.cashDepositForm.controls['AccountTypeCode'].setValue(
            Number(this.token.toString())
          );

          this.cashDepositForm.controls['AccountType'].setValue(
            Number(this.token.toString())
          );
        }

        data.DepositTransactions.forEach((x) => {
          this.addItem(x);
        });
        this.spinner.hide();
      });
  }

  onAccountTypeChange(value: number): void {
    new CashDepositEventService(
      this.cashDepositForm,
      this.inputHelpData
    ).setAccountType(value);
    console.log('====>', value);
    let selectedCode = this.inputHelpData.AccountTypeList.find(
      (x) => x.Id == value
    );
    localStorage.setItem('accountTypeCode', value.toString());
    if (this.inputHelpData.ShowOldAccNo) {
      document.getElementById(`OldAccountNo`).focus();
    } else {
      document.getElementById(`MemberNo`).focus();
    }
  }

  public addItem(x: ICashDepositTransactionModel): void {
    this.DepositedAccountList = this.cashDepositForm.get(
      'DepositedAccountList'
    ) as FormArray;
    this.DepositedAccountList.push(this.AddToDepositedAccount(x));
  }

  public setFromGlHelp(x: ICashDepositTransactionModel): void {
    console.log(x);
    x.Selected = true;
    this.cashDepositForm.controls['GLCodeHelp'].setValue(false);
    this.detailsData.GLCashCode = this.inputHelpData.UserCashCode;
    this.detailsData.VoucherNo = this.cashDepositForm.value.VoucherNo;
    this.detailsData.ModuleNo = Number(this.module);
    var isDup = false;

    var item = {
      GLAccNo: x.GLAccNo.toString()
    }
    if (this.detailsData.DepositTransactions) {
      var selectedItem = this.detailsData.DepositTransactions.filter(
        (x) => x.GLAccNo.toString() === item.GLAccNo
        ||
        x.GLAccNo.toString().substring(2) === item.GLAccNo.toString() //len: 6 GLCode Condition
      );
      var accListItem = this.detailsData.AccountGroupList.filter(
        (x) => x.GLAccNo.toString() == item.GLAccNo
        ||
        x.GLAccNo.toString().substring(2) === item.GLAccNo.toString()
      );
      
      if( !this.isMultipleAcc)
      {
        if (
          selectedItem.length > 0 &&
          accListItem.length == 0 &&
          selectedItem[selectedItem.length - 1].GLAccDesc != ''
        ) {
          // this.detailsData.DepositTransactions[i].GLAccNo = 0;
          // await this.ReloadRepositList(this.detailsData.DepositTransactions);
          // setTimeout(() => {
          //   document.getElementById(`GLAccNo${i}`).focus();
          // }, 100);
          alert('This GL Code is already added.');
          return;
        }
  
        if (
          accListItem.length > 0 &&
          selectedItem.length > 0 &&
          accListItem.length == selectedItem.length
        ) {
          // this.detailsData.DepositTransactions[i].GLAccNo = 0;
          // await this.ReloadRepositList(this.detailsData.DepositTransactions);
          // setTimeout(() => {
          //   document.getElementById(`GLAccNo${i}`).focus();
          // }, 100);
          alert('This GL Code is already added.');
          return;
        }

      }

      
    }

    if (this.detailsData.DepositTransactions.length > 1) {
      var selectedCode = this.uniq_values.find((p) => p.AccNo == x.AccNo);
      console.log(selectedCode);
      if (!selectedCode) {
        this.uniq_values.push(x);
      } else {
        isDup = true;
        x.Selected = false;
      }
    } else this.uniq_values.push(x);

    if (isDup == false) {
      this.spinner.show();
      this.detailsData.AccountGroupList = this.masterAccTypeList;
      this.pService
        .SelectAccountFromHelp(this.detailsData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (data) => {
          console.log('NeedsData===>>', data);
          this.spinner.hide();
          this.atyclass1 = false;
          this.atyclass2 = false;
          this.atyclass3 = false;
          this.atyclass4 = false;
          if (!data.Success) {
            alert(data.Message);
            return;
          }
          this.detailsData.DepositTransactions = data.DepositTransactions;
          this.detailsData.ReadTrnLogicData = data.ReadTrnLogicData;
          this.showPensionMessage = data.ShowPensionAdvanceMessage
            ? true
            : false;
          // //variables for dup check
          await this.ReloadRepositList(data.DepositTransactions);
          //this.getAccountDetails(data.AccountDetails);
          this.accountDetailsData = data.AccountDetails;
          if (this.accountDetailsData.AccAtyClass == 1) {
            this.atyclass1 = true;
          } else if (this.accountDetailsData.AccAtyClass == 2) {
            this.atyclass1 = true;
            this.atyclass2 = true;
          } else if (this.accountDetailsData.AccAtyClass == 6) {
            this.atyclass1 = true;
            this.atyclass3 = true;
          } else if (this.accountDetailsData.AccAtyClass == 7) {
            this.atyclass1 = true;
            this.atyclass4 = true;
          }
          setTimeout(
            () =>
              document
                .getElementById(
                  `TrnAmount${data.DepositTransactions.length - 1}`
                )
                .focus(),
            100
          );
        });
      x.Selected = false;
    } else {
      alert('Duplicate Account No.');
      this.cashDepositForm.controls['GLCodeHelp'].setValue(1);
    }
  }

  async ReloadRepositList(data: ICashDepositTransactionModel[]) {
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
    this.detailsData.AmountReceived = totalAmount;
    this.cashDepositForm.controls['TotalAmount'].setValue(
      totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
    this.cashDepositForm.controls['AmountReceived'].setValue(
      totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
  }

  public onAmountReceived(): void {
    var fValue = this.cashDepositForm.value;
    var num = fValue.AmountReceived.replace(/,/g, '');
    var num1 = fValue.TotalAmount.replace(/,/g, '');
    let refundAmount = parseInt(num) - parseInt(num1);
    console.log('this is amount rev', num);
    console.log('this is total', num1);
    console.log('this is refund amount', refundAmount);
    if (refundAmount < 0) {
      alert('Invalid Amount Input');
      this.cashDepositForm.controls['AmountReceived'].setValue('');
      this.cashDepositForm.controls['RefundAmount'].setValue('');
    } else {
      this.cashDepositForm.controls['RefundAmount'].setValue(
        refundAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
      );
      document.getElementById(`update`).focus();
    }
  }

  public deleteItem(i: number, x: FormGroup) {
    //var item = x.value as ICashDepositTransactionModel;
    var id = this.detailsData.DepositTransactions[i].Id;
    this.pService
      .DeleteTran(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        console.log('This is after delete data', r);
        this.detailsData.DepositTransactions = r.Data;
        this.ReloadRepositList(r.Data);
      });
  }

  private AddToDepositedAccount(x: ICashDepositTransactionModel): FormGroup {
    return this.fb.group({
      GLAccNo: [x.GLAccNo],
      GLAccDesc: [x.GLAccDesc],
      TrnAmount: [
        x.TrnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      ],
      AccType: [x.AccType],
      AccNo: [x.AccNo],
      AccBalance: [
        x.AccBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      ],
      Id: [x.Id],
    });
  }

  onAmountReceivedEnterHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`update`).focus();
    return;
  }
  // onAmountReceivedEnterHandler(e: KeyboardEvent) {
  //     document.getElementById(`update`).focus();
  //     return;
  // }

  onEnterOldAccHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (!this.cashDepositForm.controls['OldAccountNo'].value) {
      document.getElementById(`MemberNo`).focus();
      return;
    } else {
      document.getElementById(`VoucherNo`).focus();
    }
  }

  // onEnterOldAccHandler(e: KeyboardEvent) {
  //   if (e.keyCode != 13) return;
  //   document.getElementById(`MemberNo`).focus();
  //   return;
  // }
  onOldAccNoChange(): void {
    var data = {
      OldMemNo: +this.cashDepositForm.controls['OldAccountNo'].value,
      AccType: +this.cashDepositForm.controls['AccountTypeCode'].value,
    };
    var fValue = data as OldMemberViewModel;
    this.spinner.show();
    this.pService
      .GetDetailsByOldMemberNo(data as OldMemberViewModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          this.cashDepositForm.controls['OldAccountNo'].setValue('');
          document.getElementById(`OldAccountNo`).focus();
          alert(data.Message);
          return;
        }
        this.cashDepositForm.controls['MemberNo'].setValue(data.MemNo);
        this.spinner.show();
        this.pService
          .GetDetailsByMember(data.MemNo, Number(this.module))
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            this.spinner.hide();
            if (!data.Success) {
              alert(data.Message);
              return;
            }
            this.detailsData = data;
            this.masterAccTypeList = this.detailsData.AccountGroupList;
          });
      });
  }
  onEnterManualAccHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemberNo`).focus();
    return;
  }
  onEnterAccTypeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (
      !this.cashDepositForm.controls['AccountTypeCode'].value &&
      this.inputHelpData.ShowOldAccNo
    ) {
      document.getElementById(`OldAccountNo`).focus();
      return;
    } else if (this.inputHelpData.ShowOldAccNo) {
      document.getElementById(`OldAccountNo`).focus();
    } else {
      document.getElementById(`MemberNo`).focus();
    }
  }

  onMemberChange(): void {
    this.spinner.show();
    var fValue = this.cashDepositForm.value;
    this.pService
      .GetDetailsByMember(fValue.MemberNo, Number(this.module))
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        console.log("Response From Memeber==>",data)
        if (!data.Success) {
          document.getElementById(`MemberNo`).focus();
          alert(data.Message);
          this.cashDepositForm.controls['MemberNo'].setValue('');
          return;
        }
        this.detailsData = data;
        this.masterAccTypeList = this.detailsData.AccountGroupList;
        if (!this.UserData?.AutoVchflag) {
          document.getElementById(`VoucherNo`).focus();
        } else {
          document.getElementById(`GLAccNo${0}`).focus();
        }
      });
  }

  onVchNoChange() {
    if (this.cashDepositForm.value.MemberNo == '') {
      alert('Please Enter the Member No');
      this.cashDepositForm.controls['VoucherNo'].setValue('');
    } else {
      var fValue = this.cashDepositForm.value;
      this.pService
        .CheckVchNo(fValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe((r: any) => {
          if (r != 0 && this.cashDepositForm.value.MemberNo == r) {
            this.showModal = true;
          } else if (this.cashDepositForm.value.MemberNo != r && r != 0) {
            alert('Voucher Already Used by Member No. :' + r);
            this.cashDepositForm.controls['VoucherNo'].setValue('');
          } else {
            document.getElementById(`GLAccNo${0}`).focus();
          }
        });
    }
  }

  async onGLCode(i: number, x: FormGroup): Promise<void> {
    console.log('GLCodeChangeOK===>', this.detailsData.DepositTransactions);
    console.log('X ValueOKOK===>', x);

    var item = x.value as ICashDepositTransactionModel;
    if (item.GLAccNo == 0) {
      document.getElementById(`amount_received`).focus();
      return;
    }
    console.log('ItemOKOK===>', item);

    console.log(
      'this.detailsData.AccountGroupList==>',
      this.detailsData.AccountGroupList
    );
    console.log("Deposit Transaction===>", this.detailsData.DepositTransactions)
    if (this.detailsData.DepositTransactions) {
      var selectedItem = this.detailsData.DepositTransactions.filter(
        (x) => x.GLAccNo == item.GLAccNo
        ||
        x.GLAccNo.toString().substring(2) === item.GLAccNo.toString() //len: 6 GLCode Condition
      );
      var accListItem = this.detailsData.AccountGroupList.filter(
        (x) => x.GLAccNo == item.GLAccNo
        ||
        x.GLAccNo.toString().substring(2) === item.GLAccNo.toString()
      );


    }

    this.detailsData.DepositTransactions[i].Selected = true;
    this.detailsData.DepositTransactions[i].GLAccNo = item.GLAccNo;
    this.detailsData.VoucherNo = this.cashDepositForm.value.VoucherNo;
    this.detailsData.GLCashCode = this.inputHelpData.UserCashCode;
    this.spinner.show();
    this.pService
      .GLCodeChange(this.detailsData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (r) => {
        this.spinner.hide();

        console.log('AfterGLCodeChanges===>', r);

        if (!r.Success) {
          alert(r.Message);
          this.detailsData.DepositTransactions = r.Data;
          await this.ReloadRepositList(r.Data);
          setTimeout(() => {
            document.getElementById(`GLAccNo${i}`).focus();
          }, 100);
          return;
        }
        this.detailsData.AccountGroupList = this.detailsData.AccountGroupList;
        if (r.IsMultiple) {
          this.isMultipleAcc=true;
          this.detailsData.AccountGroupList = this.masterAccTypeList.filter(
            (x) => x.AccType == r.AccType
          );

        
            this.cashDepositForm.controls['GLCodeHelp'].setValue(1);
         
          
     

        }
        else{
          this.isMultipleAcc=false;
          if (
            selectedItem.length > 0 &&
            accListItem.length == 0 &&
            selectedItem[selectedItem.length - 1].GLAccDesc != ''
          ) {
            this.detailsData.DepositTransactions[i].GLAccNo = 0;
            await this.ReloadRepositList(this.detailsData.DepositTransactions);
            setTimeout(() => {
              document.getElementById(`GLAccNo${i}`).focus();
            }, 100);
            alert('This GL Code is already added.');
            return;
          }
    
          if (
            accListItem.length > 0 &&
            selectedItem.length > 0 &&
            accListItem.length == selectedItem.length
          ) {
            this.detailsData.DepositTransactions[i].GLAccNo = 0;
            await this.ReloadRepositList(this.detailsData.DepositTransactions);
            setTimeout(() => {
              document.getElementById(`GLAccNo${i}`).focus();
            }, 100);
            alert('This GL Code is already added.');
            return;
          }
        }
        console.log("Testing index==>",i)
        this.detailsData.DepositTransactions = r.Data;
        this.detailsData.ReadTrnLogicData = r.ReadTrnLogicData;
        this.showPensionMessage = r.ShowPensionAdvanceMessage
            ? true
            : false;
        await this.ReloadRepositList(r.Data);
        await this.setAccountDetails(r.Response);
        //this.getAccountDetails(this.detailsData.DepositTransactions[i].AccNo);
        setTimeout(() => document.getElementById(`TrnAmount${i}`).focus(), 100);
      });
    this.detailsData.AccountGroupList = this.detailsData.AccountGroupList;
    console.log("HeyHey==...>",this.detailsData.AccountGroupList)
  }

  async setAccountDetails(accDetails: ICashDepositAccountDetails) {
    this.accountDetailsData = accDetails;
    console.log('AccAtyClass', this.accountDetailsData.AccAtyClass);
    if (this.accountDetailsData.AccAtyClass == 1) {
      this.atyclass1 = true;
      this.atyclass3 = false;
      this.atyclass4 = false;
    } else if (this.accountDetailsData.AccAtyClass == 2) {
      this.atyclass1 = true;
      this.atyclass2 = true;
      this.atyclass3 = false;
      this.atyclass4 = false;
    } else if (this.accountDetailsData.AccAtyClass == 6) {
      this.atyclass1 = true;
      this.atyclass2 = false;
      this.atyclass3 = true;
      this.atyclass4 = false;
    } else if (this.accountDetailsData.AccAtyClass == 7) {
      this.atyclass1 = true;
      this.atyclass2 = false;
      this.atyclass3 = false;
      this.atyclass4 = true;
    }
  }
  onGLAccNoEnterHandler(e: KeyboardEvent, i: number, x: FormGroup): void {
    if (e.keyCode != 13) return;
    // if (Number(this.detailsData.DepositTransactions[i].GLAccNo) == 0) {
    //   document.getElementById(`amount_received`).focus();
    //   return;
    // }
    this.onGLCode(i, x);
  }

  onMemberEnterEvent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.cashDepositForm.value.MemberNo != '') {
      if (!this.UserData?.AutoVchflag) {
        document.getElementById(`VoucherNo`).focus();
      } else {
        document.getElementById(`GLAccNo${0}`).focus();
      }
    } else {
      document.getElementById(`MemberNo`).focus();
    }
  }
  async onAmountEnterHandler(e: KeyboardEvent, i: number, x: FormGroup) {
    if (e.keyCode != 13) return;
    var item = x.value as ICashDepositTransactionModel;
    this.detailsData.DepositTransactions[i].Selected = true;
    this.detailsData.DepositTransactions[i].TrnAmount = item.TrnAmount;
    this.detailsData.GLCashCode = this.inputHelpData.UserCashCode;
    this.spinner.show();
    this.pService
      .onAmountChange(this.detailsData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (r) => {
        this.spinner.hide();
        if (r.Success) {
          this.detailsData.DepositTransactions = r.Data;
          console.log("After amount change>>>",r.Data);
          if (this.detailsData.TrnMode == 1) {
            await this.setAccountDetails(r.Response);
          }
          await this.ReloadRepositList(r.Data);
          var val = this.DepositedAccountList.length - 1;
          setTimeout(
            () => document.getElementById(`GLAccNo${val}`).focus(),
            100
          );
        } else {
          this.detailsData.DepositTransactions[i].TrnAmount = 0;
          await this.ReloadRepositList(this.detailsData.DepositTransactions);
          alert(r.Message);
          return;
        }
      });
  }

  async onAmountChange(e: KeyboardEvent, i: number, x: FormGroup) {
    var item = x.value as ICashDepositTransactionModel;
    this.detailsData.DepositTransactions[i].Selected = true;
    this.detailsData.DepositTransactions[i].TrnAmount = item.TrnAmount;
    this.detailsData.GLCashCode = this.inputHelpData.UserCashCode;
    this.spinner.show();
    this.pService
      .onAmountChange(this.detailsData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (r) => {
        this.spinner.hide();
        if (r.Success) {
          this.detailsData.DepositTransactions = r.Data;
          if (this.detailsData.TrnMode == 1) {
            await this.setAccountDetails(r.Response);
          }
          await this.ReloadRepositList(r.Data);
          setTimeout(
            () => document.getElementById(`GLAccNo${i + 1}`).focus(),
            100
          );
        } else {
          this.detailsData.DepositTransactions[i].TrnAmount = 0;
          await this.ReloadRepositList(this.detailsData.DepositTransactions);
          alert(r.Message);
          setTimeout(() => document.getElementById(`GLAccNo${i}`).focus(), 100);
          return;
        }
      });
  }

  PensionModalYes() {
    this.showPensionMessage = false;
    setTimeout(
      () =>
        document
          .getElementById(
            `TrnAmount${this.detailsData.DepositTransactions.length - 1}`
          )
          .focus(),
      100
    );
  }
  PensionModalNo() {
    this.showPensionMessage = false;
    if (this.detailsData.DepositTransactions.length == 1) {
      this.ReloadRepositList([]);
    } else {
      this.ReloadRepositList(
        this.detailsData.DepositTransactions?.filter(
          (e, i) => i != this.detailsData.DepositTransactions.length - 1
        )
      );
      setTimeout(
        () =>
          document
            .getElementById(
              `TrnAmount${this.detailsData.DepositTransactions.length - 2}`
            )
            .focus(),
        100
      );
    }
  }

  modalNo() {
    this.showModal = false;
    this.cashDepositForm.controls['VoucherNo'].setValue('');
    alert('Please Input Another Voucher No.');
  }

  modalYes() {
    this.cashDepositForm.controls['TrnMode'].setValue(1);
    this.detailsData.TrnMode = 1;
    var fValue = this.cashDepositForm.value;
    // fValue.DepositedAccountList = this.detailsData.DepositTransactions;
    this.pService
      .InsertVch(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (r: any) => {
          this.showModal = false;
          this.detailsData.DepositTransactions = r;
          this.ReloadRepositList(r);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  modalUpdateNo() {
    this.showUpdateModal = false;
    this.cashDepositForm.controls['CtrlAccCloseFlag'].setValue('1');
    this.cashDepositForm.controls['CheckValidation'].setValue('1');
    this.onCreate();
  }

  modalUpdateYes() {
    this.showUpdateModal = false;
    this.cashDepositForm.controls['CtrlAccCloseFlag'].setValue('0');
    this.cashDepositForm.controls['CheckValidation'].setValue('1');
    this.onCreate();
  }

  private getAccountDetails(accNo: number): void {
    this.pService
      .GetAccountDetails(accNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accountDetailsData = data;
        if (this.accountDetailsData.AccAtyClass == 1) {
          this.atyclass1 = true;
        } else if (this.accountDetailsData.AccAtyClass == 2) {
          this.atyclass1 = true;
          this.atyclass2 = true;
        } else if (this.accountDetailsData.AccAtyClass == 6) {
          this.atyclass1 = true;
          this.atyclass3 = true;
        } else if (this.accountDetailsData.AccAtyClass == 7) {
          this.atyclass1 = true;
          this.atyclass4 = true;
        }
      });
  }

  async validityCheck(){
    for (var i = 0; i < this.detailsData.DepositTransactions.length; i++) {
      var currRow = this.detailsData.DepositTransactions[i];
      var s = this.detailsData.DepositTransactions[i].AccNo.toString();
      var findStr = "";
      if(s.length>0){
        findStr = s[7].toString() + s[8].toString() + s[9].toString() + s[10].toString() + s[11].toString();
      }
      console.log(findStr);
      if (currRow.AccType!=999 && s.length>0 && !findStr.includes(this.cashDepositForm.value.MemberNo)) {
        var message =
          'There is a problem on GL Code: ' +
          currRow.GLAccNo.toString() +
          '. Please Delete that row and input again. If it shows problem again then refresh the page and input again.';
        alert(message);
        setTimeout(() => {
          const row = document.getElementById(`myDepositList${i}`);
          console.log(row)
          row.style.cssText = "background-color:yellow";
        }, 100);
        return true;
      }
    }
    return false;
  }

   onCreate= async() =>{
    if (this.cashDepositForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    this.cashDepositForm.controls['ModuleNo'].setValue(this.module);
    let validity = await this.validityCheck();
    if(validity) return;
    this.spinner.show();
    var fValue = this.cashDepositForm.value;
    fValue.DepositedAccountList = this.detailsData.DepositTransactions;
    fValue.MemColCode = this.detailsData.MemColCode;
    fValue.AutoVchflag = this.UserData.AutoVchflag;
    this.pService
      .SubmitDeposit(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();

        if (!data.Success && data.Validation) {
          this.showUpdateModal = true;
          return;
        }

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
          this.getReportToken1();
        } else {
          location.reload();
        }
      });
  }

  viewTransaction() {}

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
          //.location.reload();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  public getReportToken1 = () => {
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
    if (this.inputHelpData.PrintFlag && this.inputHelpData.PrintFOptFlag == 1) {
      this.reportModel.ReportName = 'CCULB_rptCSTransactionVchForCashDeposit';
    } else {
      this.reportModel.ReportName = 'rptMCsGenerateVchWiseTransaction02';
    }
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
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;
    window.open(iFramePath, '_blank');
  };

  // show all member info
  // showAllMember() {
  //   const modalRef = this.modalService.open(AllMemberInformationComponent, {
  //     size: 'lg',
  //     backdrop: 'static',
  //     keyboard: false,
  //   });
  //   modalRef.result.then((data) => {
  //     if (data != 0) {
  //       this.cashDepositForm.controls['MemberNo'].setValue(data);
  //       this.onMemberChange();
  //     }
  //   });
  // }

  refresh() {
    location.reload();
  }
}
