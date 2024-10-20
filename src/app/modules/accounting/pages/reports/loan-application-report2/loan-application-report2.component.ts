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
import { Router } from '@angular/router';
import { CSLoanApplicationReportService } from 'src/app/services/cs-loan-application-report.service';
import { csLoanApplicationReportPageLoadModel } from '../../../models/cs-loan-application-report.model';

@Component({
  selector: 'app-loan-application-report2',
  templateUrl: './loan-application-report2.component.html',
  styleUrls: ['./loan-application-report2.component.css'],
})
export class LoanApplicationReport2Component implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp =
    new LoanReceivedReportInputHelp();
  public inputHelpData2: JournalReportInputHelp = new JournalReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  chbIsAllAccTypeStatus: boolean = true;
  chbIsAllMemberTypeStatus: boolean = true;
  chbIsAllCollectorTypeStatus: boolean = true;
  chbIsAllGroupTypeStatus: boolean = true;
  chbIsAllUserTypeStatus: boolean = true;
  chbIsAllLoanTypeStatus: boolean = true;

  storeFvalue: any;
  storeTvalue: any;

  CsLoanApplicationForm: FormGroup;

  GetInputHelpData: csLoanApplicationReportPageLoadModel =
    new csLoanApplicationReportPageLoadModel();
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private journalReportService: JournalReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private loanInfoReportService: LoanInfoReportService,
    private csLoanApplicationReportService: CSLoanApplicationReportService
  ) {
    this.reportModel.ReportName = 'CCULB_rptLoanApplicationReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelpData();
  }
  private initializeForm() {
    this.MemberDetailsList = null;

    this.chbIsAllAccTypeStatus = true;

    this.CsLoanApplicationForm = new FormGroup({
      IsAllAccType: new FormControl(true),
      AccTypeCode: new FormControl(''),
      AccDDL: new FormControl('0'),

      IsAllMemberType: new FormControl(true),
      MemTypeCodeFrom: new FormControl(''),
      MemTypeCodeTo: new FormControl(''),

      IsAllCollectorType: new FormControl(true),
      CollectorTypeCode: new FormControl(''),
      CollectorDDL: new FormControl('0'),

      IsAllGroupType: new FormControl(true),
      GroupTypeCode: new FormControl(''),
      GroupDDL: new FormControl('0'),

      IsAllUserType: new FormControl(true),
      UserTypeCode: new FormControl(''),
      UserDDL: new FormControl('0'),

      IsAllLoanType: new FormControl(true),
      LoanTypeCode: new FormControl(''),
      IsLoanTypeDisabled: new FormControl('true'),
      LoanDDL: new FormControl('0'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
    });
  }
  public getInputHelpData() {
    this.csLoanApplicationReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.GetInputHelpData = data;
        this.CsLoanApplicationForm.controls['IssueFromDate'].setValue(
          this.GetInputHelpData.FromDate
        );
        this.CsLoanApplicationForm.controls['IssueToDate'].setValue(
          this.GetInputHelpData.ToDate
        );
        this.storeFvalue = this.GetInputHelpData.FromDate;
        this.storeTvalue = this.GetInputHelpData.ToDate;
      });
  }
  public checkIsshowHideTypeValue(e) {
    console.log('Event', e);
    if (this.chbIsAllAccTypeStatus == false) {
      this.CsLoanApplicationForm.controls['AccDDL'].enable();
    } else {
      this.CsLoanApplicationForm.controls['AccDDL'].disable();
      this.CsLoanApplicationForm.controls['AccDDL'].setValue('0');
      this.CsLoanApplicationForm.controls['AccTypeCode'].setValue('');
    }

    if (this.chbIsAllCollectorTypeStatus == false) {
      this.CsLoanApplicationForm.controls['CollectorDDL'].enable();
    } else {
      this.CsLoanApplicationForm.controls['CollectorDDL'].disable();
      this.CsLoanApplicationForm.controls['CollectorDDL'].setValue('0');
      this.CsLoanApplicationForm.controls['CollectorTypeCode'].setValue('');
    }

    if (this.chbIsAllGroupTypeStatus == false) {
      this.CsLoanApplicationForm.controls['GroupDDL'].enable();
    } else {
      this.CsLoanApplicationForm.controls['GroupDDL'].disable();
      this.CsLoanApplicationForm.controls['GroupDDL'].setValue('0');
      this.CsLoanApplicationForm.controls['GroupTypeCode'].setValue('');
    }

    if (this.chbIsAllUserTypeStatus == false) {
      this.CsLoanApplicationForm.controls['UserDDL'].enable();
    } else {
      this.CsLoanApplicationForm.controls['UserDDL'].disable();
      this.CsLoanApplicationForm.controls['UserDDL'].setValue('0');
      this.CsLoanApplicationForm.controls['UserTypeCode'].setValue('');
    }

    if (this.chbIsAllLoanTypeStatus == false) {
      this.CsLoanApplicationForm.controls['LoanDDL'].enable();
    } else {
      this.CsLoanApplicationForm.controls['LoanDDL'].disable();
      this.CsLoanApplicationForm.controls['LoanDDL'].setValue('0');
      this.CsLoanApplicationForm.controls['LoanTypeCode'].setValue('');
    }

    if (this.chbIsAllMemberTypeStatus == false) {
      this.CsLoanApplicationForm.controls['MemTypeCodeFrom'].enable();
      this.CsLoanApplicationForm.controls['MemTypeCodeTo'].enable();
    } else {
      this.CsLoanApplicationForm.controls['MemTypeCodeFrom'].disable();
      this.CsLoanApplicationForm.controls['MemTypeCodeTo'].disable();
      this.CsLoanApplicationForm.controls['MemTypeCodeFrom'].setValue('');
      this.CsLoanApplicationForm.controls['MemTypeCodeTo'].setValue('');
    }
  }

  public AccCode() {
    this.CsLoanApplicationForm.controls['AccDDL'].setValue(
      this.CsLoanApplicationForm.value.AccTypeCode
    );
  }
  public AccCodeDDL() {
    this.CsLoanApplicationForm.controls['AccTypeCode'].setValue(
      this.CsLoanApplicationForm.value.AccDDL
    );
  }

  public CollectorCode() {
    this.CsLoanApplicationForm.controls['CollectorDDL'].setValue(
      this.CsLoanApplicationForm.value.CollectorTypeCode
    );
  }
  public CollectorDDL() {
    this.CsLoanApplicationForm.controls['CollectorTypeCode'].setValue(
      this.CsLoanApplicationForm.value.CollectorDDL
    );
  }

  public GroupCode() {
    this.CsLoanApplicationForm.controls['GroupDDL'].setValue(
      this.CsLoanApplicationForm.value.GroupTypeCode
    );
  }
  public GroupCodeDDL() {
    this.CsLoanApplicationForm.controls['GroupTypeCode'].setValue(
      this.CsLoanApplicationForm.value.GroupDDL
    );
  }

  public UserCode() {
    this.CsLoanApplicationForm.controls['UserDDL'].setValue(
      this.CsLoanApplicationForm.value.UserTypeCode
    );
  }
  public UserCodeDDL() {
    this.CsLoanApplicationForm.controls['UserTypeCode'].setValue(
      this.CsLoanApplicationForm.value.UserDDL
    );
  }

  public LoanCode() {
    this.CsLoanApplicationForm.controls['LoanDDL'].setValue(
      this.CsLoanApplicationForm.value.LoanTypeCode
    );
  }
  public LoanCodeDDL() {
    this.CsLoanApplicationForm.controls['LoanTypeCode'].setValue(
      this.CsLoanApplicationForm.value.LoanDDL
    );
  }

  private setParameter(): void {
    var fValue = this.CsLoanApplicationForm.value;
    this.reportModel.Values = [];

    this.reportModel.ReportName = 'CCULB_rptLoanApplicationReport';

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storeFvalue)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storeTvalue)
    );

    if (this.chbIsAllAccTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('AccNo', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('AccNo', fValue.AccTypeCode)
      );
    }

    if (this.chbIsAllMemberTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('memNoFrom', '0'));

      this.reportModel.Values.push(new ReportKeyValue('memNoTo', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('memNoFrom', fValue.MemTypeCodeFrom)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('memNoTo', fValue.MemTypeCodeTo)
      );
    }

    if (this.chbIsAllCollectorTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('ColCode', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('ColCode', fValue.CollectorTypeCode)
      );
    }

    if (this.chbIsAllGroupTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('groupCode', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('groupCode', fValue.GroupTypeCode)
      );
    }
    if (this.chbIsAllUserTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('tellerNo', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('tellerNo', fValue.UserTypeCode)
      );
    }

    if (this.chbIsAllUserTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('loanNo', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('loanNo', fValue.LoanTypeCode)
      );
    }
  }

  public getReportToken = (type:any) => {
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

  exitPage() {
    this.router.navigate(['accounting/']);
  }

  // Date change event
  applicationDateChange() {
    var fv = this.CsLoanApplicationForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CsLoanApplicationForm.value.IssueFromDate = formatedValue;
    this.storeFvalue = formatedValue;
    console.log(this.CsLoanApplicationForm.value);
    console.log(this.storeFvalue);
  }
  applicationDateChange2() {
    var fv = this.CsLoanApplicationForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.CsLoanApplicationForm.value.IssueToDate = formatedValue;
    this.storeTvalue = formatedValue;
    console.log(this.CsLoanApplicationForm.value);
    console.log(this.storeTvalue);
  }
}
