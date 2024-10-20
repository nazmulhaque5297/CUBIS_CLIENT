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
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  selector: 'app-ledger-balance-report',
  templateUrl: './ledger-balance-report.component.html',
  styleUrls: ['./ledger-balance-report.component.css'],
})
export class LedgerBalanceReportComponent implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  chbIsAllCollectorStatus: any;
  chbIsAllGroupStatus: any;
  chbIsAllAccStatusStatus: any;
  chbIsAllMemberStatusStatus: any;
  chbIsAllGenderStatus: any;
  chbIsAllBalanceStatus: any;
  chbIsAllOldAccNoStatus: any;

  IsCollectorDisabled: any;
  IsGroupDisabled: any;
  IsAccStatusDisabled: any;
  IsMemberStatusDisabled: any;
  IsGenderDisabled: any;
  IsBalanceDisabled: any;
  IsOldAccNoFromDisabled: any;
  IsOldAccNoToDisabled: any;

  showFromTillBalance: boolean = false;

  amountSign: number = 1;
  amountSignText: string = 'Positive';
  toggle: boolean = true;
  storeBDate: any;

  LedgerBalanceReportForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    // this.reportModel.ReportName = 'CsGenerateLedgerBalance1';
    this.reportModel.ReportName = 'CsGenerateLedgerBalance2';
    //this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    this.chbIsAllCollectorStatus = true;
    this.chbIsAllGroupStatus = true;
    this.chbIsAllAccStatusStatus = true;
    this.chbIsAllMemberStatusStatus = true;
    this.chbIsAllGenderStatus = true;
    this.chbIsAllBalanceStatus = true;
    this.chbIsAllOldAccNoStatus = true;

    this.IsCollectorDisabled = true;
    this.IsGroupDisabled = true;
    this.IsAccStatusDisabled = true;
    this.IsMemberStatusDisabled = true;
    this.IsGenderDisabled = true;
    this.IsBalanceDisabled = true;
    this.IsOldAccNoFromDisabled = true;
    this.IsOldAccNoToDisabled = true;

    this.LedgerBalanceReportForm = new FormGroup({
      BalanceDate: new FormControl(''),

      AccTypeCode: new FormControl('', [Validators.required]),
      AccType: new FormControl('0'),
      IsAllCollector: new FormControl('true'),
      CollectorCode: new FormControl(''),
      Collector: new FormControl('0'),
      IsAllGroup: new FormControl('true'),
      GroupCode: new FormControl(''),
      Group: new FormControl('0'),
      IsAllAccStatus: new FormControl('true'),
      AccStatus: new FormControl('0'),
      IsAllMemberStatus: new FormControl('true'),
      MemberStatus: new FormControl('0'),
      IsAllGender: new FormControl('true'),
      Gender: new FormControl('0'),
      IsAllBalance: new FormControl('true'),
      Balance: new FormControl('0'),
      FromBalance: new FormControl('1.00'),
      TillBalance: new FormControl('99,999,999,999.00'),
      IsAllOldAccNo: new FormControl('true'),
      OldAccNoFrom: new FormControl(''),
      OldAccNoTo: new FormControl(''),

      rbOldAccNoWise: new FormControl('2'),
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.LedgerBalanceReportForm.controls['BalanceDate'].setValue(
          data.ApplicationDate
        );
        this.storeBDate = data.ApplicationDate;
        this.spinner.hide();
      });
  }

  //events A/C Type
  onChangeAccType(event: any) {
    let AccTypeId = this.LedgerBalanceReportForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.LedgerBalanceReportForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
    //start get acctype class
    this.spinner.show();
    this.loanReceivedReportService
      .getAccTypeClassDetails(AccTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accTypeClassData = data;
        console.log('This is accTypeClassData=', this.accTypeClassData);
        this.spinner.hide();

        (err) => {
          this.spinner.hide();
        };
      });
    //end get acctype class
  }
  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.LedgerBalanceReportForm.controls['AccTypeCode']
      .value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.LedgerBalanceReportForm.patchValue({
        AccType: this.getSelectedItemIDAccType(
          AccTypeCodeId,
          this.inputHelpData.accTransferAccountTypeList
        ),
      });
    }
    //start get acctype class
    this.spinner.show();
    this.loanReceivedReportService
      .getAccTypeClassDetails(AccTypeCodeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accTypeClassData = data;
        console.log('This is accTypeClassData=', this.accTypeClassData);
        this.spinner.hide();

        (err) => {
          this.spinner.hide();
        };
      });
    //end get acctype class
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
      this.LedgerBalanceReportForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
  }

  // events Collector
  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.LedgerBalanceReportForm.controls['Collector'].setValue('0');
      this.LedgerBalanceReportForm.controls['CollectorCode'].setValue('');
    } else {
      this.chbIsAllCollectorStatus = false;
      this.LedgerBalanceReportForm.get('Collector').enable();
    }
  }

  onChangeCollectorCode(event: any) {
    let CollectorCodeId = this.LedgerBalanceReportForm.controls['CollectorCode']
      .value;
    console.log(CollectorCodeId);
    if (CollectorCodeId) {
      this.LedgerBalanceReportForm.patchValue({
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
      this.LedgerBalanceReportForm.patchValue({
        Collector: 0,
        CollectorCode: '',
      });
    }
    return selected.Id;
  }

  onChangeCollector(event: any) {
    let CollectorId = this.LedgerBalanceReportForm.controls['Collector'].value;
    console.log(CollectorId);
    if (CollectorId) {
      this.LedgerBalanceReportForm.patchValue({
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
      this.LedgerBalanceReportForm.controls['Group'].setValue('0');
      this.LedgerBalanceReportForm.controls['GroupCode'].setValue('');
    } else {
      this.chbIsAllGroupStatus = false;
      this.LedgerBalanceReportForm.get('Group').enable();
    }
  }
  onChangeGroupCode(event: any) {
    let GroupCodeId = this.LedgerBalanceReportForm.controls['GroupCode'].value;
    console.log(GroupCodeId);
    if (GroupCodeId) {
      this.LedgerBalanceReportForm.patchValue({
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
      this.LedgerBalanceReportForm.patchValue({
        Group: 0,
        GroupCode: '',
      });
    }
    return selected.Id;
  }

  onChangeGroup(event: any) {
    let GroupId = this.LedgerBalanceReportForm.controls['Group'].value;
    console.log(GroupId);
    if (GroupId) {
      this.LedgerBalanceReportForm.patchValue({
        GroupCode: GroupId,
      });
    }
  }

  // events AccStatus
  checkIsAllAccStatusValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllAccStatusStatus = true;

      this.IsAccStatusDisabled = true;
      this.LedgerBalanceReportForm.controls['AccStatus'].setValue('0');
    } else {
      this.chbIsAllAccStatusStatus = false;
      this.LedgerBalanceReportForm.get('AccStatus').enable();
    }
  }

  // events MemberStatus
  checkIsAllMemberStatusValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllMemberStatusStatus = true;

      this.IsMemberStatusDisabled = true;
      this.LedgerBalanceReportForm.controls['MemberStatus'].setValue('0');
    } else {
      this.chbIsAllMemberStatusStatus = false;
      this.LedgerBalanceReportForm.get('MemberStatus').enable();
    }
  }

  // events Gender
  checkIsAllGenderValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGenderStatus = true;

      this.IsGenderDisabled = true;
      this.LedgerBalanceReportForm.controls['Gender'].setValue('0');
    } else {
      this.chbIsAllGenderStatus = false;
      this.LedgerBalanceReportForm.get('Gender').enable();
    }
  }

  // events Balance
  checkIsAllBalanceValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllBalanceStatus = true;
      this.showFromTillBalance = false;
      this.IsBalanceDisabled = true;
      this.LedgerBalanceReportForm.controls['Balance'].setValue('0');
    } else {
      this.chbIsAllBalanceStatus = false;
      this.LedgerBalanceReportForm.get('Balance').enable();
    }
  }
  onChangeBalanceType(event: any) {
    let BalanceTypeId = this.LedgerBalanceReportForm.controls['Balance'].value;
    console.log(BalanceTypeId);
    if (BalanceTypeId == 1) {
      this.showFromTillBalance = true;
    } else {
      this.showFromTillBalance = false;
    }
  }

  // events old A/C
  checkIsAllOldAccNoValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllOldAccNoStatus = true;

      this.IsOldAccNoFromDisabled = true;
      this.IsOldAccNoToDisabled = true;

      this.LedgerBalanceReportForm.controls['OldAccNoFrom'].setValue('');
      this.LedgerBalanceReportForm.controls['OldAccNoTo'].setValue('');
    } else {
      this.chbIsAllOldAccNoStatus = false;
      this.LedgerBalanceReportForm.get('OldAccNoFrom').enable();
      this.LedgerBalanceReportForm.get('OldAccNoTo').enable();
    }
  }

  // events button click
  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }
  private setParameter(): void {
    var fValue = this.LedgerBalanceReportForm.value;
    this.reportModel.Values = [];

    //report name lodgic start

    if (
      this.accTypeClassData.AccTypeClass == 1 &&
      fValue.rbOldAccNoWise != '0'
    ) {
      console.log('This is AccTypeClass 1 and not groupwise report');
      // this.reportModel.ReportName = 'CsGenerateLedgerBalance1';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance1';
    } else if (
      this.accTypeClassData.AccTypeClass == 2 &&
      fValue.rbOldAccNoWise != '0'
    ) {
      console.log('This is AccTypeClass 2 and not groupwise report');
      //this.reportModel.ReportName = 'CsGenerateLedgerBalance2';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance2';
    } else if (
      this.accTypeClassData.AccTypeClass == 3 &&
      fValue.rbOldAccNoWise != '0'
    ) {
      console.log('This is AccTypeClass 3 and not groupwise report');
      //this.reportModel.ReportName = 'CsGenerateLedgerBalance3';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance3';
    } else if (
      this.accTypeClassData.AccTypeClass == 4 &&
      fValue.rbOldAccNoWise != '0'
    ) {
      console.log('This is AccTypeClass 4 and not groupwise report');
      //this.reportModel.ReportName = 'CsGenerateLedgerBalance4';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance4';
    } else if (
      this.accTypeClassData.AccTypeClass == 5 &&
      fValue.rbOldAccNoWise != '0'
    ) {
      console.log('This is AccTypeClass 5 and not groupwise report');
      //this.reportModel.ReportName = 'CsGenerateLedgerBalance5';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance5';
    } else if (
      this.accTypeClassData.AccTypeClass == 6 &&
      fValue.rbOldAccNoWise != '0'
    ) {
      console.log('This is AccTypeClass 6 and not groupwise report');
      // this.reportModel.ReportName = 'CsGenerateLedgerBalance6';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance6';
    } else if (
      this.accTypeClassData.AccTypeClass == 7 &&
      fValue.rbOldAccNoWise != '0'
    ) {
      console.log('This is AccTypeClass 7 and not groupwise report');
      //this.reportModel.ReportName = 'CsGenerateLedgerBalance7';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance7';
    } else if (
      this.accTypeClassData.AccTypeClass == 1 &&
      fValue.rbOldAccNoWise == '0'
    ) {
      console.log('This is AccTypeClass 1 and  groupwise report');
      // this.reportModel.ReportName = 'CsGenerateLedgerBalance1ByGroup';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance1_ByGroup';
    } else if (
      this.accTypeClassData.AccTypeClass == 2 &&
      fValue.rbOldAccNoWise == '0'
    ) {
      console.log('This is AccTypeClass 2 and  groupwise report');
      // this.reportModel.ReportName = 'CsGenerateLedgerBalance2ByGroup';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance2_ByGroup';
    } else if (
      this.accTypeClassData.AccTypeClass == 3 &&
      fValue.rbOldAccNoWise == '0'
    ) {
      console.log('This is AccTypeClass 3 and  groupwise report');
      // this.reportModel.ReportName = 'CsGenerateLedgerBalance3ByGroup';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance3_ByGroup';
    } else if (
      this.accTypeClassData.AccTypeClass == 4 &&
      fValue.rbOldAccNoWise == '0'
    ) {
      console.log('This is AccTypeClass 4 and  groupwise report');
      // this.reportModel.ReportName = 'CsGenerateLedgerBalance4ByGroup';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance4_ByGroup';
    } else if (
      this.accTypeClassData.AccTypeClass == 5 &&
      fValue.rbOldAccNoWise == '0'
    ) {
      console.log('This is AccTypeClass 5 and  groupwise report');
      //this.reportModel.ReportName = 'CsGenerateLedgerBalance5ByGroup';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance5_ByGroup';
    } else if (
      this.accTypeClassData.AccTypeClass == 6 &&
      fValue.rbOldAccNoWise == '0'
    ) {
      console.log('This is AccTypeClass 6 and  groupwise report');
      // this.reportModel.ReportName = 'CsGenerateLedgerBalance6ByGroup';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance6_ByGroup';
    } else if (
      this.accTypeClassData.AccTypeClass == 7 &&
      fValue.rbOldAccNoWise == '0'
    ) {
      console.log('This is AccTypeClass 7 and  groupwise report');
      //this.reportModel.ReportName = 'CsGenerateLedgerBalance7ByGroup';
      this.reportModel.ReportName = 'rptMCsGenerateLedgerBalance7_ByGroup';
    }

    //report name lodgic end

    this.reportModel.Values.push(
      new ReportKeyValue('BalanceDate', this.storeBDate)
    );
    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));
    this.reportModel.Values.push(
      new ReportKeyValue('Collector', fValue.Collector)
    );
    this.reportModel.Values.push(new ReportKeyValue('Group', fValue.Group));
    this.reportModel.Values.push(
      new ReportKeyValue('AccStatus', fValue.AccStatus)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('MemberStatus', fValue.MemberStatus)
    );
    this.reportModel.Values.push(new ReportKeyValue('Gender', fValue.Gender));
    this.reportModel.Values.push(new ReportKeyValue('Balance', fValue.Balance));

    // start OldAccNoFrom/ OldAccNoTo
    if (this.chbIsAllOldAccNoStatus) {
      this.reportModel.Values.push(new ReportKeyValue('OldAccNoFrom', '0'));
      this.reportModel.Values.push(new ReportKeyValue('OldAccNoTo', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('OldAccNoFrom', fValue.OldAccNoFrom)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('OldAccNoTo', fValue.OldAccNoTo)
      );
    }
    // end OldAccNoFrom/ OldAccNoTo
    this.reportModel.Values.push(
      new ReportKeyValue('rbOldAccNoWise', fValue.rbOldAccNoWise)
    );
    //start AccType
    if (fValue.AccType == 0) {
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

    //start AccStatus
    if (this.chbIsAllAccStatusStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('AccStatusDesc', 'All A/C. Status')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'AccStatusDesc',
          this.getSelectedItemText(
            fValue.AccStatus,
            this.inputHelpData.AccountStatusList
          )
        )
      );
    }
    // end AccStatus

    //start MemberStatus
    if (this.chbIsAllMemberStatusStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('MemberStatusDesc', 'All Member Status')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'MemberStatusDesc',
          this.getSelectedItemText(
            fValue.MemberStatus,
            this.inputHelpData.MemberStatusList
          )
        )
      );
    }
    // end MemberStatus

    //start Gender
    if (this.chbIsAllGenderStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('GenderDesc', 'All Gender')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'GenderDesc',
          this.getSelectedItemText(
            fValue.Gender,
            this.inputHelpData.loanDisbGenderList
          )
        )
      );
    }
    // end Gender

    // start Balance
    let BalanceTypeId = this.LedgerBalanceReportForm.controls['Balance'].value;
    console.log('This is Balance Type Code', BalanceTypeId);

    this.reportModel.Values.push(
      new ReportKeyValue('AmountSign', this.amountSign.toString())
    );
    if (this.chbIsAllBalanceStatus) {
      this.reportModel.Values.push(new ReportKeyValue('fBalanceDesc', '1.00'));
      this.reportModel.Values.push(
        new ReportKeyValue('tBalanceDesc', '99,999,999,999.00')
      );
      this.reportModel.Values.push(new ReportKeyValue('fBalance', '0'));
      this.reportModel.Values.push(new ReportKeyValue('tBalance', '0'));
    } else if (BalanceTypeId == 1) {
      this.reportModel.Values.push(
        new ReportKeyValue('fBalanceDesc', fValue.FromBalance)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('tBalanceDesc', fValue.TillBalance)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('fBalance', fValue.FromBalance)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('tBalance', fValue.TillBalance)
      );
    } else {
      this.reportModel.Values.push(new ReportKeyValue('fBalanceDesc', '0'));
      this.reportModel.Values.push(new ReportKeyValue('tBalanceDesc', '0'));
      this.reportModel.Values.push(new ReportKeyValue('fBalance', '0'));
      this.reportModel.Values.push(new ReportKeyValue('tBalance', '0'));
    }
    // end Balance

    //more filtering parameters
    if (this.chbIsAllOldAccNoStatus) {
      this.reportModel.Values.push(new ReportKeyValue('OldAccFlag', '0'));
    } else {
      this.reportModel.Values.push(new ReportKeyValue('OldAccFlag', '1'));
    }
  }

  public getAmountSign = () => {
    if (this.amountSign == 1) {
      this.amountSignText = 'Negative';
      this.amountSign = 2;
      this.toggle = false;
    } else {
      this.amountSignText = 'Positive';
      this.amountSign = 1;
      this.toggle = true;
    }
  };

  public getReportToken = (type: any) => {
    if (this.LedgerBalanceReportForm.invalid) {
      alert('Please Input Account Type!');
      return;
    }
    if (
      !this.chbIsAllCollectorStatus &&
      this.LedgerBalanceReportForm.controls['CollectorCode'].value == ''
    ) {
      alert('Please Select Collector Code!');
      return;
    }
    if (
      !this.chbIsAllGroupStatus &&
      this.LedgerBalanceReportForm.controls['GroupCode'].value == ''
    ) {
      alert('Please Select Group Code!');
      return;
    }

    if (
      !this.chbIsAllAccStatusStatus &&
      this.LedgerBalanceReportForm.controls['AccStatus'].value == '0'
    ) {
      alert('Please Select A/C. Status!');
      return;
    }

    if (
      !this.chbIsAllBalanceStatus &&
      this.LedgerBalanceReportForm.controls['Balance'].value == '0'
    ) {
      alert('Please Select Balance!');
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
    var fv = this.LedgerBalanceReportForm.value;
    var value = this.datepipe.transform(fv.BalanceDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LedgerBalanceReportForm.value.BalanceDate = formatedValue;
    this.storeBDate = formatedValue;
    console.log(this.LedgerBalanceReportForm.value);
    console.log(this.storeBDate);
  }
}
