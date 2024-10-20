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
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';

@Component({
  selector: 'app-cs-daily-transaction-report',
  templateUrl: './cs-daily-transaction-report.component.html',
  styleUrls: ['./cs-daily-transaction-report.component.css'],
})
export class CsDailyTransactionReportComponent implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  public inputHelpData2: JournalReportInputHelp = new JournalReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  storefDate: any;
  storetDate: any;

  chbIsAllAccTypeStatus: any;
  chbIsAllCollectorStatus: any;
  chbIsAllGroupStatus: any;
  chbIsAllTrnTypeStatus: any;
  chbIsAllTrnModeStatus: any;
  chbIsAllTellerStatus: any;
  chbIsAllVchNoStatus: any;
  chbIsAllNormalTransactionStatus: any;

  chbIsAllPurposeStatus: any;

  // chbIsAllMemberStatus: any;
  //chbIsAllGenderStatus: any;
  //chbIsAllDisburseStatus: any;

  IsAccTypeDisabled: any;
  IsCollectorDisabled: any;
  IsGroupDisabled: any;
  IsTrnTypeDisabled: any;
  IsTrnModeDisabled: any;
  IsTellerDisabled: any;
  IsPurposeDisabled: any;
  IsVchNoDisabled: any;
  IsNormalTransactionDisabled: any;

  //IsGenderDisabled: any;
  //IsDisburseDisabled: any;

  LoanDisbursementForm: FormGroup;

  storeFvalue: any;
  storeTvalue: any;

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
    this.reportModel.ReportName = 'MCSProductCashCollectionListByCollector';
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
    this.chbIsAllCollectorStatus = true;
    this.chbIsAllGroupStatus = true;
    this.chbIsAllTrnTypeStatus = true;
    this.chbIsAllTrnModeStatus = true;
    this.chbIsAllTellerStatus = true;
    // this.chbIsAllMemberStatus = true;
    this.chbIsAllPurposeStatus = true;
    this.chbIsAllVchNoStatus = true;
    this.chbIsAllNormalTransactionStatus = true;
    //this.chbIsAllGenderStatus = true;
    // this.chbIsAllDisburseStatus = true;

    this.IsAccTypeDisabled = true;
    this.IsCollectorDisabled = true;
    this.IsGroupDisabled = true;
    this.IsTrnTypeDisabled = true;
    this.IsTrnModeDisabled = true;
    this.IsTellerDisabled = true;
    this.IsPurposeDisabled = true;
    this.IsVchNoDisabled = true;
    this.IsNormalTransactionDisabled = true;

    //this.IsGenderDisabled = true;
    // this.IsDisburseDisabled = true;

    this.LoanDisbursementForm = new FormGroup({
      IsOldMem: new FormControl(false),

      IsAllAccType: new FormControl('true'),
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
      IsAllCollector: new FormControl('true'),
      CollectorCode: new FormControl(''),
      Collector: new FormControl('0'),
      IsAllGroup: new FormControl('true'),
      GroupCode: new FormControl(''),
      Group: new FormControl('0'),

      IsAllTrnType: new FormControl('true'),
      TrnTypeCode: new FormControl(''),
      TrnType: new FormControl('0'),

      IsAllTrnMode: new FormControl('true'),
      TrnModeCode: new FormControl(''),
      TrnMode: new FormControl('0'),

      IsAllTeller: new FormControl('true'),
      TellerCode: new FormControl(''),
      Teller: new FormControl('0'),

      IsAllVchNo: new FormControl('true'),
      VchNo: new FormControl(''),

      IsAllNormalTransaction: new FormControl('true'),
      NormalTransaction: new FormControl('0'),

      rbCollection: new FormControl('0'),

      IsAllPurpose: new FormControl('true'),
      PurposeCode: new FormControl(''),
      Purpose: new FormControl('0'),

      // IsAllMember: new FormControl('true'),
      // MemNo: new FormControl(''),
      // MemName: new FormControl(''),

      // IsAllGender: new FormControl('true'),
      //Gender: new FormControl('0'),

      // IsAllDisburse: new FormControl('true'),
      // Disburse: new FormControl('0'),

      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),

      rbReportName: new FormControl(''),
      test: new FormControl(''),
      // chbSkipLoanPurpose: new FormControl('true'),
      // rbAccNoWise: new FormControl('1'),
    });
  }

  //events AccType
  checkIsAllAccTypeValue(e) {
    setTimeout(() => {
      document.getElementById(`AccTypeCode`).focus();
    }, 100);
    if (e) {
      this.chbIsAllAccTypeStatus = true;
      this.IsAccTypeDisabled = true;
      this.LoanDisbursementForm.controls['AccType'].setValue('0');
      this.LoanDisbursementForm.controls['AccTypeCode'].setValue('');
      // this.LoanDisbursementForm.value.AccType = "0";
      console.log('this i svalue', this.LoanDisbursementForm.value.AccType);
    } else {
      this.chbIsAllAccTypeStatus = false;
      this.LoanDisbursementForm.get('AccType').enable();
    }
  }

  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.LoanDisbursementForm.controls['AccTypeCode'].value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.LoanDisbursementForm.patchValue({
        AccType: this.getSelectedItemIDAccType(
          AccTypeCodeId,
          this.inputHelpData.accTransferAccountTypeList
        ),
      });
    }
  }
  public getSelectedItemIDAccType(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Account Type!');
      this.LoanDisbursementForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
  }

  onChangeAccType(event: any) {
    let AccTypeId = this.LoanDisbursementForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.LoanDisbursementForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
  }

  // events Collector
  checkIsAllCollectorValue(e) {
    setTimeout(() => {
      document.getElementById(`CollectorCode`).focus();
    }, 100);

    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.LoanDisbursementForm.controls['Collector'].setValue('0');
      this.LoanDisbursementForm.controls['CollectorCode'].setValue('');
    } else {
      this.chbIsAllCollectorStatus = false;
      this.LoanDisbursementForm.get('Collector').enable();
    }
  }

  onChangeCollectorCode(event: any) {
    let CollectorCodeId = this.LoanDisbursementForm.controls['CollectorCode']
      .value;
    console.log(CollectorCodeId);
    if (CollectorCodeId) {
      this.LoanDisbursementForm.patchValue({
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
      this.LoanDisbursementForm.patchValue({
        Collector: 0,
        CollectorCode: '',
      });
    }
    return selected.Id;
  }

  onChangeCollector(event: any) {
    let CollectorId = this.LoanDisbursementForm.controls['Collector'].value;
    console.log(CollectorId);
    if (CollectorId) {
      this.LoanDisbursementForm.patchValue({
        CollectorCode: CollectorId,
      });
    }
  }

  // events Group
  checkIsAllGroupValue(e) {
    setTimeout(() => {
      document.getElementById(`GroupCode`).focus();
    }, 100);
    if (e) {
      this.chbIsAllGroupStatus = true;
      this.IsGroupDisabled = true;
      this.LoanDisbursementForm.controls['Group'].setValue('0');
      this.LoanDisbursementForm.controls['GroupCode'].setValue('');
    } else {
      this.chbIsAllGroupStatus = false;
      this.LoanDisbursementForm.get('Group').enable();
    }
  }

  onChangeGroupCode(event: any) {
    let GroupCodeId = this.LoanDisbursementForm.controls['GroupCode'].value;
    console.log(GroupCodeId);
    if (GroupCodeId) {
      this.LoanDisbursementForm.patchValue({
        Group: this.getSelectedItemIDGroup(
          GroupCodeId,
          this.inputHelpData.GroupList
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
      alert('Invalid Group !');
      this.LoanDisbursementForm.patchValue({
        Group: 0,
        GroupCode: '',
      });
    }
    return selected.Id;
  }

  onChangeGroup(event: any) {
    let GroupId = this.LoanDisbursementForm.controls['Group'].value;
    console.log(GroupId);
    if (GroupId) {
      this.LoanDisbursementForm.patchValue({
        GroupCode: GroupId,
      });
    }
  }

  // events Trn.Type
  checkIsAllTrnTypeValue(e) {
    setTimeout(() => {
      document.getElementById(`TrnTypeCode`).focus();
    }, 100);
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
    console.log(CollectorCodeId);
    if (CollectorCodeId) {
      this.LoanDisbursementForm.patchValue({
        TrnType: this.getSelectedItemIDTrnType(
          CollectorCodeId,
          this.inputHelpData2.TrnTypeList
        ),
      });
    }
  }

  public getSelectedItemIDTrnType(
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
    setTimeout(() => {
      document.getElementById(`TrnModeCode`).focus();
    }, 100);
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
        TrnMode: this.getSelectedItemIDTrnMode(
          GroupCodeId,
          this.inputHelpData2.TrnModeListDailyTransactionReport
        ),
      });
    }
  }
  public getSelectedItemIDTrnMode(
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

  // events Member
  // checkIsAllMemberValue(e) {
  //   console.log(e);
  //   if (e) {
  //     this.chbIsAllMemberStatus = true;
  //     this.MemberDetailsList = null;
  //     this.LoanDisbursementForm.controls['MemNo'].setValue('');
  //     this.LoanDisbursementForm.controls['MemName'].setValue('');
  //   } else {
  //     this.chbIsAllMemberStatus = false;
  //   }
  // }

  // onChangeMemNo(event: any) {
  //   let IsOldCheck = this.LoanDisbursementForm.controls['IsOldMem'].value;
  //   console.log(IsOldCheck);
  //   let MemNoId = this.LoanDisbursementForm.controls['MemNo'].value;
  //   console.log(MemNoId);
  //   if (MemNoId) {
  //     this.spinner.show();
  //     this.loanInfoReportService
  //       .GetMemberDetails(IsOldCheck, MemNoId)
  //       .pipe(first())
  //       .subscribe(
  //         (x: any) => {
  //           this.spinner.hide();
  //           this.MemberDetailsList = x;
  //           // invalid memberno
  //           if (this.MemberDetailsList.MemberNo == 0) {
  //             alert('Invalid Member No!');
  //           }
  //           if (this.MemberDetailsList.MemberName) {
  //             this.LoanDisbursementForm.patchValue({
  //               MemName: this.MemberDetailsList.MemberName,
  //             });
  //           }
  //           console.log(this.MemberDetailsList);
  //           console.log(this.MemberDetailsList.MemberName);
  //         },
  //         (err) => {
  //           this.spinner.hide();
  //         }
  //       );
  //   } else {
  //     this.MemberDetailsList = null;
  //   }
  // }

  // events Gender
  // checkIsAllGenderValue(e) {
  //   console.log(e);
  //   if (e) {
  //     this.chbIsAllGenderStatus = true;

  //     this.IsGenderDisabled = true;
  //     this.LoanDisbursementForm.controls['Gender'].setValue('0');
  //   } else {
  //     this.chbIsAllGenderStatus = false;
  //     this.LoanDisbursementForm.get('Gender').enable();
  //   }
  // }

  // events Disburse
  // checkIsAllDisburseValue(e) {
  //   console.log(e);
  //   if (e) {
  //     this.chbIsAllDisburseStatus = true;

  //     this.IsDisburseDisabled = true;
  //     this.LoanDisbursementForm.controls['Disburse'].setValue('0');
  //   } else {
  //     this.chbIsAllDisburseStatus = false;
  //     this.LoanDisbursementForm.get('Disburse').enable();
  //   }
  // }

  // events User id/ teller
  checkIsAllTellerValue(e) {
    setTimeout(() => {
      document.getElementById(`TellerCode`).focus();
    }, 100);
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

  // events Purpose//////TrnNature
  checkIsAllPurposeValue(e) {
    setTimeout(() => {
      document.getElementById(`PurposeCode`).focus();
    }, 100);
    if (e) {
      this.chbIsAllPurposeStatus = true;
      this.IsPurposeDisabled = true;
      this.LoanDisbursementForm.controls['Purpose'].setValue('0');
      this.LoanDisbursementForm.controls['PurposeCode'].setValue('');
    } else {
      this.chbIsAllPurposeStatus = false;
      this.LoanDisbursementForm.get('Purpose').enable();
    }
  }

  onChangePurposeCode(event: any) {
    let PurposeCodeId = this.LoanDisbursementForm.controls['PurposeCode'].value;
    console.log(PurposeCodeId);
    if (PurposeCodeId) {
      this.LoanDisbursementForm.patchValue({
        Purpose: this.getSelectedItemIDPurpose(
          PurposeCodeId,
          this.inputHelpData2.TrnNatureListDailyTransactionReport
        ),
      });
    }
  }

  public getSelectedItemIDPurpose(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Loan Purpose !');
      this.LoanDisbursementForm.patchValue({
        Purpose: 0,
        PurposeCode: '',
      });
    }
    return selected.Id;
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

  // events Vch.No.
  checkIsAllVchNoValue(e) {
    setTimeout(() => {
      document.getElementById(`VchNo`).focus();
    }, 100);
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
        this.spinner.hide();
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
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
    if (fValue.rbReportName === '1') {
      // this.reportModel.ReportName = 'CSTransactionDetailListByVch';
      this.reportModel.ReportName = 'rptMCSTransactionDetailListByVch';
    } else if (fValue.rbReportName === '2') {
      // this.reportModel.ReportName = 'CSTransactionDetailListCollWise';
      this.reportModel.ReportName = 'rptMCSTransactionDetailListCollWise';
    } else if (fValue.rbReportName === '3') {
      // this.reportModel.ReportName = 'CSTransactionDetailListOldAccWise';
      this.reportModel.ReportName = 'rptMCSTransactionDetailListOldAccWise';
    } else if (fValue.rbReportName === '4') {
      //this.reportModel.ReportName = 'CSTransactionDetailListDateTimeWise';
      this.reportModel.ReportName = 'rptMCSTransactionDetailListDateTimeWise';
    } else {
      //this.reportModel.ReportName = 'CSTransactionDetailList';
      this.reportModel.ReportName = 'rptMCSTransactionDetailList';
    }

    // if (fValue.chbSkipLoanPurpose) {
    //   this.reportModel.ReportName = 'CSTransactionDetailList';
    // } else {
    //   this.reportModel.ReportName = 'CSTransactionDetailListByVch';
    // }

    // if (fValue.rbAccNoWise === '1') {
    //   this.reportModel.ReportName = 'LoanDisbursement';
    // } else {
    //   this.reportModel.ReportName = 'LoanDisbursement';
    // }
    // report Name

    // this.reportModel.Values.push(
    //   new ReportKeyValue('rbAccNoWise', fValue.rbAccNoWise)
    // );

    this.reportModel.Values.push(
      new ReportKeyValue('rbCollection', fValue.rbCollection)
    );
    console.log('Fvalue', fValue);
    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );

    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));
    console.log('this is pushed value', fValue.AccType);
    this.reportModel.Values.push(
      new ReportKeyValue('Collector', fValue.Collector)
    );
    this.reportModel.Values.push(new ReportKeyValue('Group', fValue.Group));

    this.reportModel.Values.push(
      new ReportKeyValue('Trn.Type', fValue.TrnType)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('Trn.Mode', fValue.TrnMode)
    );
    // this.reportModel.Values.push(new ReportKeyValue('Gender', fValue.Gender));
    this.reportModel.Values.push(new ReportKeyValue('Teller', fValue.Teller));
    // this.reportModel.Values.push(
    //   new ReportKeyValue('Disburse', fValue.Disburse)
    // );
    this.reportModel.Values.push(
      new ReportKeyValue('TrnNature', fValue.Purpose)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('NormalTransactionType', fValue.NormalTransaction)
    );

    // this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));
    //start Member
    // if (this.chbIsAllMemberStatus) {
    //   this.reportModel.Values.push(
    //     new ReportKeyValue('MemberDesc', 'All Member')
    //   );
    // } else {
    //   var mName = this.MemberDetailsList.MemberName;
    //   this.reportModel.Values.push(new ReportKeyValue('MemberDesc', mName));
    // }
    //  end Member

    //start AccType
    if (this.chbIsAllAccTypeStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('AccTypeDesc', 'All AccType')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'AccTypeDesc',
          this.getSelectedItemText(
            fValue.AccType,
            this.inputHelpData.accTransferAccountTypeList
          )
        )
      );
    }
    // end AccType

    // start Group
    if (this.chbIsAllGroupStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('GroupDesc', 'All Group')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'GroupDesc',
          this.getSelectedItemText(fValue.Group, this.inputHelpData.GroupList)
        )
      );
    }
    // end Group

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
            this.inputHelpData2.TrnModeListDailyTransactionReport
          )
        )
      );
    }
    // end Trn.Mode

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

    //start Gender
    // if (this.chbIsAllGenderStatus) {
    //   this.reportModel.Values.push(
    //     new ReportKeyValue('GenderDesc', 'All Gender')
    //   );
    // } else {
    //   this.reportModel.Values.push(
    //     new ReportKeyValue(
    //       'GenderDesc',
    //       this.getSelectedItemText(
    //         fValue.Gender,
    //         this.inputHelpData.loanDisbGenderList
    //       )
    //     )
    //   );
    // }
    // end Gender

    //start Disburse
    // if (this.chbIsAllDisburseStatus) {
    //   this.reportModel.Values.push(
    //     new ReportKeyValue('DisburseDesc', 'All Disburse')
    //   );
    // } else {
    //   this.reportModel.Values.push(
    //     new ReportKeyValue(
    //       'DisburseDesc',
    //       this.getSelectedItemText(
    //         fValue.Disburse,
    //         this.inputHelpData.loanDisbDisburseTypeList
    //       )
    //     )
    //   );
    // }
    // end Disburse

    //start Purpose //// TrnNature
    if (this.chbIsAllPurposeStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('TrnNatureDesc', 'All Trn. Nature')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'TrnNatureDesc',
          this.getSelectedItemText(
            fValue.Purpose,
            this.inputHelpData2.TrnNatureListDailyTransactionReport
          )
        )
      );
    }
    //console.log('Loan Purpose List :', this.inputHelpData.LPurposeList);
    // end Purpose ////  TrnNature

    // start vch no
    if (this.chbIsAllVchNoStatus) {
      this.reportModel.Values.push(new ReportKeyValue('Vch.No.', '0'));
    } else {
      this.reportModel.Values.push(new ReportKeyValue('Vch.No.', fValue.VchNo));
    }

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
  }

  public getReportToken = (type: any) => {
    if (
      !this.chbIsAllAccTypeStatus &&
      this.LoanDisbursementForm.controls['AccTypeCode'].value == ''
    ) {
      alert('Please Select Account Type!');
      return;
    }
    if (
      !this.chbIsAllCollectorStatus &&
      this.LoanDisbursementForm.controls['CollectorCode'].value == ''
    ) {
      alert('Please Select Collector Code!');
      return;
    }
    if (
      !this.chbIsAllGroupStatus &&
      this.LoanDisbursementForm.controls['GroupCode'].value == ''
    ) {
      alert('Please Select Group Name!');
      return;
    }
    if (
      !this.chbIsAllTrnTypeStatus &&
      this.LoanDisbursementForm.controls['TrnTypeCode'].value == ''
    ) {
      alert('Please Select TrnType!');
      return;
    }
    if (
      !this.chbIsAllTrnModeStatus &&
      this.LoanDisbursementForm.controls['TrnModeCode'].value == ''
    ) {
      alert('Please Select Trn.Mode!');
      return;
    }
    if (
      !this.chbIsAllPurposeStatus &&
      this.LoanDisbursementForm.controls['PurposeCode'].value == ''
    ) {
      alert('Please Select Trn.Nature!');
      return;
    }
    if (
      !this.chbIsAllTellerStatus &&
      this.LoanDisbursementForm.controls['TellerCode'].value == ''
    ) {
      alert('Please Select User Id!');
      return;
    }
    if (
      !this.chbIsAllVchNoStatus &&
      this.LoanDisbursementForm.controls['VchNo'].value == ''
    ) {
      alert('Please Select Vch.No!');
      return;
    }
    if (
      !this.chbIsAllNormalTransactionStatus &&
      this.LoanDisbursementForm.controls['NormalTransaction'].value == '0'
    ) {
      alert('Please Select NormalTransaction!');
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

  FromDateLabelClicked() {
    document.getElementById(`dateFormat`).focus();
    document.getElementById(`dateFormat`).click();
  }

  ToDateLabelClicked() {
    document.getElementById(`toDateFormat`).focus();
    document.getElementById(`toDateFormat`).click();
  }

  public Test(e: any) {
    document.getElementById(`AccTypeCode`).focus();
  }
}
