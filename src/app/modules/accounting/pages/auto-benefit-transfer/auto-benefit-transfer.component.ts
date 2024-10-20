import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { AccountingService } from './../../services/accounting.service';
import { AutoBenefitService } from 'src/app/services/auto-benefit-transfer.service';
import { IdDescription } from 'src/app/interfaces/id-description';
import { DomSanitizer } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { getCommonData } from 'src/app/selector/user.selectors';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auto-benefit-transfer',
  templateUrl: './auto-benefit-transfer.component.html',
  styleUrls: ['./auto-benefit-transfer.component.css'],
})
export class AutoBenefitTransferComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  AutoBenefitTransferForm: FormGroup;
  accTypeList = [];
  accInfoList: any = [];
  RevAccList: any = [];
  AccType: string = '';
  AccShortDescription: string = '';
  commonData: IApplicationCommonModel;
  TotalBenefit: number = 0.0;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  constructor(
    private AccountingService: AccountingService,
    private autoBenefitService: AutoBenefitService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private store: Store,
    private sanitizer: DomSanitizer,
    private aService: ReportCommonService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAccountTypeList();
    this.store
      .pipe(select(getCommonData))
      .subscribe((cData: IApplicationCommonModel) => {
        this.commonData = cData;
        console.log(cData);
      });
  }

  private initializeForm() {
    this.AutoBenefitTransferForm = new FormGroup({
      SelectedAccountType: new FormControl('0'),
      GLDebitCodeType: new FormControl(''),
      GLDebitCode: new FormControl(''),
      VoucherNo: new FormControl(''),
    });
  }

  validate(flag: number) {
    if (flag == 1) {
      if (!this.AutoBenefitTransferForm.get('SelectedAccountType').value) {
        alert('Please select account type');
        return false;
      }
      if (!this.AutoBenefitTransferForm.get('GLDebitCode').value) {
        alert('Please select account type');
        return false;
      }
      if (!this.AutoBenefitTransferForm.get('VoucherNo').value) {
        alert('Please select account type');
        return false;
      }
    }

    return true;
  }

  getAccountTypeList = () => {
    this.spinner.show();
    this.autoBenefitService
      .getAccountTypeForAutoBenefit()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accTypeList = data;
        this.spinner.hide();
      });
  };
  selectAccountTypeChangeHandler = (e) => {
    if (e.target.value == 0) {
      this.initializeForm();
      this.accInfoList = [];
      return;
    }
    this.spinner.show();
    this.autoBenefitService
      .getAccountDetailAndControl(+e.target.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.spinner.hide();
        this.accInfoList = x;
        this.accInfoList.ShowVoucherNo = true;

        if (x.AccTypeDescription == '3 Month Savings Scheme') {
          this.AccShortDescription = 'Interest Paid on 3Month FDR';
        } else if (x.AccTypeDescription == '1 Month Benefit Scheme') {
          this.AccShortDescription = 'Interest Paid on MMS (Monthly)';
        }

        this.AutoBenefitTransferForm.patchValue({
          GLDebitCodeType: x.AccProvisionMode == 0 ? 'Expense' : 'Provision',
          GLDebitCode:
            x.AccType == 522 || x.AccType == 545
              ? x.AccExpenseGLCode
              : x.AccProvisionGLCode,
        });
        setTimeout(() => {
          document.getElementById(`VoucherNo`).focus();
        }, 100);
      });
  };
  Calculate() {
    this.spinner.show();
    this.autoBenefitService
      .Calculate(+this.accInfoList.AccType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.spinner.hide();
        this.accInfoList.MemberList = x.MemberList;
        this.accInfoList.MemberList.map((ele: any) => {
          if (ele.RecordMark == 1) this.TotalBenefit += ele.CalBenefit;
        });
        this.accInfoList.ShowPostBtn = true;
        this.accInfoList.ShowVoucherNo = true;
        this.accInfoList.ShowReverseBtn = x.ShowReverseBtn;
      });
  }
  checkHandler(item) {
    item.RecordMark = item?.RecordMark == 1 ? 0 : 1;
    this.spinner.show();
    this.autoBenefitService
      .UpdateRecordMark(+item.RecordMark, +item.Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.spinner.hide();
        item.RecordMark == 1
          ? (this.TotalBenefit += item.CalBenefit)
          : (this.TotalBenefit -= item.CalBenefit);
      });
  }

  Post() {
    let data: any = {};
    data.VoucherNo = this.AutoBenefitTransferForm.get('VoucherNo').value;
    data.DrGLCode = this.AutoBenefitTransferForm.get('GLDebitCode').value;
    data.AccType = this.AutoBenefitTransferForm.get(
      'SelectedAccountType'
    ).value;
    if (!data.VoucherNo) {
      alert('Input Voucher No');
      return;
    }
    this.spinner.show();
    this.autoBenefitService
      .Post(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (x) => {
          this.spinner.hide();
          if (!x.Success) {
            alert(x.Message);
            return;
          }
          alert(x.Message);
          setTimeout(() => {
            location.reload();
          }, 1000);
        },
        (err) => {
          this.spinner.hide();
          alert('Error Occured');
        }
      );
  }
  Reverse() {
    let data: any = {};
    data.VoucherNo = this.AutoBenefitTransferForm.get('VoucherNo').value;
    data.AccType = this.AutoBenefitTransferForm.get(
      'SelectedAccountType'
    ).value;
    if (!data.VoucherNo) {
      alert('Input Voucher No');
      return;
    }
    this.spinner.show();
    this.autoBenefitService
      .Reverse(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.spinner.hide();
        if (!x.Success) {
          alert(x.Message);
          return;
        }
        alert(x.Message);
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
  }

  SearchReverse() {
    let data: any = {};
    data.VoucherNo = this.AutoBenefitTransferForm.get('VoucherNo').value;
    data.AccType = this.AutoBenefitTransferForm.get(
      'SelectedAccountType'
    ).value;
    this.spinner.show();
    this.autoBenefitService
      .SearchReverse(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (x) => {
          this.spinner.hide();
          if (!x.Success) {
            alert(x.Message);
            return;
          }
          this.RevAccList = x.ReverseMemList;
        },
        (err) => {
          this.spinner.hide();
          alert('Error Occured');
        }
      );
  }

  public setParameter1(): void {
    this.reportModel.Values = [];
    this.reportModel.Values.push(
      new ReportKeyValue('ProcessDate', this.commonData.ProcessDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccountType',
        this.AutoBenefitTransferForm.value.SelectedAccountType
      )
    );
    let selectedCode = this.accTypeList.find(
      (x) => x.Id == this.AutoBenefitTransferForm.value.SelectedAccountType
    );
    this.reportModel.Values.push(
      new ReportKeyValue('AccountTypeDesc', selectedCode.Description)
    );
    this.reportModel.ReportName = 'rptAutoMonthlyBenefit';
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
