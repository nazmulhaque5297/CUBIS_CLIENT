import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { AccountingService } from './../../services/accounting.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReportCommonService } from 'src/app/services/report-common.service';

@Component({
  selector: 'app-auto-renewal-process',
  templateUrl: './auto-renewal-process.component.html',
  styleUrls: ['./auto-renewal-process.component.css'],
})
export class AutoRenewalProcessComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  AutoRenewalProcessForm: FormGroup;
  accTypeList = [];
  accInfoListTypeThree = [];
  accInfoList = [];
  AllData = [];
  TotalInterest: number = 0.0;
  AccType: string = '';
  AccShortDescription: string = '';
  AccTypeClass: string = '';
  VoucherNo: string = '';
  GlCode: string = '';
  AccName: string = '';
  showCorresButton: boolean = false;
  showVoucherField: boolean = false;
  constructor(
    private aService: ReportCommonService,
    private sanitizer: DomSanitizer,
    private AccountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.reportModel.ReportName = 'CCULB_rptAutoRenewal03';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getAccountTypeList();
  }

  private initializeForm() {
    this.AutoRenewalProcessForm = new FormGroup({
      AccountType: new FormControl('', [Validators.required]),
      SelectedAccountType: new FormControl('0'),
      GLDebitCodeType: new FormControl(''),
      GLDebitCode: new FormControl(''),
      VoucherNo: new FormControl(''),
    });
  }

  getAccountTypeList = () => {
    this.spinner.show();
    this.AccountingService.getAccountTypeForAutoRenewal()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.accTypeList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  selectAccountTypeChangeHandler = (e) => {
    this.AccType = e.target.value;
    this.accInfoList = []; // empty the list onChange
    this.accInfoListTypeThree = []; // empty the list onChange
    this.AccountingService.GetAccountInfoForAutoRenewal(+this.AccType)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.AllData = x;
          this.AccName = x.AccTypeDescription;
          console.log('GetAccountInfoForAutoRenewal=====', x);
          console.log('========', x.AccTypeClass);
          //this.accInfoList = x;
          this.AccTypeClass = x.AccTypeClass;
          if (x.AccTypeDescription == 'Long Term Savings Deposit') {
            this.AccShortDescription = 'Interest Payable on L.T.S.D';
          } else if (x.AccTypeDescription == '3 Month Savings Scheme') {
            this.AccShortDescription = 'Interest Paid on 3Month FDR';
          } else if (x.AccTypeDescription == '1 Month Benefit Scheme') {
            this.AccShortDescription = 'Interest Paid on MMS (Monthly)';
          } else if (x.AccTypeDescription == 'Double Deposit Scheme') {
            this.AccShortDescription = 'Int.Payable On Double Deposit Scheme';
          } else if (x.AccTypeDescription == 'Triple Benefit Scheme') {
            this.AccShortDescription = 'Int.Payable On Triple Benefit Scheme';
          }

          if (x.AccTypeClass == 3) {
            this.showCorresButton = true;
            this.showVoucherField = true;
          } else if (x.AccTypeClass == 4) {
            this.showCorresButton = false;
            this.showVoucherField = true;
          } else if (x.AccTypeClass == 5) {
            this.showCorresButton = false;
            this.showVoucherField = true;
          }
          x.AccProvisionMode == 0
            ? (this.GlCode = x.AccExpenseGLCode)
            : x.AccProvisionGLCode;
          this.AutoRenewalProcessForm.patchValue({
            AccountType: x.AccTypeCode,
            GLDebitCodeType: x.AccProvisionMode == 0 ? 'Expense' : 'Provision',
            GLDebitCode:
              x.AccTypeCode == 522 || x.AccTypeCode == 545
                ? x.AccExpenseGLCode
                : x.AccProvisionGLCode,
          });
        },
        (err) => {
          this.spinner.hide();
        }
      );
    this.AutoRenewalProcessForm.controls['SelectedAccountType'].setValue(
      this.AccType
    );
    setTimeout(() => {
      document.getElementById(`VoucherNo`).focus();
    }, 100);
  };

  CalculateHandler = () => {
    if (this.AutoRenewalProcessForm.invalid) {
      alert('Please Input the value');
      return;
    }
    this.spinner.show();
    this.AccountingService.getAutoRenewalList(+this.AccTypeClass, +this.AccType)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (+this.AccTypeClass == 3) {
            this.accInfoListTypeThree = x;
            this.accInfoList = [];
          } else {
            this.accInfoList = x;
            this.accInfoListTypeThree = [];
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  checkHandler = (item) => {
    item.RecordMark ? (item.RecordMark = false) : (item.RecordMark = true);
    item.RecordMark
      ? (this.TotalInterest += item.CalInterest)
      : (this.TotalInterest -= item.CalInterest);
    this.spinner.show();
    this.AccountingService.UpdateRenewal(
      +this.AccTypeClass,
      +item.Id,
      item.RecordMark ? 1 : 0
    )
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  AllMarkHandler = () => {
    let data = [];
    if (+this.AccTypeClass == 3) {
      this.accInfoListTypeThree.map((module: any) => {
        module['RecordMark'] = true;
        data.push(module);
      });
      this.accInfoListTypeThree = data;
    } else {
      let data = [];
      this.accInfoList.map((module: any) => {
        module['RecordMark'] = true;
        data.push(module);
      });
      this.accInfoList = data;
    }

    this.spinner.show();
    this.AccountingService.BulkUpdateRenewal(data, +this.AccTypeClass)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  AllUnMarkHandler = () => {
    let data = [];
    if (+this.AccTypeClass == 3) {
      this.accInfoListTypeThree.map((module: any) => {
        module['RecordMark'] = false;
        data.push(module);
      });
      this.accInfoListTypeThree = data;
    } else {
      let data = [];
      this.accInfoList.map((module: any) => {
        module['RecordMark'] = false;
        data.push(module);
      });
      this.accInfoList = data;
    }
    this.spinner.show();
    this.AccountingService.BulkUpdateRenewal(data, +this.AccTypeClass)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  PostHandler = () => {
    this.VoucherNo = this.AutoRenewalProcessForm.value.VoucherNo;
    if (!this.VoucherNo) {
      alert('Please Insert Voucher No!');
      return;
    }
    this.spinner.show();
    this.AccountingService.Post(
      +this.AccTypeClass,
      this.VoucherNo,
      +this.AccType,
      +this.GlCode
    )
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('post update', x);
          if (x.Success) {
            alert(x.Message);
            location.reload();
          } else {
            alert(x.Message);
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  public getReportToken = () => {
    if (this.AutoRenewalProcessForm.invalid) {
      alert('Please Input the value');
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
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  private setParameter(): void {
    var fValue = this.AutoRenewalProcessForm.value;
    this.reportModel.Values = [];
    let number = fValue.SelectedAccountType;
    let firstDigit = String(number)[0];
    if (firstDigit == '3') {
      this.reportModel.ReportName = 'CCULB_rptAutoRenewal03';
    } else if (firstDigit == '4') {
      this.reportModel.ReportName = 'CCULB_rptAutoRenewal04';
    } else if (firstDigit == '5') {
      this.reportModel.ReportName = 'CCULB_rptAutoRenewal05';
    }
    this.reportModel.Values.push(
      new ReportKeyValue('AccSelectValue', fValue.AccountType)
    );

    this.reportModel.Values.push(new ReportKeyValue('AccName', this.AccName));
    this.reportModel.Values.push(new ReportKeyValue('CommonNo2', '0'));

    console.log(this.reportModel.Values);
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };
}
