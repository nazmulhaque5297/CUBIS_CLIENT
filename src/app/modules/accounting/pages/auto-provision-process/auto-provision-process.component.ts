import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { AccountingService } from './../../services/accounting.service';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserInfo } from 'src/app/Models/Common.model';
import { Store, select } from '@ngrx/store';
import { getCommonData } from 'src/app/selector/user.selectors';

@Component({
  selector: 'app-auto-provision-process',
  templateUrl: './auto-provision-process.component.html',
  styleUrls: ['./auto-provision-process.component.css'],
})
export class AutoProvisionProcessComponent implements OnInit {
  AutoProvisionProcessForm: FormGroup;
  accTypeList = [];
  accInfoList: any = [];
  ProvisionList = [];
  AccType: string = '';
  AccPaidDescription: string = '';
  AccPayableDescription: string = '';
  AccTypeClass: string = '';
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  commonDataInfo: any;
  constructor(
    private AccountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private aService: ReportCommonService,
    private store: Store,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.store.pipe(select(getCommonData)).subscribe((commonInfo: any) => {
      console.log(commonInfo);
      this.commonDataInfo = commonInfo;
    });
    this.initializeForm();
    this.getAccountTypeList();
  }

  private initializeForm() {
    this.AutoProvisionProcessForm = new FormGroup({
      AccountType: new FormControl(''),
      VoucherNo: new FormControl(''),
      SelectedAccountType: new FormControl('0'),
      DebitCode: new FormControl(''),
      ProvisionCode: new FormControl(''),
    });
  }

  getAccountTypeList = () => {
    this.spinner.show();
    this.AccountingService.getAccountTypeForAutoProvision()
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
    this.AccountingService.getAccountInfoAndFieldControlForProvision(
      +this.AccType
    )
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log('GetAccountInfoForAutoRenewal=====', x);
          if (!x.Success) {
            alert(x.Message);
            return;
          }
          this.accInfoList = x;
          this.AccTypeClass = x.AccTypeClass;
          this.AutoProvisionProcessForm.patchValue({
            AccountType: x.AccTypeCode,
            DebitCode: x.AccExpenseGLCode,
            ProvisionCode: x.AccProvisionGLCode,
          });
        },
        (err) => {
          this.spinner.hide();
        }
      );
    this.AutoProvisionProcessForm.controls['SelectedAccountType'].setValue(
      this.AccType
    );
    document.getElementById(`VoucherNo`).focus();
  };
  CalculateAndProvisionListHandler = () => {
    var fValue = this.AutoProvisionProcessForm.value;
    let FormData = {
      AccType: fValue.AccountType,
      ClassType: this.AccTypeClass,
      ProvCrCode: fValue.ProvisionCode,
      ProvDrCode: fValue.DebitCode,
    };
    this.spinner.show();
    this.AccountingService.calculateAndGetProvisionList(FormData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.ProvisionList = x;
          console.log('========', x);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  PostProvision = () => {
    let FormData = this.AutoProvisionProcessForm.value;
    let StatusFormData = {
      ClassType: +this.AccTypeClass,
      VchNo: FormData.VoucherNo,
      AccType: +this.AccType,
      ProvCrCode: FormData.ProvisionCode,
      ProvDrCode: FormData.DebitCode,
    };
    this.spinner.show();
    this.AccountingService.PostProvision(StatusFormData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (!x.Success) {
            alert(x.Message);
            return;
          }
          this.accInfoList = x;
          this.ProvisionList = [];
          alert(x.Message);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  ReverseProvision = () => {
    let FormData = this.AutoProvisionProcessForm.value;
    let StatusFormData = {
      ClassType: +this.AccTypeClass,
      VchNo: FormData.VoucherNo,
      AccType: +this.AccType,
    };
    this.spinner.show();
    this.AccountingService.ReverseProvision(StatusFormData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          if (!x.Success) {
            alert(x.Message);
            return;
          }
          this.accInfoList = x;
          alert(x.Message);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  private setParameter(): void {
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('ProcessDate', this.commonDataInfo.ProcessDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'VoucherNo',
        this.AutoProvisionProcessForm.value.VoucherNo
      )
    );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccountType',
        this.AutoProvisionProcessForm.value.AccountType
      )
    );
    let selectedCode = this.accTypeList.find(
      (x) => x.Id == this.AutoProvisionProcessForm.value.AccountType
    );
    this.reportModel.Values.push(
      new ReportKeyValue('AccountTypeDesc', selectedCode.Description)
    );
    if (this.AccTypeClass == '1') {
      this.reportModel.ReportName = 'rptAutoProvision01';
    }
    if (this.AccTypeClass == '2') {
      this.reportModel.ReportName = 'rptAutoProvision02';
    }
    if (this.AccTypeClass == '3') {
      this.reportModel.ReportName = 'rptAutoProvision03';
    }
    if (this.AccTypeClass == '4') {
      this.reportModel.ReportName = 'rptAutoProvision04';
    }
    if (this.AccTypeClass == '5') {
      this.reportModel.ReportName = 'rptAutoProvision05';
    }
  }

  public getReportToken = () => {
    if (this.AutoProvisionProcessForm.value.AccountType == '') {
      alert('Please Select the account type');
      return;
    }
    this.setParameter();
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
