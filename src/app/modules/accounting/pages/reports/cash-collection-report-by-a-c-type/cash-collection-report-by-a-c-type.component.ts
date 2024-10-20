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
import {
  CashCollectionAccPageLoadModel,
  CashCollectionMemberNoChngModel,
} from '../../../models/cash-collection-report-by-acc.model';
import { CashCollectionReportByAccService } from 'src/app/services/cash-collection-report-by-acc.service';

@Component({
  selector: 'app-cash-collection-report-by-a-c-type',
  templateUrl: './cash-collection-report-by-a-c-type.component.html',
  styleUrls: ['./cash-collection-report-by-a-c-type.component.css'],
})
export class CashCollectionReportByACTypeComponent
  implements OnInit, OnDestroy {
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

  chbIsAllMemberStatus: any;
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
  AccountClass: any;
  RegistrationNo: any;
  MemType: any;
  TellerCode: any;
  ChangeCollectorCode: any;
  CollectorCodeName: any;
  IdsNo: any;
  IdsName: any;
  AccDescription;
  any;
  CollctorDescription: any;
  GroupDescription: any;
  TellerDescription: any;
  MmberDescription: any;
  MemName: any;
  //IsGenderDisabled: any;
  //IsDisburseDisabled: any;

  CashCollectionReportByAccForm: FormGroup;

  GetInputHelpData: CashCollectionAccPageLoadModel = new CashCollectionAccPageLoadModel();
  MemberNoChngData: CashCollectionMemberNoChngModel = new CashCollectionMemberNoChngModel();
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private journalReportService: JournalReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService,
    private cashCollectionService: CashCollectionReportByAccService
  ) {
    this.reportModel.ReportName = 'rptMCSProductCashCollectionListByCollector';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelpData();
    this.setDefaultOptions();
    //this.setDefaultOptions2();
  }
  private initializeForm() {
    this.MemberDetailsList = null;

    this.chbIsAllAccTypeStatus = true;
    this.chbIsAllCollectorStatus = true;
    this.chbIsAllGroupStatus = true;
    this.chbIsAllTrnTypeStatus = true;
    this.chbIsAllTrnModeStatus = true;
    this.chbIsAllTellerStatus = true;
    this.chbIsAllMemberStatus = true;
    this.chbIsAllPurposeStatus = true;
    this.chbIsAllVchNoStatus = true;
    this.chbIsAllNormalTransactionStatus = true;

    this.IsAccTypeDisabled = true;
    this.IsCollectorDisabled = true;
    this.IsGroupDisabled = true;
    this.IsTrnTypeDisabled = true;
    this.IsTrnModeDisabled = true;
    this.IsTellerDisabled = true;
    this.IsPurposeDisabled = true;
    this.IsVchNoDisabled = true;
    this.IsNormalTransactionDisabled = true;

    this.CashCollectionReportByAccForm = new FormGroup({
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

      IsAllPurpose: new FormControl('true'),
      PurposeCode: new FormControl(''),
      Purpose: new FormControl('0'),

      IsAllMember: new FormControl('true'),
      MemNo: new FormControl(''),
      MemName: new FormControl(''),

      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),

      rbReportName: new FormControl('1'),
    });
  }
  public getInputHelpData() {
    this.cashCollectionService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        console.log('GetInputHelpData:', data);
        this.IdsNo = data.IdsNo;
        this.IdsName = data.IdsName;
        console.log('IdsName:', this.IdsName);
        this.GetInputHelpData = data;
        this.CashCollectionReportByAccForm.controls['IssueFromDate'].setValue(
          this.GetInputHelpData.FromDate
        );
        this.CashCollectionReportByAccForm.controls['IssueToDate'].setValue(
          this.GetInputHelpData.ToDate
        );
      });
  }
  //events AccType okk
  checkIsAllAccTypeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllAccTypeStatus = true;
      this.IsAccTypeDisabled = true;
      this.CashCollectionReportByAccForm.controls['AccType'].setValue('0');
      this.CashCollectionReportByAccForm.controls['AccTypeCode'].setValue('');
    } else {
      this.chbIsAllAccTypeStatus = false;
      this.CashCollectionReportByAccForm.get('AccType').enable();
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
      this.CashCollectionReportByAccForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
  }

  // AccType DropDownStart

  onChangeAccTypeCode() {
    let selectedCode = this.GetInputHelpData.AccountTypeDropDown.find(
      (x) => x.Id == this.CashCollectionReportByAccForm.value.AccTypeCode
    );
    this.AccDescription = selectedCode.Description;
    if (selectedCode) {
      this.CashCollectionReportByAccForm.controls['AccType'].setValue(
        this.CashCollectionReportByAccForm.value.AccTypeCode
      );
      this.cashCollectionService
        .AccountClassReturn(
          this.CashCollectionReportByAccForm.value.AccTypeCode
        )
        .pipe(first())
        .subscribe((data: any) => {
          this.AccountClass = data;
        });
    } else {
      alert('Acc type was not valid.');
      this.CashCollectionReportByAccForm.controls['AccType'].setValue(0);
      this.CashCollectionReportByAccForm.controls['AccTypeCode'].setValue('');
    }
  }

  onChangeAccType() {
    let selectedCode = this.GetInputHelpData.AccountTypeDropDown.find(
      (x) => x.Id == this.CashCollectionReportByAccForm.value.AccType
    );
    this.AccDescription = selectedCode.Description;
    this.CashCollectionReportByAccForm.controls['AccTypeCode'].setValue(
      this.CashCollectionReportByAccForm.value.AccType
    );
    this.cashCollectionService
      .AccountClassReturn(this.CashCollectionReportByAccForm.value.AccType)
      .pipe(first())
      .subscribe((data: any) => {
        this.AccountClass = data;
      });
  }
  //AccType DropDown End

  // Collector dropdown Start
  onChangeCollectorCode() {
    let selectedCode = this.GetInputHelpData.AllCollectorTypeDropDown.find(
      (x) => x.Id == this.CashCollectionReportByAccForm.value.CollectorCode
    );
    this.CollctorDescription = selectedCode.Description;
    if (selectedCode) {
      this.CollectorCodeName = selectedCode.Description;
      this.CashCollectionReportByAccForm.controls['Collector'].setValue(
        this.CashCollectionReportByAccForm.value.CollectorCode
      );
      this.cashCollectionService
        .CollectorCode(this.CashCollectionReportByAccForm.value.CollectorCode)
        .pipe(first())
        .subscribe((data: any) => {
          this.ChangeCollectorCode = data;
        });
    } else {
      alert('Collector Code was not valid.');
      this.CashCollectionReportByAccForm.controls['Collector'].setValue(0);
      this.CashCollectionReportByAccForm.controls['CollectorCode'].setValue('');
    }
  }
  onChangeCollector() {
    let selectedCode = this.GetInputHelpData.AllCollectorTypeDropDown.find(
      (x) => x.Id == this.CashCollectionReportByAccForm.value.Collector
    );
    this.CollectorCodeName = selectedCode.Description;
    this.CashCollectionReportByAccForm.controls['CollectorCode'].setValue(
      this.CashCollectionReportByAccForm.value.Collector
    );
    this.cashCollectionService
      .CollectorCode(this.CashCollectionReportByAccForm.value.Collector)
      .pipe(first())
      .subscribe((data: any) => {
        this.ChangeCollectorCode = data;
      });
  }
  //Collector dropdown End

  // GroupChangeDropDown Start
  onChangeGroupCode() {
    console.log('Tanvir');
    let selectedCode = this.GetInputHelpData.AllGroupNameDropDown.find(
      (x) => x.Id == this.CashCollectionReportByAccForm.value.GroupCode
    );

    if (selectedCode) {
      this.GroupDescription = selectedCode.Description;
      this.CashCollectionReportByAccForm.controls['Group'].setValue(
        this.CashCollectionReportByAccForm.value.GroupCode
      );
      this.cashCollectionService
        .RegistrationNumber(this.CashCollectionReportByAccForm.value.GroupCode)
        .pipe(first())
        .subscribe((data: any) => {
          this.RegistrationNo = data;
        });
    } else {
      alert('Collector Code was not valid.');
      this.CashCollectionReportByAccForm.controls['Group'].setValue(0);
      this.CashCollectionReportByAccForm.controls['GroupCode'].setValue('');
    }
  }
  onChangeGroup() {
    let selectedCode = this.GetInputHelpData.AllGroupNameDropDown.find(
      (x) => x.Id == this.CashCollectionReportByAccForm.value.Group
    );
    this.GroupDescription = selectedCode.Description;
    this.CashCollectionReportByAccForm.controls['GroupCode'].setValue(
      this.CashCollectionReportByAccForm.value.Group
    );
    this.cashCollectionService
      .RegistrationNumber(this.CashCollectionReportByAccForm.value.Group)
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data);
        this.RegistrationNo = data;
      });
  }

  //GroupChangeDropDown End

  // UserId DropDown Start
  onChangeTellerCode() {
    let selectedCode = this.GetInputHelpData.AllUserIdTypeDropDown.find(
      (x) => x.Id == this.CashCollectionReportByAccForm.value.TellerCode
    );
    if (selectedCode) {
      this.TellerDescription = selectedCode.Description;
      console.log('TellerDesc:', this.TellerDescription);
      this.CashCollectionReportByAccForm.controls['Teller'].setValue(
        this.CashCollectionReportByAccForm.value.TellerCode
      );
      this.cashCollectionService
        .TellerIdReturn(this.CashCollectionReportByAccForm.value.TellerCode)
        .pipe(first())
        .subscribe((data: any) => {
          this.TellerCode = data;
        });
    } else {
      alert('USer Id was not valid.');
      this.CashCollectionReportByAccForm.controls['Teller'].setValue(0);
      this.CashCollectionReportByAccForm.controls['TellerCode'].setValue('');
    }
  }
  onChangeTeller() {
    let selectedCode = this.GetInputHelpData.AllUserIdTypeDropDown.find(
      (x) => x.Id == this.CashCollectionReportByAccForm.value.Teller
    );
    this.TellerDescription = selectedCode.Description;
    console.log('TellerDesc:', this.TellerDescription);
    this.CashCollectionReportByAccForm.controls['TellerCode'].setValue(
      this.CashCollectionReportByAccForm.value.Teller
    );
    this.cashCollectionService
      .TellerIdReturn(this.CashCollectionReportByAccForm.value.Teller)
      .pipe(first())
      .subscribe((data: any) => {
        this.TellerCode = data;
      });
  }

  //UserId DropDown End

  //MemNo change start

  onChangeMemNo() {
    let IsOldCheck = this.CashCollectionReportByAccForm.controls['IsOldMem']
      .value;
    console.log(IsOldCheck);
    let MemNoId = this.CashCollectionReportByAccForm.controls['MemNo'].value;
    this.MemType = this.cashCollectionService
      .MemberType(this.CashCollectionReportByAccForm.value.MemNo)
      .pipe(first())
      .subscribe((data: any) => {
        this.MemType = data;
      });
    console.log(MemNoId);
    this.MemName = MemNoId.Description;
    console.log('MemName:', this.MemName);
    if (MemNoId) {
      this.spinner.show();
      this.loanInfoReportService
        .GetMemberDetails(IsOldCheck, MemNoId)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.MemberDetailsList = x;
            console.log('MemberDataList:', this.MemberDetailsList);
            // invalid memberno
            if (this.MemberDetailsList.MemberNo == 0) {
              alert('Invalid Member No!');
            }
            if (this.MemberDetailsList.MemberName) {
              this.CashCollectionReportByAccForm.patchValue({
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

  // events Collector okkk
  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.CashCollectionReportByAccForm.controls['Collector'].setValue('0');
      this.CashCollectionReportByAccForm.controls['CollectorCode'].setValue('');
    } else {
      this.chbIsAllCollectorStatus = false;
      this.CashCollectionReportByAccForm.get('Collector').enable();
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
      this.CashCollectionReportByAccForm.patchValue({
        Collector: 0,
        CollectorCode: '',
      });
    }
    return selected.Id;
  }

  // events Group okk
  checkIsAllGroupValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGroupStatus = true;
      this.IsGroupDisabled = true;
      this.CashCollectionReportByAccForm.controls['Group'].setValue('0');
      this.CashCollectionReportByAccForm.controls['GroupCode'].setValue('');
    } else {
      this.chbIsAllGroupStatus = false;
      this.CashCollectionReportByAccForm.get('Group').enable();
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
      this.CashCollectionReportByAccForm.patchValue({
        Group: 0,
        GroupCode: '',
      });
    }
    return selected.Id;
  }

  //events Member okk
  checkIsAllMemberValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllMemberStatus = true;
      this.MemberDetailsList = null;
      this.CashCollectionReportByAccForm.controls['MemNo'].setValue('');
      this.CashCollectionReportByAccForm.controls['MemName'].setValue('');
    } else {
      this.chbIsAllMemberStatus = false;
    }
  }

  // events User id/ teller okkkk
  checkIsAllTellerValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllTellerStatus = true;
      this.IsTellerDisabled = true;
      this.CashCollectionReportByAccForm.controls['Teller'].setValue('0');
      this.CashCollectionReportByAccForm.controls['TellerCode'].setValue('');
    } else {
      this.chbIsAllTellerStatus = false;
      this.CashCollectionReportByAccForm.get('Teller').enable();
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
      this.CashCollectionReportByAccForm.patchValue({
        Teller: 0,
        TellerCode: '',
      });
    }
    return selected.Id;
  }

  // public getSelectedItemText(value: any, collection: IdDescription[]): string {
  //   let selected = collection.find((x) => x.Id == value);
  //   return selected.Description;
  // }

  //90
  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.CashCollectionReportByAccForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.CashCollectionReportByAccForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.spinner.hide();
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
      });
  }

  //ts91
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
    var fValue = this.CashCollectionReportByAccForm.value;
    this.reportModel.Values = [];

    // report Name
    if (fValue.rbReportName === '1') {
      this.reportModel.ReportName =
        'rptMCSProductCashCollectionListByCollector';
    } else if (fValue.rbReportName == '2') {
      this.reportModel.ReportName = 'rptMCSProductCashCollectionListByID';
    } else if (fValue.rbReportName == '3') {
      this.reportModel.ReportName = 'rptMCSProductCashCollectionListByMember';
    }

    this.reportModel.Values.push(
      new ReportKeyValue('rbReportName', fValue.rbReportName)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );

    // if( this.AccDescription!=null)
    // {
    //   this.reportModel.Values.push(new ReportKeyValue('AccTypeClass', this.AccDescription));
    // }
    // else{
    //   this.reportModel.Values.push(new ReportKeyValue('AccTypeClass', "0"));
    // }
    // this.reportModel.Values.push(new ReportKeyValue('Group', fValue.Group));
    // if(this.GroupDescription!=null)
    // {
    //   this.reportModel.Values.push(new ReportKeyValue('GroupDesc', this.GroupDescription));
    // }
    // else{
    //   this.reportModel.Values.push(new ReportKeyValue('GroupDesc',"0"));
    // }
    //this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));

    //  //AccClassBinding start
    if (this.chbIsAllAccTypeStatus) {
      this.reportModel.Values.push(new ReportKeyValue('AccClass', '0'));
      this.reportModel.Values.push(new ReportKeyValue('AccType', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('AccClass', this.AccountClass)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('AccType', fValue.AccType)
      );
    }
    //  //AccClassBinding End

    //  // start Group
    if (this.chbIsAllGroupStatus) {
      this.reportModel.Values.push(new ReportKeyValue('RegistrationNo', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('RegistrationNo', this.RegistrationNo)
      );
    }
    //     //end Group
    //     // start MemberType binding
    if (this.chbIsAllMemberStatus) {
      this.reportModel.Values.push(new ReportKeyValue('MemberType', '0'));
      this.reportModel.Values.push(new ReportKeyValue('MemberNo', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('MemberType', fValue.MemName)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('MemberNo', fValue.MemNo)
      );
    }
    //     //end MemberTypeBinding

    // start Teller binding
    if (this.chbIsAllTellerStatus) {
      this.reportModel.Values.push(new ReportKeyValue('TellerCode', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue('TellerDesc', 'All Teller')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('TellerCode', fValue.TellerCode)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('TellerDesc', this.TellerDescription)
      );
    }
    //end Teller binding
    //   //start Collector
    if (this.chbIsAllCollectorStatus) {
      this.reportModel.Values.push(new ReportKeyValue('CollectorCode', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorCodeName', 'All Collector')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorCode', fValue.CollectorCode)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorCodeName', this.CollectorCodeName)
      );
    }

    //

    if (this.chbIsAllGroupStatus) {
      this.reportModel.Values.push(new ReportKeyValue('RegNo', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('RegNo', fValue.GroupCode)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('RegName', this.GroupDescription)
      );
    }

    //
    if (this.CollctorDescription != null) {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'CollectorCodeString',
          this.AccDescription.CollctorDescription
        )
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorCodeString', '0')
      );
    }
    //end Collector
    this.reportModel.Values.push(new ReportKeyValue('IdsNo', this.IdsNo));
    this.reportModel.Values.push(new ReportKeyValue('IdsName', this.IdsName));
  }
  //okk
  public getReportToken = (type: any) => {
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
  //   var value = this.datepipe.transform(
  //     this.CashCollectionReportByAccForm.value.IssueFromDate,
  //     'dd-MM-yyyy'
  //   );
  //   var formatedValue = this.aService.convertDateToString(value);
  //   this.CashCollectionReportByAccForm.value.IssueFromDate = formatedValue;
  //   var value = this.datepipe.transform(
  //     this.CashCollectionReportByAccForm.value.IssueToDate,
  //     'dd-MM-yyyy'
  //   );
  //   this.CashCollectionReportByAccForm.value.IssueToDate =
  //     this.aService.convertDateToString(value);
  //   console.log('this is formated from date', formatedValue);
  //   console.log('fvalue', this.CashCollectionReportByAccForm.value);
  // }
  // applicationDateChange2() {
  //   var value = this.datepipe.transform(
  //     this.CashCollectionReportByAccForm.value.IssueToDate,
  //     'dd-MM-yyyy'
  //   );
  //   var formatedValue = this.aService.convertDateToString(value);
  //   this.CashCollectionReportByAccForm.value.IssueToDate = formatedValue;
  //   var value = this.datepipe.transform(
  //     this.CashCollectionReportByAccForm.value.IssueFromDate,
  //     'dd-MM-yyyy'
  //   );
  //   this.CashCollectionReportByAccForm.value.IssueFromDate =
  //     this.aService.convertDateToString(value);
  //   console.log('this is formated to date', formatedValue);
  //   console.log('fvalue', this.CashCollectionReportByAccForm.value);
  // }

  // Date change event
  applicationDateChange() {
    var fv = this.CashCollectionReportByAccForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CashCollectionReportByAccForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.CashCollectionReportByAccForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.CashCollectionReportByAccForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CashCollectionReportByAccForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.CashCollectionReportByAccForm.value);
    console.log(this.storetDate);
  }
}
