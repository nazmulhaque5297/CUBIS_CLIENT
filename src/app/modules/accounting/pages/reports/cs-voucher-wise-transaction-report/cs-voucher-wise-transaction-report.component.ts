import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { ReportCommonService } from 'src/app/services/report-common.service';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportEnum } from 'src/app/enums/report-enum';
import { FormGroup, FormControl } from '@angular/forms';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';

@Component({
  selector: 'app-cs-voucher-wise-transaction-report',
  templateUrl: './cs-voucher-wise-transaction-report.component.html',
  styleUrls: ['./cs-voucher-wise-transaction-report.component.css'],
})
export class CsVoucherWiseTransactionReportComponent
  implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  chbIsAllCollectorStatus: any;
  chbIsAllTellerStatus: any;

  IsCollectorDisabled: any;
  IsTellerDisabled: any;

  CsVchWiseTransactionReportForm: FormGroup;
  storefDate: any;
  storetDate: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    this.reportModel.ReportName = 'CsGenerateVchWiseTransaction01';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    // this.chbIsAllAccTypeStatus = true;
    this.chbIsAllCollectorStatus = true;
    // this.chbIsAllGroupStatus = true;
    this.chbIsAllTellerStatus = true;
    // this.chbIsAllMemberStatus = true;
    // this.chbIsAllPurposeStatus = true;
    // this.chbIsAllGenderStatus = true;
    // this.chbIsAllDisburseStatus = true;

    // this.IsAccTypeDisabled = true;
    this.IsCollectorDisabled = true;
    // this.IsGroupDisabled = true;
    this.IsTellerDisabled = true;
    // this.IsPurposeDisabled = true;
    // this.IsGenderDisabled = true;
    // this.IsDisburseDisabled = true;

    this.CsVchWiseTransactionReportForm = new FormGroup({
      // IsOldMem: new FormControl(false),

      // IsAllAccType: new FormControl('true'),
      // AccTypeCode: new FormControl(''),
      // AccType: new FormControl('0'),
      IsAllCollector: new FormControl('true'),
      CollectorCode: new FormControl(''),
      Collector: new FormControl('0'),
      // IsAllGroup: new FormControl('true'),
      // GroupCode: new FormControl(''),
      // Group: new FormControl('0'),

      IsAllTeller: new FormControl('true'),
      TellerCode: new FormControl(''),
      Teller: new FormControl('0'),

      // IsAllPurpose: new FormControl('true'),
      // PurposeCode: new FormControl(''),
      // Purpose: new FormControl('0'),

      // IsAllMember: new FormControl('true'),
      // MemNo: new FormControl(''),
      // MemName: new FormControl(''),

      // IsAllGender: new FormControl('true'),
      // Gender: new FormControl('0'),

      // IsAllDisburse: new FormControl('true'),
      // Disburse: new FormControl('0'),

      rbTrnMode: new FormControl('2'),
      rbReportMode: new FormControl('1'),
      rbCollection: new FormControl('0'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      // chbSkipLoanPurpose: new FormControl('true'),
      // rbAccNoWise: new FormControl('1'),
    });
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.CsVchWiseTransactionReportForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.CsVchWiseTransactionReportForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.spinner.hide();
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
      });
  }

  // events Collector
  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.CsVchWiseTransactionReportForm.controls['Collector'].setValue('0');
      this.CsVchWiseTransactionReportForm.controls['CollectorCode'].setValue(
        ''
      );
    } else {
      this.chbIsAllCollectorStatus = false;
      this.CsVchWiseTransactionReportForm.get('Collector').enable();
    }
  }

  onChangeCollectorCode(event: any) {
    let CollectorCodeId = this.CsVchWiseTransactionReportForm.controls[
      'CollectorCode'
    ].value;
    console.log(CollectorCodeId);
    if (CollectorCodeId) {
      this.CsVchWiseTransactionReportForm.patchValue({
        Collector: this.getSelectedItemIDCollector(
          CollectorCodeId,
          this.inputHelpData.CollectorList
        ),
      });
    }
  }

  public getSelectedItemIDCollector(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Collector !');
      this.CsVchWiseTransactionReportForm.patchValue({
        Collector: 0,
        CollectorCode: '',
      });
    }
    return selected.Id;
  }

  onChangeCollector(event: any) {
    let CollectorId = this.CsVchWiseTransactionReportForm.controls['Collector']
      .value;
    console.log(CollectorId);
    if (CollectorId) {
      this.CsVchWiseTransactionReportForm.patchValue({
        CollectorCode: CollectorId,
      });
    }
  }

  // events User id/ teller
  checkIsAllTellerValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllTellerStatus = true;
      this.IsTellerDisabled = true;
      this.CsVchWiseTransactionReportForm.controls['Teller'].setValue('0');
      this.CsVchWiseTransactionReportForm.controls['TellerCode'].setValue('');
    } else {
      this.chbIsAllTellerStatus = false;
      this.CsVchWiseTransactionReportForm.get('Teller').enable();
    }
  }
  onChangeTellerCode(event: any) {
    let TellerCodeId = this.CsVchWiseTransactionReportForm.controls[
      'TellerCode'
    ].value;
    console.log(TellerCodeId);
    if (TellerCodeId) {
      this.CsVchWiseTransactionReportForm.patchValue({
        Teller: this.getSelectedItemIDTeller(
          TellerCodeId,
          this.inputHelpData.cashDisbTellerList
        ),
      });
    }
  }

  public getSelectedItemIDTeller(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Teller !');
      this.CsVchWiseTransactionReportForm.patchValue({
        Teller: 0,
        TellerCode: '',
      });
    }
    return selected.Id;
  }

  onChangeTeller(event: any) {
    let TellerId = this.CsVchWiseTransactionReportForm.controls['Teller'].value;
    console.log(TellerId);
    if (TellerId) {
      this.CsVchWiseTransactionReportForm.patchValue({
        TellerCode: TellerId,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.CsVchWiseTransactionReportForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('rbTrnMode', fValue.rbTrnMode)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('rbReportMode', fValue.rbReportMode)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('Collector', fValue.Collector)
    );

    this.reportModel.Values.push(new ReportKeyValue('Teller', fValue.Teller));

    this.reportModel.Values.push(
      new ReportKeyValue('rbCollection', fValue.rbCollection)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );

    //start Collector
    if (this.chbIsAllCollectorStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorDesc', 'All Collector')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'CollectorDesc',
          this.getSelectedItemText(
            fValue.Collector,
            this.inputHelpData.CollectorList
          )
        )
      );
    }
    //end Collector

    //start Teller
    if (this.chbIsAllTellerStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('TellerDesc', 'All Teller')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'TellerDesc',
          this.getSelectedItemText(
            fValue.Teller,
            this.inputHelpData.cashDisbTellerList
          )
        )
      );
    }
    // end Teller

    // report name start
    if (fValue.rbTrnMode === '2' && fValue.rbReportMode === '1') {
      //this.reportModel.ReportName = 'CsGenerateVchWiseTransaction01';
      this.reportModel.ReportName = 'rptMCsGenerateVchWiseTransaction01';

      this.reportModel.Values.push(new ReportKeyValue('nFlag', '0'));
    } else {
      //this.reportModel.ReportName = 'CsGenerateVchWiseTransaction';
      this.reportModel.ReportName = 'rptMCsGenerateVchWiseTransaction';

      this.reportModel.Values.push(new ReportKeyValue('nFlag', '1'));
    }
    // report name end
  }

  public getReportToken = (type: any) => {
    if (
      !this.chbIsAllTellerStatus &&
      this.CsVchWiseTransactionReportForm.controls['TellerCode'].value == ''
    ) {
      alert('Please Select Teller Mode!');
      return;
    }
    if (
      !this.chbIsAllCollectorStatus &&
      this.CsVchWiseTransactionReportForm.controls['CollectorCode'].value == ''
    ) {
      alert('Please Select Collector Mode!');
      return;
    }
    this.spinner.show();
    this.setParameter();
    //this.spinner.show();
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
    // }
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

  // Date change event
  // applicationDateChange() {
  //   var value = this.datepipe.transform(this.CsVchWiseTransactionReportForm.value.IssueFromDate, 'dd-MM-yyyy');
  //   var formatedValue = this.aService.convertDateToString(value);
  //   this.CsVchWiseTransactionReportForm.value.IssueFromDate = formatedValue;
  //   var value = this.datepipe.transform(this.CsVchWiseTransactionReportForm.value.IssueToDate, 'dd-MM-yyyy');
  //   this.CsVchWiseTransactionReportForm.value.IssueToDate = this.aService.convertDateToString(value);
  //   console.log("this is formated from date", formatedValue)
  //   console.log("fvalue", this.CsVchWiseTransactionReportForm.value)
  // }
  // applicationDateChange2() {
  //   var value = this.datepipe.transform(this.CsVchWiseTransactionReportForm.value.IssueToDate, 'dd-MM-yyyy');
  //   var formatedValue = this.aService.convertDateToString(value);
  //   this.CsVchWiseTransactionReportForm.value.IssueToDate = formatedValue;
  //   var value = this.datepipe.transform(this.CsVchWiseTransactionReportForm.value.IssueFromDate, 'dd-MM-yyyy');
  //   this.CsVchWiseTransactionReportForm.value.IssueFromDate = this.aService.convertDateToString(value);
  //   console.log("this is formated to date", formatedValue)
  //   console.log("fvalue", this.CsVchWiseTransactionReportForm.value)
  // }
  applicationDateChange() {
    var fv = this.CsVchWiseTransactionReportForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CsVchWiseTransactionReportForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.CsVchWiseTransactionReportForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.CsVchWiseTransactionReportForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CsVchWiseTransactionReportForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.CsVchWiseTransactionReportForm.value);
    console.log(this.storetDate);
  }
}
