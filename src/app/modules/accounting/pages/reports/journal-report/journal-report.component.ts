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
import { JournalReportService } from 'src/app/services/journal-report.service';
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { JournalReportInputHelp } from 'src/app/Models/journal-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';

@Component({
  selector: 'app-journal-report',
  templateUrl: './journal-report.component.html',
  styleUrls: ['./journal-report.component.css'],
})
export class JournalReportComponent implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  public inputHelpData2: JournalReportInputHelp = new JournalReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  chbIsAllAccTypeStatus: any;
  chbIsAllTrnTypeStatus: any;
  chbIsAllTrnModeStatus: any;
  chbIsAllTellerStatus: any;
  chbIsAllVchNoStatus: any;
  chbIsAllPurposeStatus: any;
  chbIsAllGenderStatus: any;
  chbIsAllNormalTransactionStatus: any;

  IsAccTypeDisabled: any;
  IsTrnTypeDisabled: any;
  IsTrnModeDisabled: any;
  IsTellerDisabled: any;
  IsPurposeDisabled: any;
  IsGenderDisabled: any;
  IsNormalTransactionDisabled: any;
  IsVchNoDisabled: any;
  storefDate: any;
  storetDate: any;

  LoanDisbursementForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private journalReportService: JournalReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    this.reportModel.ReportName = 'GLTransactionDetailList';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
    this.setDefaultOptions2();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    this.chbIsAllAccTypeStatus = true;
    this.chbIsAllTrnTypeStatus = true;
    this.chbIsAllTrnModeStatus = true;
    this.chbIsAllTellerStatus = true;
    this.chbIsAllVchNoStatus = true;
    this.chbIsAllPurposeStatus = true;
    this.chbIsAllGenderStatus = true;
    this.chbIsAllNormalTransactionStatus = true;

    this.IsAccTypeDisabled = true;
    this.IsTrnTypeDisabled = true;
    this.IsTrnModeDisabled = true;
    this.IsTellerDisabled = true;
    this.IsPurposeDisabled = true;
    this.IsGenderDisabled = true;
    this.IsNormalTransactionDisabled = true;
    this.IsVchNoDisabled = true;

    this.LoanDisbursementForm = new FormGroup({
      IsOldMem: new FormControl(false),

      IsAllAccType: new FormControl('true'),
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
      IsAllTrnType: new FormControl('true'),
      TrnTypeCode: new FormControl(''),
      TrnType: new FormControl('0'),
      IsAllTrnMode: new FormControl('true'),
      TrnModeCode: new FormControl(''),
      TrnMode: new FormControl('0'),

      IsAllTeller: new FormControl('true'),
      TellerCode: new FormControl(''),
      Teller: new FormControl('0'),

      IsAllPurpose: new FormControl('true'),
      PurposeCode: new FormControl(''),
      // Purpose: new FormControl('0'),

      IsAllVchNo: new FormControl('true'),
      VchNo: new FormControl(''),
      // MemName: new FormControl(''),

      IsAllGender: new FormControl('true'),
      Gender: new FormControl('0'),

      IsAllNormalTransaction: new FormControl('true'),
      NormalTransaction: new FormControl('0'),

      rbCollection: new FormControl('0'),

      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      // chbSkipLoanPurpose: new FormControl('true'),
      rbReportName: new FormControl('1'),
    });
  }

  //events GL Code
  checkIsAllAccTypeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllAccTypeStatus = true;
      this.IsAccTypeDisabled = true;
      this.LoanDisbursementForm.controls['AccType'].setValue('0');
      this.LoanDisbursementForm.controls['AccTypeCode'].setValue('');
    } else {
      this.chbIsAllAccTypeStatus = false;
      this.LoanDisbursementForm.get('AccType').enable();
    }
  }

  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.LoanDisbursementForm.controls['AccTypeCode'].value;
    if (AccTypeCodeId) {
      this.LoanDisbursementForm.patchValue({
        AccType: this.getSelectedItemIDAccType(
          AccTypeCodeId,
          this.inputHelpData2.GLcodeList
        ),
      });
    }
  }
  public getSelectedItemIDAccType(
    value: any,
    collection: IdDescription[]
  ): number {
    let selectedCode;
    if (value.length == 6) {
      selectedCode = collection.find(
        (x) => x.Id.toString().slice(2, 8) == value
      );
    } else if (value.length == 8) {
      selectedCode = collection.find((x) => x.Id == value);
    } else {
      alert('Invalid GL Code!');
      this.LoanDisbursementForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    this.LoanDisbursementForm.controls['AccTypeCode'].setValue(selectedCode.Id);
    return selectedCode.Id;
  }

  onChangeAccType(event: any) {
    let AccTypeId = this.LoanDisbursementForm.controls['AccType'].value;
    if (AccTypeId) {
      this.LoanDisbursementForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
  }

  // events Trn.Type
  checkIsAllTrnTypeValue(e) {
    if (e) {
      this.chbIsAllTrnTypeStatus = true;
      this.IsTrnTypeDisabled = true;
      this.LoanDisbursementForm.controls['TrnType'].setValue('0');
      this.LoanDisbursementForm.controls['TrnTypeCode'].setValue('');
    } else {
      this.chbIsAllTrnTypeStatus = false;
      this.LoanDisbursementForm.get('TrnType').enable();
    }
  }

  onChangeTrnTypeCode(event: any) {
    let CollectorCodeId = this.LoanDisbursementForm.controls['TrnTypeCode']
      .value;
    if (CollectorCodeId) {
      this.LoanDisbursementForm.patchValue({
        TrnType: this.getSelectedItemIDCollector(
          CollectorCodeId,
          this.inputHelpData2.TrnTypeList
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
      alert('Invalid Trn.Type !');
      this.LoanDisbursementForm.patchValue({
        TrnType: 0,
        TrnTypeCode: '',
      });
    }
    return selected.Id;
  }

  onChangeTrnType(event: any) {
    let CollectorId = this.LoanDisbursementForm.controls['TrnType'].value;
    console.log(CollectorId);
    if (CollectorId) {
      this.LoanDisbursementForm.patchValue({
        TrnTypeCode: CollectorId,
      });
    }
  }

  // events Trn.Mode
  checkIsAllTrnModeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllTrnModeStatus = true;
      this.IsTrnModeDisabled = true;
      this.LoanDisbursementForm.controls['TrnMode'].setValue('0');
      this.LoanDisbursementForm.controls['TrnModeCode'].setValue('');
    } else {
      this.chbIsAllTrnModeStatus = false;
      this.LoanDisbursementForm.get('TrnMode').enable();
    }
  }
  onChangeTrnModeCode(event: any) {
    let GroupCodeId = this.LoanDisbursementForm.controls['TrnModeCode'].value;
    console.log(GroupCodeId);
    if (GroupCodeId) {
      this.LoanDisbursementForm.patchValue({
        TrnMode: this.getSelectedItemIDGroup(
          GroupCodeId,
          this.inputHelpData2.TrnModeList
        ),
      });
    }
  }
  public getSelectedItemIDGroup(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Trn.Mode !');
      this.LoanDisbursementForm.patchValue({
        TrnMode: 0,
        TrnModeCode: '',
      });
    }
    return selected.Id;
  }

  onChangeTrnMode(event: any) {
    let GroupId = this.LoanDisbursementForm.controls['TrnMode'].value;
    console.log(GroupId);
    if (GroupId) {
      this.LoanDisbursementForm.patchValue({
        TrnModeCode: GroupId,
      });
    }
  }

  // events Vch.No.
  checkIsAllVchNoValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllVchNoStatus = true;
      this.IsVchNoDisabled = true;
      // this.MemberDetailsList = null;
      this.LoanDisbursementForm.controls['VchNo'].setValue('');
      // this.LoanDisbursementForm.controls['MemName'].setValue('');
    } else {
      this.chbIsAllVchNoStatus = false;
      this.IsVchNoDisabled = false;
      this.LoanDisbursementForm.get('VchNo').enable();
    }
  }

  // events TransactionType
  checkIsAllGenderValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGenderStatus = true;

      this.IsGenderDisabled = true;
      this.LoanDisbursementForm.controls['Gender'].setValue('0');
    } else {
      this.chbIsAllGenderStatus = false;
      this.LoanDisbursementForm.get('Gender').enable();
    }
  }

  // events Normal Transaction
  checkIsAllNormalTransactionValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllNormalTransactionStatus = true;

      this.IsNormalTransactionDisabled = true;
      this.LoanDisbursementForm.controls['NormalTransaction'].setValue('0');
    } else {
      this.chbIsAllNormalTransactionStatus = false;
      this.LoanDisbursementForm.get('NormalTransaction').enable();
    }
  }

  // events User id/ teller
  checkIsAllTellerValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllTellerStatus = true;
      this.IsTellerDisabled = true;
      this.LoanDisbursementForm.controls['Teller'].setValue('0');
      this.LoanDisbursementForm.controls['TellerCode'].setValue('');
    } else {
      this.chbIsAllTellerStatus = false;
      this.LoanDisbursementForm.get('Teller').enable();
    }
  }
  onChangeTellerCode(event: any) {
    let TellerCodeId = this.LoanDisbursementForm.controls['TellerCode'].value;
    console.log(TellerCodeId);
    if (TellerCodeId) {
      this.LoanDisbursementForm.patchValue({
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
      this.LoanDisbursementForm.patchValue({
        Teller: 0,
        TellerCode: '',
      });
    }
    return selected.Id;
  }

  onChangeTeller(event: any) {
    let TellerId = this.LoanDisbursementForm.controls['Teller'].value;
    console.log(TellerId);
    if (TellerId) {
      this.LoanDisbursementForm.patchValue({
        TellerCode: TellerId,
      });
    }
  }

  // events Transaction Amount
  checkIsAllPurposeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllPurposeStatus = true;
      this.IsPurposeDisabled = true;
      // this.LoanDisbursementForm.controls['Purpose'].setValue('0');
      this.LoanDisbursementForm.controls['PurposeCode'].setValue('');
    } else {
      this.chbIsAllPurposeStatus = false;
      this.LoanDisbursementForm.get('PurposeCode').enable();
    }
  }

  onChangePurpose(event: any) {
    let PurposeId = this.LoanDisbursementForm.controls['Purpose'].value;
    console.log(PurposeId);
    if (PurposeId) {
      this.LoanDisbursementForm.patchValue({
        PurposeCode: PurposeId,
      });
    }
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
        this.LoanDisbursementForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.LoanDisbursementForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
        this.spinner.hide();
      });
  }

  private setDefaultOptions2(): void {
    this.spinner.show();
    this.journalReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData2 = data;
        console.log(this.inputHelpData2);

        this.spinner.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.LoanDisbursementForm.value;
    this.reportModel.Values = [];

    // report Name

    // if (fValue.chbSkipLoanPurpose) {
    //   this.reportModel.ReportName = 'GLTransactionDetailList';
    // } else {
    //   this.reportModel.ReportName = 'GLTransactionDetailList';
    // }

    if (fValue.rbReportName === '1') {
      //this.reportModel.ReportName = 'GLTransactionDetailList';
      this.reportModel.ReportName = 'rptMGLTransactionDetailList';
    } else if (fValue.rbReportName === '2') {
      //this.reportModel.ReportName = 'GLTransactionSummaryList';
      this.reportModel.ReportName = 'cculbrptMGLTransactionSummaryList';
    } else if (fValue.rbReportName === '3') {
      // this.reportModel.ReportName = 'GLTransactionSummaryListByGLCode';
      this.reportModel.ReportName = 'cculbrptMGLTransactionSummaryListByGLCode';
    } else {
      //this.reportModel.ReportName = 'GLTransactionDetailListByVch';
      this.reportModel.ReportName = 'cculbrptMGLTransactionDetailListByVch';
    }
    // report Name

    // this.reportModel.Values.push(
    //   new ReportKeyValue('rbAccNoWise', fValue.rbAccNoWise)
    // );

    this.reportModel.Values.push(
      new ReportKeyValue('rbCollection', fValue.rbCollection)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );

    this.reportModel.Values.push(new ReportKeyValue('GLCode', fValue.AccType));
    this.reportModel.Values.push(
      new ReportKeyValue('Trn.Type', fValue.TrnType)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('Trn.Mode', fValue.TrnMode)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('TransactionType', fValue.Gender)
    );
    this.reportModel.Values.push(new ReportKeyValue('Teller', fValue.Teller));
    this.reportModel.Values.push(
      new ReportKeyValue('NormalTransactionType', fValue.NormalTransaction)
    );

    // start Transaction Amount
    if (this.chbIsAllPurposeStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('TransactionAmount', '0')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('TransactionAmount', fValue.PurposeCode)
      );
    }

    // start vch no
    if (this.chbIsAllVchNoStatus) {
      this.reportModel.Values.push(new ReportKeyValue('Vch.No.', '0'));
    } else {
      this.reportModel.Values.push(new ReportKeyValue('Vch.No.', fValue.VchNo));
    }

    //start GL Code
    if (this.chbIsAllAccTypeStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('GLCodeDesc', 'All GLCode')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'GlCodeDesc',
          this.getSelectedItemText(
            fValue.AccType,
            this.inputHelpData2.GLcodeList
          )
        )
      );
    }
    // end GL Code

    // start Trn.Mode
    if (this.chbIsAllTrnModeStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('Trn.ModeDesc', 'All Trn.Mode')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'Trn.ModeDesc',
          this.getSelectedItemText(
            fValue.TrnMode,
            this.inputHelpData2.TrnModeList
          )
        )
      );
    }
    // end Trn.Mode

    //start Trn.Type
    if (this.chbIsAllTrnTypeStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('Trn.TypeDesc', 'All Trn.Type')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'Trn.TypeDesc',
          this.getSelectedItemText(
            fValue.TrnType,
            this.inputHelpData2.TrnTypeList
          )
        )
      );
    }
    //end Trn.Type

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

    //start TransactionType
    if (this.chbIsAllGenderStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('TransactionTypeDesc', 'All TransactionType')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'TransactionTypeDesc',
          this.getSelectedItemText(
            fValue.Gender,
            this.inputHelpData2.TransactionTypeList
          )
        )
      );
    }
    // end TransactionType

    //start Normal Transaction
    if (this.chbIsAllNormalTransactionStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('NormalTransactionDesc', 'All Normal Transaction')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'NormalTransactionTypeDesc',
          this.getSelectedItemText(
            fValue.NormalTransaction,
            this.inputHelpData2.NormalTransactionTypeList
          )
        )
      );
    }
    // end Normal Transaction
    this.reportModel.Values.push(
      new ReportKeyValue('rbReportName', fValue.rbReportName)
    );
  }

  public getReportToken = (type: any) => {
    if (
      !this.chbIsAllAccTypeStatus &&
      this.LoanDisbursementForm.controls['AccTypeCode'].value == ''
    ) {
      alert('Please Select GL Code!');
      return;
    }
    if (
      !this.chbIsAllTrnTypeStatus &&
      this.LoanDisbursementForm.controls['TrnTypeCode'].value == ''
    ) {
      alert('Please Select Trn.Type!');
      return;
    }
    if (
      !this.chbIsAllTrnModeStatus &&
      this.LoanDisbursementForm.controls['TrnModeCode'].value == ''
    ) {
      alert('Please Select  Trn.Mode!');
      return;
    }
    if (
      !this.chbIsAllVchNoStatus &&
      this.LoanDisbursementForm.controls['VchNo'].value == ''
    ) {
      alert('Please input Vch.No!');
      return;
    }
    if (
      !this.chbIsAllGenderStatus &&
      this.LoanDisbursementForm.controls['Gender'].value == '0'
    ) {
      alert('Please Select Transaction!');
      return;
    }
    if (
      !this.chbIsAllTellerStatus &&
      this.LoanDisbursementForm.controls['TellerCode'].value == ''
    ) {
      alert('Please Select  User Id!');
      return;
    }
    if (
      !this.chbIsAllNormalTransactionStatus &&
      this.LoanDisbursementForm.controls['NormalTransaction'].value == '0'
    ) {
      alert('Please Select Normal Transaction!');
      return;
    }
    if (
      !this.chbIsAllPurposeStatus &&
      this.LoanDisbursementForm.controls['PurposeCode'].value == ''
    ) {
      alert('Please input Transaction Amount!');
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

  applicationDateChange() {
    var fv = this.LoanDisbursementForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanDisbursementForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.LoanDisbursementForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.LoanDisbursementForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanDisbursementForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.LoanDisbursementForm.value);
    console.log(this.storetDate);
  }
}
