import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { AccountingService } from './../../services/accounting.service';
import { Router } from '@angular/router';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AutoAnniversaryService } from 'src/app/services/auto-anniversary.service';

@Component({
  selector: 'app-auto-anniversary-processing',
  templateUrl: './auto-anniversary-processing.component.html',
  styleUrls: ['./auto-anniversary-processing.component.css'],
})
export class AutoAnniversaryProcessingComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  AutoAnniversaryProcessForm: FormGroup;
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  accTypeList = [];
  anniMemList = [];
  CalculateBtnShow: boolean = false;
  PrintBtnShow: boolean = false;
  AccountNo: any;
  AccountName: any;
  accInfoList: any = {};
  constructor(
    private autoAnniversaryService: AutoAnniversaryService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    public datepipe: DatePipe,
    private toaster: ToastrService
  ) {
    this.reportModel.ReportName = 'CCULB_rptAutoAnniversary03';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getAccountTypeList();
  }

  private initializeForm() {
    this.AutoAnniversaryProcessForm = new FormGroup({
      SelectedAccountType: new FormControl('0', [Validators.required]),
      VoucherNo: new FormControl(''),
    });
    this.CalculateBtnShow = false;
    this.PrintBtnShow = false;
  }

  getAccountTypeList = () => {
    this.spinner.show();
    this.autoAnniversaryService
      .getAccountTypeForAutoAnniversary()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accTypeList = data;
        this.spinner.hide();
      });
  };

  selectAccountTypeChangeHandler = (e) => {
    this.spinner.show();
    this.autoAnniversaryService
      .getAccountDetails(+e.target.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.spinner.hide();
        this.accInfoList = x;
      });

    this.AccountNo = this.AutoAnniversaryProcessForm.controls[
      'SelectedAccountType'
    ].value;
    let selectedCode = this.accTypeList.find(
      (x) => x.Id == this.AutoAnniversaryProcessForm.value.SelectedAccountType
    );
    this.AccountName = selectedCode.Description;
    document.getElementById(`VoucherNo`).focus();
  };

  public getReportToken = () => {
    if (
      this.AutoAnniversaryProcessForm.controls['SelectedAccountType'].value == 0
    ) {
      this.toastr.warning('Please Select Account Type!');
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
    var fValue = this.AutoAnniversaryProcessForm.value;
    this.reportModel.Values = [];
    let number = fValue.SelectedAccountType;
    let firstDigit = String(number)[0];
    if (firstDigit == '3') {
      this.reportModel.ReportName = 'CCULB_rptAutoAnniversary03';
    } else if (firstDigit == '4') {
      this.reportModel.ReportName = 'CCULB_rptAutoAnniversary04';
    }

    this.reportModel.Values.push(
      new ReportKeyValue('AccNo', fValue.SelectedAccountType)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('AccName', this.AccountName)
    );

    console.log(this.reportModel.Values);
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };

  Calculate() {
    if (this.AutoAnniversaryProcessForm.invalid) {
      alert('Please input the value');
      return;
    }
    this.spinner.show();
    this.autoAnniversaryService
      .Calculate(+this.accInfoList.AccType, +this.accInfoList.AccTypeClass)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.spinner.hide();
        if (!x.Success) {
          alert(x.Message);
          return;
        }
        this.accInfoList.MemberList = x.MemberList;
        this.accInfoList.ShowPostBtn = true;
      });
  }
  Post() {
    let data: any = {};
    data.VoucherNo = this.AutoAnniversaryProcessForm.get('VoucherNo').value;
    data.AccTypeClass = this.accInfoList.AccTypeClass;
    if (!data.VoucherNo) {
      alert('Input Voucher No');
      return;
    }
    this.spinner.show();
    this.autoAnniversaryService
      .Post(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.spinner.hide();
        if (!x.Success) {
          this.toaster.error(x.Message);
          return;
        }
        this.accInfoList.ShowCalculateBtn = false;
        this.accInfoList.ShowPostBtn = false;
        this.accInfoList.ShowReverseBtn = true;
        alert(x.Message);
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
  }
  Reverse() {
    let data = {};
    this.spinner.show();
    this.autoAnniversaryService
      .Reverse(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.spinner.hide();
        if (!x.Success) {
          this.toaster.error(x.Message);
          return;
        }
        this.accInfoList.ShowCalculateBtn = true;
        this.accInfoList.ShowPostBtn = false;
        this.accInfoList.ShowReverseBtn = false;
        alert(x.Message);
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
  }
}
