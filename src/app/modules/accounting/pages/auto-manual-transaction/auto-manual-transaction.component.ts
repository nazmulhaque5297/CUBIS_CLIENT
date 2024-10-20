import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  AutoManualInputHelp,
  ManualInsertModel,
  MemberDetailsDataModel,
  ManualPostTranModel,
} from '../../models/auto-manual-transaction.model';
import { takeUntil } from 'rxjs/operators';
import { AutoManualService } from 'src/app/services/auto-manual-transaction.service';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { getCommonData } from 'src/app/selector/user.selectors';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auto-manual-transaction',
  templateUrl: './auto-manual-transaction.component.html',
  styleUrls: ['./auto-manual-transaction.component.css'],
})
export class AutoManualTransactionComponent implements OnInit {
  AutoManualTransferForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: AutoManualInputHelp = new AutoManualInputHelp();
  public manualMemberData: ManualInsertModel = new ManualInsertModel();
  public MemberDetails: MemberDetailsDataModel = new MemberDetailsDataModel();
  commonData: IApplicationCommonModel;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private pService: AutoManualService,
    private store: Store,
    private sanitizer: DomSanitizer,
    private aService: ReportCommonService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelp();
    this.store
      .pipe(select(getCommonData))
      .subscribe((cData: IApplicationCommonModel) => {
        this.commonData = cData;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.AutoManualTransferForm = this.fb.group({
      BranchId: new FormControl(''),
      BranchNo: new FormControl('0'),
      AccountTypeCode: new FormControl(''),
      AccountTypeId: new FormControl('0'),
      OpenDate: new FormControl(''),
      MemberNo: new FormControl(''),
      AmountTypeId: new FormControl('0'),
      OrderByOldAccNo: new FormControl(false),
      AccountNo: new FormControl(''),
      SelectedAccountNo: new FormControl('0'),
      TrnAmount: new FormControl(''),
      TransactionId: new FormControl(''),
      GLCode: new FormControl(''),
      DCCode: new FormControl(''),
      Deduct: new FormControl(''),
      VoucherNo: new FormControl(''),
      TrnDescription: new FormControl(''),
    });
  }

  private getInputHelp(): void {
    this.spinner.show();
    this.pService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.AutoManualTransferForm.controls['BranchId'].setValue(
          this.inputHelpData.BranchNo
        );
        this.AutoManualTransferForm.controls['BranchNo'].setValue(
          this.inputHelpData.BranchNo
        );
        this.AutoManualTransferForm.controls['OpenDate'].setValue(
          this.inputHelpData.ProcessDate
        );
        this.AutoManualTransferForm.controls['AmountTypeId'].setValue(0);
        this.AutoManualTransferForm.controls['TransactionId'].setValue(1);
        this.AutoManualTransferForm.controls['Deduct'].setValue(0);
        this.spinner.hide();
      });
  }

  validate(flag: number) {
    if (flag == 1) {
      if (
        !this.AutoManualTransferForm.get('AccountTypeId').value ||
        !this.AutoManualTransferForm.get('AccountTypeCode').value
      ) {
        alert('Please select account type');
        return false;
      }
    }

    return true;
  }

  onAccountTypeChange(value: number): void {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.AccountTypeList,
      value
    );
    this.AutoManualTransferForm.controls['AccountTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.AutoManualTransferForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    this.spinner.show();
    this.pService
      .GetGlCode(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.AutoManualTransferForm.controls['GLCode'].setValue(
          data.Description
        );
        this.spinner.hide();
      });
    document.getElementById(`MemberNo`).focus();
  }

  onMemberChange(e: any) {
    if (!this.validate(1)) return;
    var data = new MemberDetailsDataModel();
    data.AccType = this.AutoManualTransferForm.get('AccountTypeId').value;
    data.MemNo = e.target.value;
    this.spinner.show();
    this.pService
      .GetMemberDetails(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.AutoManualTransferForm.controls['MemberNo'].setValue('');
          return;
        }
        this.MemberDetails = data;
        if (this.MemberDetails.AccList.length == 1) {
          this.AutoManualTransferForm.controls['SelectedAccountNo'].setValue(
            this.MemberDetails.AccList[0].Description
          );
          this.AutoManualTransferForm.controls['AccountNo'].setValue(
            this.MemberDetails.AccList[0].Description
          );
        }
      });
    document.getElementById(`SelectedAccountNo`).focus();
  }
  onAccountNoChange(value: number) {
    var item = this.MemberDetails.AccList?.find(
      (e) => +e.Description == +value
    );
    this.AutoManualTransferForm.controls['SelectedAccountNo'].setValue(
      item != null ? item.Description : 0
    );
    this.AutoManualTransferForm.controls['AccountNo'].setValue(
      item != null ? item.Description.toString() : ''
    );
    document.getElementById(`TrnAmount`).focus();
  }

  // enter key events
  onEnterTrnAmountHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`DCCode`).focus();
  }
  onEnterDCCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`VoucherNo`).focus();
  }
  onEnterVoucherNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`TrnDescription`).focus();
  }

  convertDateToString(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('/');
  }

  Add() {
    console.log('d');
    if (!this.validate(1)) return;
    var data = new ManualInsertModel();
    data.AccType = this.AutoManualTransferForm.get('AccountTypeId').value;
    data.TransactionId = this.AutoManualTransferForm.get('TransactionId').value;
    data.Deduct = this.AutoManualTransferForm.get('Deduct').value;
    data.OpenDate =
      typeof this.AutoManualTransferForm.value.OpenDate == 'string'
        ? this.AutoManualTransferForm.value.OpenDate
        : this.convertDateToString(this.AutoManualTransferForm.value.OpenDate);
    data.AmountTypeId = this.AutoManualTransferForm.get('AmountTypeId').value;
    data.AccNo = this.AutoManualTransferForm.get('AccountNo').value;
    data.TrnAmount = this.AutoManualTransferForm.get('TrnAmount').value;
    this.spinner.show();
    this.pService
      .AddAllMember(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.manualMemberData = data;
        this.spinner.hide();
      });
  }
  AddAllMember() {
    if (!this.validate(1)) return;
    var data = new ManualInsertModel();
    data.AccType = this.AutoManualTransferForm.get('AccountTypeId').value;
    data.TransactionId = this.AutoManualTransferForm.get('TransactionId').value;
    data.Deduct = this.AutoManualTransferForm.get('Deduct').value;
    data.OpenDate =
      typeof this.AutoManualTransferForm.value.OpenDate == 'string'
        ? this.AutoManualTransferForm.value.OpenDate
        : this.convertDateToString(this.AutoManualTransferForm.value.OpenDate);
    data.AmountTypeId = this.AutoManualTransferForm.get('AmountTypeId').value;
    this.spinner.show();
    this.pService
      .AddAllMember(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.manualMemberData = data;
        this.spinner.hide();
      });
  }

  DeleteMemberAccount(AccNo: number) {
    var data = new ManualInsertModel();
    data.AccType = this.AutoManualTransferForm.get('AccountTypeId').value;
    data.AccNo = AccNo;
    this.spinner.show();
    this.pService
      .DeleteAccount(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.manualMemberData = data;
        this.spinner.hide();
      });
  }

  UpdateMemberList() {
    this.spinner.show();
    this.pService
      .UpdateAccount(this.manualMemberData.MemberList)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        alert('Updated Done');
      });
  }

  Preview() {
    this.setParameter1();
    this.spinner.show();
    this.pService
      .Preview(+this.AutoManualTransferForm.get('AccountTypeId').value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
      });
  }

  Post() {
    var data = new ManualPostTranModel();
    data.VoucherNo = this.AutoManualTransferForm.get('VoucherNo').value;
    data.TrnDescription = this.AutoManualTransferForm.get(
      'TrnDescription'
    ).value;
    data.AccType = +this.AutoManualTransferForm.get('AccountTypeCode').value;
    data.TransactionId = this.AutoManualTransferForm.get('TransactionId').value;
    data.Deduct = this.AutoManualTransferForm.get('Deduct').value;
    data.ContraGLCode = this.AutoManualTransferForm.get('DCCode').value;
    data.GLCode = this.AutoManualTransferForm.get('GLCode').value;
    this.spinner.show();
    this.pService
      .Post(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        alert(data.Message);
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
  }
  Reverse() {
    var data = new ManualPostTranModel();
    data.VoucherNo = this.AutoManualTransferForm.get('VoucherNo').value;
    data.TrnDescription = this.AutoManualTransferForm.get(
      'TrnDescription'
    ).value;
    data.AccType = +this.AutoManualTransferForm.get('AccountTypeCode').value;
    data.TransactionId = this.AutoManualTransferForm.get('TransactionId').value;
    data.Deduct = this.AutoManualTransferForm.get('Deduct').value;
    data.ContraGLCode = this.AutoManualTransferForm.get('DCCode').value;
    data.GLCode = this.AutoManualTransferForm.get('GLCode').value;
    this.spinner.show();
    this.pService
      .Reverse(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        alert(data.Message);
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
  }

  public setParameter1(): void {
    this.reportModel.Values = [];
    let selectedCode = this.inputHelpData.AccountTypeList.find(
      (x) => x.Id == this.AutoManualTransferForm.value.AccountTypeId
    );
    console.log('selectedCode>>', selectedCode);
    var num = this.AutoManualTransferForm.value.TransactionId != '0' ? 0 : 1;
    var selectedIndex2 = this.AutoManualTransferForm.value.Deduct;
    var str1 = '',
      str2 = '';
    if (num == 0) {
      str1 =
        'Manual Auto Debit Transaction for ' +
        selectedCode.Description +
        ' - ' +
        selectedCode.Id;
      str2 =
        selectedIndex2 != '0'
          ? 'Deduct Account Balance < Trnsaction Amount - Yes'
          : 'Deduct Account Balance < Trnsaction Amount - No';
    } else {
      str1 =
        'Manual Auto Credit Transaction for ' +
        selectedCode.Description +
        ' - ' +
        selectedCode.Id;
      str2 = '';
    }
    this.reportModel.Values.push(
      new ReportKeyValue(
        'CommonNo1',
        this.AutoManualTransferForm.value.BranchId
      )
    );
    this.reportModel.Values.push(
      new ReportKeyValue('CommonNo2', selectedCode.Id.toString())
    );
    this.reportModel.Values.push(new ReportKeyValue('CommonName1', str1));
    this.reportModel.Values.push(new ReportKeyValue('CommonName2', str2));
    this.reportModel.Values.push(
      new ReportKeyValue('CommonNo3', num.toString())
    );
    if (this.AutoManualTransferForm.value.OrderByOldAccNo) {
      this.reportModel.Values.push(new ReportKeyValue('CommonNo4', '1'));
    } else {
      this.reportModel.Values.push(new ReportKeyValue('CommonNo4', '0'));
    }
    this.reportModel.ReportName = 'rptCsManualAutoTransaction';
    this.getReportToken();
  }

  public getReportToken = () => {
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
  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };
}
