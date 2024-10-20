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
import { LoanReceivedReportInputHelp } from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';

@Component({
  selector: 'app-cash-disbursement-report',
  templateUrl: './cash-disbursement-report.component.html',
  styleUrls: ['./cash-disbursement-report.component.css'],
})
export class CashDisbursementReportComponent implements OnInit, OnDestroy {
  //module:string = "1";
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
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

  IsAccTypeDisabled: any;
  IsCollectorDisabled: any;
  IsGroupDisabled: any;
  IsTellerDisabled: any;

  CashDisbursementListForm: FormGroup;
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    this.reportModel.ReportName = 'CashDisbursementList';
    //this.reportModel.ReportName = 'CashDisbursementListByVchNo';
    //this.reportModel.ReportName = 'CashDisbursementSummaryList';
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
    this.CashDisbursementListForm = new FormGroup({
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
      rbDetails: new FormControl('1'),
      rbByMemNo: new FormControl('1'),
    });
  }
  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.CashDisbursementListForm.controls['AccTypeCode']
      .value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.CashDisbursementListForm.patchValue({
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
      this.CashDisbursementListForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
  }
  onChangeAccType(event: any) {
    let AccTypeId = this.CashDisbursementListForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.CashDisbursementListForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
  }
  checkIsAllAccTypeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllAccTypeStatus = true;
      this.IsAccTypeDisabled = true;
      this.CashDisbursementListForm.controls['AccType'].setValue('0');
      this.CashDisbursementListForm.controls['AccTypeCode'].setValue('');
    } else {
      this.chbIsAllAccTypeStatus = false;
      this.CashDisbursementListForm.get('AccType').enable();
    }
  }
  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.CashDisbursementListForm.controls['Collector'].setValue('0');
      this.CashDisbursementListForm.controls['CollectorCode'].setValue('');
    } else {
      this.chbIsAllCollectorStatus = false;
      this.CashDisbursementListForm.get('Collector').enable();
    }
  }
  onChangeCollectorCode(event: any) {
    let CollectorCodeId = this.CashDisbursementListForm.controls[
      'CollectorCode'
    ].value;
    console.log(CollectorCodeId);
    if (CollectorCodeId) {
      this.CashDisbursementListForm.patchValue({
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
      this.CashDisbursementListForm.patchValue({
        Collector: 0,
        CollectorCode: '',
      });
    }
    return selected.Id;
  }
  onChangeCollector(event: any) {
    let CollectorId = this.CashDisbursementListForm.controls['Collector'].value;
    console.log(CollectorId);
    if (CollectorId) {
      this.CashDisbursementListForm.patchValue({
        CollectorCode: CollectorId,
      });
    }
  }
  checkIsAllGroupValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGroupStatus = true;
      this.IsGroupDisabled = true;
      this.CashDisbursementListForm.controls['Group'].setValue('0');
      this.CashDisbursementListForm.controls['GroupCode'].setValue('');
    } else {
      this.chbIsAllGroupStatus = false;
      this.CashDisbursementListForm.get('Group').enable();
    }
  }
  onChangeGroupCode(event: any) {
    let GroupCodeId = this.CashDisbursementListForm.controls['GroupCode'].value;
    console.log(GroupCodeId);
    if (GroupCodeId) {
      this.CashDisbursementListForm.patchValue({
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
      this.CashDisbursementListForm.patchValue({
        Group: 0,
        GroupCode: '',
      });
    }
    return selected.Id;
  }

  onChangeGroup(event: any) {
    let GroupId = this.CashDisbursementListForm.controls['Group'].value;
    console.log(GroupId);
    if (GroupId) {
      this.CashDisbursementListForm.patchValue({
        GroupCode: GroupId,
      });
    }
  }

  checkIsAllTellerValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllTellerStatus = true;
      this.IsTellerDisabled = true;
      this.CashDisbursementListForm.controls['Teller'].setValue('0');
      this.CashDisbursementListForm.controls['TellerCode'].setValue('');
    } else {
      this.chbIsAllTellerStatus = false;
      this.CashDisbursementListForm.get('Teller').enable();
    }
  }
  onChangeTellerCode(event: any) {
    let TellerCodeId = this.CashDisbursementListForm.controls['TellerCode']
      .value;
    console.log(TellerCodeId);
    if (TellerCodeId) {
      this.CashDisbursementListForm.patchValue({
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
      this.CashDisbursementListForm.patchValue({
        Teller: 0,
        TellerCode: '',
      });
    }
    return selected.Id;
  }

  onChangeTeller(event: any) {
    let TellerId = this.CashDisbursementListForm.controls['Teller'].value;
    console.log(TellerId);
    if (TellerId) {
      this.CashDisbursementListForm.patchValue({
        TellerCode: TellerId,
      });
    }
  }

  checkIsAllMemberValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllMemberStatus = true;
      this.MemberDetailsList = null;
      this.CashDisbursementListForm.controls['MemNo'].setValue('');
      this.CashDisbursementListForm.controls['MemName'].setValue('');
    } else {
      this.chbIsAllMemberStatus = false;
    }
  }

  onChangeMemNo(event: any) {
    let IsOldCheck = this.CashDisbursementListForm.controls['IsOldMem'].value;
    console.log(IsOldCheck);
    let MemNoId = this.CashDisbursementListForm.controls['MemNo'].value;
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
              this.CashDisbursementListForm.patchValue({
                //MemNo: this.MemberDetailsList.MemberNo,
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

  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.CashDisbursementListForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.CashDisbursementListForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.spinner.hide();
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
      });
  }

  private setParameter(): void {
    var fValue = this.CashDisbursementListForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('rbDetails', fValue.rbDetails)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('rbByMemNo', fValue.rbByMemNo)
    );
    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));
    this.reportModel.Values.push(new ReportKeyValue('Group', fValue.Group));
    this.reportModel.Values.push(
      new ReportKeyValue('Collector', fValue.Collector)
    );
    this.reportModel.Values.push(new ReportKeyValue('Teller', fValue.Teller));
    this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));

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
    //end Teller

    //start Member
    if (this.chbIsAllMemberStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('MemberDesc', 'All Member')
      );
    } else {
      var mName = this.MemberDetailsList.MemberName;
      this.reportModel.Values.push(new ReportKeyValue('MemberDesc', mName));
    }
    // end Member

    if (fValue.rbDetails === '0') {
      // this.reportModel.ReportName = 'CashDisbursementSummaryList';
      this.reportModel.ReportName = 'rptMCsGenerateCashDisbursemenSummaryList';
    }
    if (fValue.rbDetails === '1' && fValue.rbByMemNo === '1') {
      //this.reportModel.ReportName = 'CashDisbursementList';
      this.reportModel.ReportName = 'rptMCsGenerateCashDisbursementList';
    }
    if (fValue.rbDetails === '1' && fValue.rbByMemNo === '0') {
      //this.reportModel.ReportName = 'CashDisbursementListByVchNo';
      this.reportModel.ReportName = 'rptMCsGenerateCashDisbursementListByVchNo';
    }
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getReportToken = (type: any) => {
    if (
      !this.chbIsAllAccTypeStatus &&
      this.CashDisbursementListForm.controls['AccTypeCode'].value == ''
    ) {
      alert('Please Select Account Type!');
      return;
    }
    if (
      !this.chbIsAllCollectorStatus &&
      this.CashDisbursementListForm.controls['CollectorCode'].value == ''
    ) {
      alert('Please Select Collector Code!');
      return;
    }
    if (
      !this.chbIsAllGroupStatus &&
      this.CashDisbursementListForm.controls['GroupCode'].value == ''
    ) {
      alert('Please Select Group Name!');
      return;
    }
    if (
      !this.chbIsAllMemberStatus &&
      this.CashDisbursementListForm.controls['MemNo'].value == ''
    ) {
      alert('Please Select Member No!');
      return;
    }
    if (
      !this.chbIsAllTellerStatus &&
      this.CashDisbursementListForm.controls['TellerCode'].value == ''
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
  // applicationDateChange() {
  //   var value = this.datepipe.transform(
  //     this.CashDisbursementListForm.value.IssueFromDate,
  //     'dd-MM-yyyy'
  //   );
  //   var formatedValue = this.aService.convertDateToString(value);
  //   this.CashDisbursementListForm.value.IssueFromDate = formatedValue;
  //   var value = this.datepipe.transform(
  //     this.CashDisbursementListForm.value.IssueToDate,
  //     'dd-MM-yyyy'
  //   );
  //   this.CashDisbursementListForm.value.IssueToDate =
  //     this.aService.convertDateToString(value);
  //   console.log('this is formated from date', formatedValue);
  //   console.log('fvalue', this.CashDisbursementListForm.value);
  // }
  // applicationDateChange2() {
  //   var value = this.datepipe.transform(
  //     this.CashDisbursementListForm.value.IssueToDate,
  //     'dd-MM-yyyy'
  //   );
  //   var formatedValue = this.aService.convertDateToString(value);
  //   this.CashDisbursementListForm.value.IssueToDate = formatedValue;
  //   var value = this.datepipe.transform(
  //     this.CashDisbursementListForm.value.IssueFromDate,
  //     'dd-MM-yyyy'
  //   );
  //   this.CashDisbursementListForm.value.IssueFromDate =
  //     this.aService.convertDateToString(value);
  //   console.log('this is formated to date', formatedValue);
  //   console.log('fvalue', this.CashDisbursementListForm.value);
  // }

  applicationDateChange() {
    var fv = this.CashDisbursementListForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CashDisbursementListForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.CashDisbursementListForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.CashDisbursementListForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CashDisbursementListForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.CashDisbursementListForm.value);
    console.log(this.storetDate);
  }
}
