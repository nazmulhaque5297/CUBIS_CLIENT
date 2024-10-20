import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { VoucherDetailsModel } from 'src/app/interfaces/transaction-voucher-report';
import { UserInfo } from 'src/app/Models/Common.model';
import {
  AccClassDetails,
  LoanReceivedReportInputHelp,
} from 'src/app/Models/loanreceived-report.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { DailyCsTransactionVchRptService } from 'src/app/services/daily-cs-transaction-voucher.service';
import { EditLoanAccountService } from 'src/app/services/edit-loan-account.service';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import {
  DailyCsTransactionVchPageLoadModel,
  VoucherInfoModel,
} from '../../../models/daily-cs-transaction-vch.model';

@Component({
  selector: 'app-cs-daily-transaction-voucher-report',
  templateUrl: './cs-daily-transaction-voucher-report.component.html',
  styleUrls: ['./cs-daily-transaction-voucher-report.component.css'],
})
export class CsDailyTransactionVoucherReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  public VoucherDetailsList: VoucherDetailsModel = new VoucherDetailsModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  GetInputHelpData: DailyCsTransactionVchPageLoadModel = new DailyCsTransactionVchPageLoadModel();
  VoucherInfoData: VoucherInfoModel = new VoucherInfoModel();
  CSTransactionVchForm: FormGroup;

  defaultDateData: any;
  showVoucherNo: boolean = false;
  applicationDate: any;
  processDate: any;
  vchFlag: any;
  ddlValue: any;
  glCashCode: any;
  vchNo: any;
  ReportDDLValue: any;
  ReportDDLName: any;
  boolFlag: Boolean = true;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService,
    private editAccountService: EditLoanAccountService,
    private dailyCsTransactionVoucherService: DailyCsTransactionVchRptService
  ) {
    this.reportModel.ReportName = 'CCULB_rptCSContraEncashmentTransactionVch';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    //this.setDefaultOptions();
  }
  private initializeForm() {
    this.CSTransactionVchForm = new FormGroup({
      ProcessDate: new FormControl(''),
      VoucherNo: new FormControl(''),
      ChangeFuntionType: new FormControl('0'),
    });
    this.getInputHelpData();
  }

  public getInputHelpData() {
    this.dailyCsTransactionVoucherService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        console.log('GetInputHelpData:', data);
        this.GetInputHelpData = data;
        this.CSTransactionVchForm.controls['ProcessDate'].setValue(
          this.GetInputHelpData.ProcDate
        );
      });
  }

  //Date Formatting
  convertDateToString(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('/');
  }

  async onChangeVchNo() {
    this.processDate = this.CSTransactionVchForm.controls['ProcessDate'].value;
    this.processDate =
      typeof this.CSTransactionVchForm.value.ProcessDate == 'string'
        ? this.CSTransactionVchForm.value.ProcessDate
        : this.convertDateToString(this.CSTransactionVchForm.value.ProcessDate);
    this.applicationDate =
      typeof this.CSTransactionVchForm.value.ProcessDate == 'string'
        ? this.CSTransactionVchForm.value.ProcessDate
        : this.convertDateToString(this.CSTransactionVchForm.value.ProcessDate);
    console.log('ApplicationDate:', this.applicationDate);
    this.ddlValue = this.CSTransactionVchForm.controls[
      'ChangeFuntionType'
    ].value;
    console.log('ddlValue:', this.ddlValue);
    if (this.ddlValue != '99') {
      if (this.ddlValue == '1') {
        this.vchNo = 'ProvisionCPS';
      } else if (this.ddlValue == '2') {
        this.vchNo = 'Provision6YR';
      } else if (this.ddlValue == '3') {
        this.vchNo = 'Provision6YR';
      } else if (this.ddlValue == '4') {
        this.vchNo = 'AnniversaryCPS';
      } else if (this.ddlValue == '5') {
        this.vchNo = 'AnniversaryFDR';
      } else if (this.ddlValue == '6') {
        this.vchNo = 'Anniversary6YR';
      } else if (this.ddlValue == '7') {
        this.vchNo = 'RenewalFDR';
      } else if (this.ddlValue == '8') {
        this.vchNo = 'Anniversary6YR';
      } else {
        this.vchNo = 'BenefitMSplus';
      }
    } else {
      this.vchNo = this.CSTransactionVchForm.controls['VoucherNo'].value;
    }
    console.log(this.vchNo);
    this.glCashCode = this.GetInputHelpData.GLCashCode;
    console.log('GLCashCodeValue:', this.glCashCode);
    if (this.processDate != this.applicationDate) {
      this.vchFlag = '1';
    } else {
      this.vchFlag = '0';
    }
    let vchInfoModel = {
      VchNo: this.vchNo,
      VchFlag: this.vchFlag,
      ProcessDate: this.processDate,
      ApplicationDate: this.applicationDate,
      GlCashCode: this.glCashCode,
      DdlValue: this.ddlValue,
    };

    this.spinner.show();
    await this.dailyCsTransactionVoucherService
      .GetVchInfo(vchInfoModel)
      .pipe(takeUntil(this.destroy$))
      .toPromise()
      .then(
        (x: any) => {
          this.spinner.hide();
          this.VoucherInfoData = x;
          console.log('VoucherInformation:', this.VoucherInfoData);
          // invalid vchno/memberno
          if (this.ddlValue == '99') {
            if (this.VoucherInfoData.VchNo == null) {
              alert('Voucher Is not Available!!!');
              this.boolFlag = true;
              return true;
            } else {
              this.boolFlag = false;
              this.setParameter();

              return false;
            }
          } else {
            if (!this.VoucherInfoData.Success) {
              alert('Data Is Not Available To Print!!!');
              this.boolFlag = true;
              return true;
            } else {
              this.setParameter();
              this.boolFlag = false;
              return false;
            }
          }
        },
        (err) => {
          this.spinner.hide();
          //this.boolFlag = true;
          return true;
        }
      );
  }

  //OnchangeFuntionType

  onChangeFunctionType() {
    let selectedCode = this.GetInputHelpData.AllFunctionTypeDropDown.find(
      (x) => x.Id == this.CSTransactionVchForm.value.ChangeFuntionType
    );
    this.ReportDDLValue = this.CSTransactionVchForm.controls[
      'ChangeFuntionType'
    ].value;
    this.ReportDDLName = selectedCode.Description;
    if (this.CSTransactionVchForm.value.ChangeFuntionType == '99') {
      this.showVoucherNo = true;
    } else {
      this.showVoucherNo = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.CSTransactionVchForm.value;
    this.reportModel.Values = [];

    //

    if (this.ddlValue == '9') {
      this.reportModel.ReportName = 'CCULB_rptCSSumTransactionVch';
    } else {
      this.reportModel.ReportName = 'CCULB_rptGLTransactionVch2';
    }
    if (
      this.VoucherDetailsList.FuncOpt == '5' ||
      this.VoucherDetailsList.FuncOpt == '6' ||
      this.VoucherDetailsList.FuncOpt == '7' ||
      this.VoucherDetailsList.FuncOpt == '8' ||
      this.VoucherDetailsList.FuncOpt == '12' ||
      this.VoucherDetailsList.FuncOpt == '13' ||
      this.VoucherDetailsList.FuncOpt == '14' ||
      this.VoucherDetailsList.FuncOpt == '15' ||
      this.VoucherDetailsList.FuncOpt == '16' ||
      this.VoucherDetailsList.FuncOpt == '17' ||
      this.VoucherDetailsList.FuncOpt == '18' ||
      this.VoucherDetailsList.FuncOpt == '27' ||
      this.VoucherDetailsList.FuncOpt == '9' ||
      this.VoucherDetailsList.FuncOpt == '10' ||
      this.VoucherDetailsList.FuncOpt == '11'
    ) {
      if (
        this.VoucherDetailsList.FuncOpt == '15' ||
        this.VoucherDetailsList.FuncOpt == '16' ||
        this.VoucherDetailsList.FuncOpt == '17'
      ) {
        this.reportModel.ReportName =
          'CCULB_rptCSContraEncashmentTransactionVch';
      } else {
        this.reportModel.ReportName = 'CCULB_rptCSContraTransactionVch';
      }
    } else if (
      this.VoucherDetailsList.FuncOpt == '10' ||
      this.VoucherDetailsList.FuncOpt == '13' ||
      this.VoucherDetailsList.FuncOpt == '27' ||
      this.VoucherDetailsList.FuncOpt == '29'
    ) {
      this.reportModel.ReportName = 'CCULB_rptCSTrfTransactionVch';
    } else if (
      this.VoucherDetailsList.FuncOpt == '23' ||
      this.VoucherDetailsList.FuncOpt == '24' ||
      this.VoucherDetailsList.FuncOpt == '35'
    ) {
      this.reportModel.ReportName = 'CCULB_rptCSSumTransactionVch';
    } else if (
      this.VoucherDetailsList.FuncOpt == '15' ||
      this.VoucherDetailsList.FuncOpt == '16' ||
      this.VoucherDetailsList.FuncOpt == '17'
    ) {
      this.reportModel.ReportName = 'CCULB_rptCSEcashmentTransactionVch';
    } else {
      this.reportModel.ReportName = 'CCULB_rptCSTransactionVch';
    }

    //

    this.reportModel.Values.push(
      new ReportKeyValue('ProcessDate', fValue.ProcessDate)
    );

    if (this.defaultDateData != this.inputHelpData.ApplicationDate) {
      this.reportModel.Values.push(new ReportKeyValue('VchFlag', '1'));
    } else {
      this.reportModel.Values.push(new ReportKeyValue('VchFlag', '0'));
    }
    this.reportModel.Values.push(
      new ReportKeyValue('userId', this.VoucherInfoData.UserID)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('memType', this.VoucherInfoData.MemType)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('memNo', this.VoucherInfoData.MemNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('memName', this.VoucherInfoData.MemName)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('funTitle', this.ReportDDLName)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('trnTypeTitle', this.VoucherInfoData.TrnTypeTitle)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('vchNo', this.VoucherInfoData.VchNo)
    );
    this.reportModel.Values.push(new ReportKeyValue('AutovchNo', this.vchNo));
    this.reportModel.Values.push(new ReportKeyValue('funcOpt', this.ddlValue));
    this.reportModel.Values.push(
      new ReportKeyValue('trnType', this.VoucherInfoData.TrnType)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('valueDate', this.VoucherInfoData.ValueDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('fromCashCode', this.VoucherInfoData.FromCashCode)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('idsName', this.VoucherInfoData.UserIDName)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('VchYear', this.VoucherInfoData.lblVchYear)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('boothNo', this.VoucherInfoData.BoothNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('boothName', this.VoucherInfoData.BoothName)
    );
    this.reportModel.Values.push(new ReportKeyValue('ddlValue', this.ddlValue));
  }

  public getReportToken = (type: any) => {
    let vchNo = this.CSTransactionVchForm.controls['VoucherNo'].value;
    console.log(vchNo);
    console.log('DDLLLLL:', this.ddlValue);
    if (this.CSTransactionVchForm.value.ChangeFuntionType == '0') {
      this.toastr.warning('Please Select Function Type!!! ');
      return;
    }
    if (this.CSTransactionVchForm.value.ChangeFuntionType == '99') {
      console.log('VCHH:', this.CSTransactionVchForm.value.VoucherNo);
      if (this.CSTransactionVchForm.value.VoucherNo == '') {
        this.toastr.warning('Please Input Voucher No!');
        return;
      }
    }

    this.onChangeVchNo();
    //this.boolFlag = false;
    if (this.boolFlag) {
      console.log('Voucher validation returned true');
      return;
    } else {
      console.log('Voucher validation returned false');
      this.spinner.show();
      this.setParameter();
      this.displayIFrame = true;
      console.log(this.reportModel);
      this.aService
        .getReportToken(this.reportModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (x) => {
            if (type === 'CRV') {
              this.setIframeCRV(x);
            } else {
              this.setIframe(x);
            }
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  };

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };
  private setIframeCRV = (x: any) => {
    var iFramePath =
      environment.reportUrl +
      'id=' +
      x.id +
      '&token=' +
      x.token +
      '&type=crViewer';

    window.open(iFramePath, '_blank');
  };
}
