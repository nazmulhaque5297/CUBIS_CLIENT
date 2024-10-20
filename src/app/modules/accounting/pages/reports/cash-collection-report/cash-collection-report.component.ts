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
  selector: 'app-cash-collection-report',
  templateUrl: './cash-collection-report.component.html',
  styleUrls: ['./cash-collection-report.component.css'],
})
export class CashCollectionReportComponent implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
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
  chbIsAllTellerStatus: any;
  chbIsAllMemberStatus: any;
  chbIsAllPurposeStatus: any;
  chbIsAllGenderStatus: any;
  chbIsAllDisburseStatus: any;

  IsAccTypeDisabled: any;
  IsCollectorDisabled: any;
  IsGroupDisabled: any;
  IsTellerDisabled: any;
  IsPurposeDisabled: any;
  IsGenderDisabled: any;
  IsDisburseDisabled: any;

  showSrlWiseOpt: boolean = true;

  CashCollectionReportForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    this.reportModel.ReportName = 'LoanDisbursement';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    this.chbIsAllAccTypeStatus = true;
    this.chbIsAllCollectorStatus = true;
    this.chbIsAllGroupStatus = true;
    this.chbIsAllTellerStatus = true;
    this.chbIsAllMemberStatus = true;

    this.IsAccTypeDisabled = true;
    this.IsCollectorDisabled = true;
    this.IsGroupDisabled = true;
    this.IsTellerDisabled = true;

    this.CashCollectionReportForm = new FormGroup({
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

      IsAllTeller: new FormControl('true'),
      TellerCode: new FormControl(''),
      Teller: new FormControl('0'),

      IsAllMember: new FormControl('true'),
      MemNo: new FormControl(''),
      MemName: new FormControl(''),

      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      chbSkipLoanPurpose: new FormControl('true'),

      rbRptOption: new FormControl('1'),
      rbSrlNoWise: new FormControl('1'),
    });
  }

  //events AccType
  checkIsAllAccTypeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllAccTypeStatus = true;
      this.IsAccTypeDisabled = true;
      this.CashCollectionReportForm.controls['AccType'].setValue('0');
      this.CashCollectionReportForm.controls['AccTypeCode'].setValue('');
    } else {
      this.chbIsAllAccTypeStatus = false;
      this.CashCollectionReportForm.get('AccType').enable();
    }
  }

  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.CashCollectionReportForm.controls['AccTypeCode']
      .value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.CashCollectionReportForm.patchValue({
        AccType: this.getSelectedItemIDAccType(
          AccTypeCodeId,
          this.inputHelpData.cashDisbAccountTypeList
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
      this.CashCollectionReportForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
  }

  onChangeAccType(event: any) {
    let AccTypeId = this.CashCollectionReportForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.CashCollectionReportForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
  }

  // events Collector
  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.CashCollectionReportForm.controls['Collector'].setValue('0');
      this.CashCollectionReportForm.controls['CollectorCode'].setValue('');
    } else {
      this.chbIsAllCollectorStatus = false;
      this.CashCollectionReportForm.get('Collector').enable();
    }
  }

  onChangeCollectorCode(event: any) {
    let CollectorCodeId = this.CashCollectionReportForm.controls[
      'CollectorCode'
    ].value;
    console.log(CollectorCodeId);
    if (CollectorCodeId) {
      this.CashCollectionReportForm.patchValue({
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
      this.CashCollectionReportForm.patchValue({
        Collector: 0,
        CollectorCode: '',
      });
    }
    return selected.Id;
  }

  onChangeCollector(event: any) {
    let CollectorId = this.CashCollectionReportForm.controls['Collector'].value;
    console.log(CollectorId);
    if (CollectorId) {
      this.CashCollectionReportForm.patchValue({
        CollectorCode: CollectorId,
      });
    }
  }

  // events Group
  checkIsAllGroupValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGroupStatus = true;
      this.IsGroupDisabled = true;
      this.CashCollectionReportForm.controls['Group'].setValue('0');
      this.CashCollectionReportForm.controls['GroupCode'].setValue('');
    } else {
      this.chbIsAllGroupStatus = false;
      this.CashCollectionReportForm.get('Group').enable();
    }
  }
  onChangeGroupCode(event: any) {
    let GroupCodeId = this.CashCollectionReportForm.controls['GroupCode'].value;
    console.log(GroupCodeId);
    if (GroupCodeId) {
      this.CashCollectionReportForm.patchValue({
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
      this.CashCollectionReportForm.patchValue({
        Group: 0,
        GroupCode: '',
      });
    }
    return selected.Id;
  }

  onChangeGroup(event: any) {
    let GroupId = this.CashCollectionReportForm.controls['Group'].value;
    console.log(GroupId);
    if (GroupId) {
      this.CashCollectionReportForm.patchValue({
        GroupCode: GroupId,
      });
    }
  }

  // events Member
  checkIsAllMemberValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllMemberStatus = true;
      this.MemberDetailsList = null;
      this.CashCollectionReportForm.controls['MemNo'].setValue('');
      this.CashCollectionReportForm.controls['MemName'].setValue('');
    } else {
      this.chbIsAllMemberStatus = false;
    }
  }

  onChangeMemNo(event: any) {
    let IsOldCheck = this.CashCollectionReportForm.controls['IsOldMem'].value;
    console.log(IsOldCheck);
    let MemNoId = this.CashCollectionReportForm.controls['MemNo'].value;
    console.log(MemNoId);
    if (MemNoId) {
      this.spinner.show();
      this.loanInfoReportService
        .GetMemberDetails(IsOldCheck, MemNoId)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.MemberDetailsList = x;
            // invalid memberno
            if (this.MemberDetailsList.MemberNo == 0) {
              alert('Invalid Member No!');
            }
            if (this.MemberDetailsList.MemberName) {
              this.CashCollectionReportForm.patchValue({
                MemName: this.MemberDetailsList.MemberName,
              });
            }
            console.log(this.MemberDetailsList);
            console.log(this.MemberDetailsList.MemberName);
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.MemberDetailsList = null;
    }
  }

  // events User id/ teller
  checkIsAllTellerValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllTellerStatus = true;
      this.IsTellerDisabled = true;
      this.CashCollectionReportForm.controls['Teller'].setValue('0');
      this.CashCollectionReportForm.controls['TellerCode'].setValue('');
    } else {
      this.chbIsAllTellerStatus = false;
      this.CashCollectionReportForm.get('Teller').enable();
    }
  }
  onChangeTellerCode(event: any) {
    let TellerCodeId = this.CashCollectionReportForm.controls['TellerCode']
      .value;
    console.log(TellerCodeId);
    if (TellerCodeId) {
      this.CashCollectionReportForm.patchValue({
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
      this.CashCollectionReportForm.patchValue({
        Teller: 0,
        TellerCode: '',
      });
    }
    return selected.Id;
  }

  onChangeTeller(event: any) {
    let TellerId = this.CashCollectionReportForm.controls['Teller'].value;
    console.log(TellerId);
    if (TellerId) {
      this.CashCollectionReportForm.patchValue({
        TellerCode: TellerId,
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
        this.CashCollectionReportForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.CashCollectionReportForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
        this.spinner.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.CashCollectionReportForm.value;
    this.reportModel.Values = [];

    // report Name
    if (fValue.rbRptOption === '1' && fValue.rbSrlNoWise === '1') {
      // this.reportModel.ReportName = 'CashCollectionListByMemNo';
      this.reportModel.ReportName = 'rptMCsGenerateCashCollectionListByMemNo';
    }
    if (fValue.rbRptOption === '1' && fValue.rbSrlNoWise === '2') {
      // this.reportModel.ReportName = 'CashCollectionListByIDWise';
      this.reportModel.ReportName = 'rptMCsGenerateCashCollectionListByIDWise';
    }
    if (fValue.rbRptOption === '1' && fValue.rbSrlNoWise === '3') {
      this.reportModel.ReportName = 'rptMCsGenerateCashCollectionListByAccNo';
    }
    if (fValue.rbRptOption === '1' && fValue.rbSrlNoWise === '4') {
      this.reportModel.ReportName = 'rptMCsGenerateCashCollectionListByAccNo';
    }
    if (fValue.rbRptOption === '1' && fValue.rbSrlNoWise === '5') {
      this.reportModel.ReportName = 'rptMCsGenerateCashCollectionListByDate';
    }

    if (fValue.rbRptOption === '2') {
      this.reportModel.ReportName =
        'rptMCsGenerateCashCollectionSummaryListByAccType';
    }
    if (fValue.rbRptOption === '3') {
      this.reportModel.ReportName =
        'rptMCsGenerateCashCollectionSummaryListByAccTypeWithColl';
    }
    if (fValue.rbRptOption === '4') {
      this.reportModel.ReportName =
        'rptMCsGenerateCashCollectionSummaryListByCollector';
    }
    if (fValue.rbRptOption === '5') {
      this.reportModel.ReportName =
        'rptMCsGenerateCashCollectionSummaryListByIDNo';
    }

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );

    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));
    this.reportModel.Values.push(
      new ReportKeyValue('Collector', fValue.Collector)
    );
    this.reportModel.Values.push(new ReportKeyValue('Group', fValue.Group));

    this.reportModel.Values.push(new ReportKeyValue('Teller', fValue.Teller));

    if (fValue.MemNo == '') {
      this.reportModel.Values.push(new ReportKeyValue('MemNo', '0'));
    } else {
      this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));
    }

    //start Member
    if (this.chbIsAllMemberStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('MemberDesc', 'All Member')
      );
    } else {
      var mName = this.MemberDetailsList.MemberName;
      this.reportModel.Values.push(new ReportKeyValue('MemberDesc', mName));
    }
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
            this.inputHelpData.cashDisbAccountTypeList
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
  }

  // Detail Report uncheck event
  onChangeRptOption = (event: any) => {
    if (event.target.value == '1') {
      console.log('detail rpt is now selected');
      this.showSrlWiseOpt = true;
    } else {
      this.showSrlWiseOpt = false;
    }
  };

  public getReportToken = (type: any) => {
    if (
      !this.chbIsAllAccTypeStatus &&
      this.CashCollectionReportForm.controls['AccTypeCode'].value == ''
    ) {
      alert('Please Select Account Type!');
      return;
    }
    if (
      !this.chbIsAllCollectorStatus &&
      this.CashCollectionReportForm.controls['CollectorCode'].value == ''
    ) {
      alert('Please Select Collector Code!');
      return;
    }
    if (
      !this.chbIsAllGroupStatus &&
      this.CashCollectionReportForm.controls['GroupCode'].value == ''
    ) {
      alert('Please Select Group Name!');
      return;
    }
    if (
      !this.chbIsAllMemberStatus &&
      this.CashCollectionReportForm.controls['MemNo'].value == ''
    ) {
      alert('Please Select Member No!');
      return;
    }
    if (
      !this.chbIsAllTellerStatus &&
      this.CashCollectionReportForm.controls['TellerCode'].value == ''
    ) {
      alert('Please Select User Id!');
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
    var fv = this.CashCollectionReportForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CashCollectionReportForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.CashCollectionReportForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.CashCollectionReportForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CashCollectionReportForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.CashCollectionReportForm.value);
    console.log(this.storetDate);
  }
}
