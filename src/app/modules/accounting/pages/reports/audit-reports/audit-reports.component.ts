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
import { AuditReportService } from 'src/app/services/audit-reports.service';
import { AuditReportPageLoadModel } from '../../../models/audit-reports.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audit-reports',
  templateUrl: './audit-reports.component.html',
  styleUrls: ['./audit-reports.component.css'],
})
export class AuditReportsComponent implements OnInit {
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

  chbIsAllUserStatus: any;
  AllUserDescription: any;
  AllFieldDescription: any;
  AllMemberDescription: any;
  AllAccDescription: any;
  AccountClass: any;

  IsAllUserTypeDisabled: any;
  IsAllAccTypeDisabled: any;
  IsAllFieldTypeDisabled: any;
  IsAllMemberTypeDisabled: any;

  chbIsAllUserTypeStatus: boolean = true;
  chbIsAllFieldTypeStatus: boolean = true;
  chbIsAllMemberTypeStatus: boolean = true;
  chbIsAllAccTypeStatus: boolean = true;

  AllInfo: boolean = false;
  AllMember: boolean = false;
  AllAccountInfo: boolean = false;
  OtherInfo: boolean = false;

  AllUserShowHide: boolean = true;
  AllFieldShowHide: boolean = false;
  AllMemberShowHide: boolean = false;
  AllAccShowHide: boolean = false;

  AllUserDescriptionValue: any;
  AllFieldDescriptionValue: any;
  AllMemberDescriptionValue: any;
  AllAccDescriptionValue: any;
  storefDate:any;
  storetDate:any;

  AuditReportsForm: FormGroup;

  GetInputHelpData: AuditReportPageLoadModel = new AuditReportPageLoadModel();
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private journalReportService: JournalReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService,
    private auditReportService: AuditReportService,
    private router: Router
  ) {
    this.reportModel.ReportName = 'CCULB_rptAuditReport';
    this.reportModel.Values = [];
  }
  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelpData();
  }
  private initializeForm() {
    this.MemberDetailsList = null;

    this.AuditReportsForm = new FormGroup({
      rbReportName1: new FormControl('1'),
      rbReportName2: new FormControl('1'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      IsAllUser: new FormControl('0'),
      AllUserTypeDDL: new FormControl('0'),
      AllUserTypeCode: new FormControl(''),
      IsAllFieldTypeChb: new FormControl('0'),
      FieldTypeDDL: new FormControl('0'),
      IsAllMemberTypeChb: new FormControl('0'),
      AllMemberTypeDDL: new FormControl('0'),
      AllMemberCode: new FormControl(''),
      IsAllAccTypeChb: new FormControl('0'),
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
    });
  }
  public getInputHelpData() {
    this.spinner.show();
    this.auditReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        console.log('GetInputHelpData:', data);
        this.GetInputHelpData = data;
        this.AuditReportsForm.controls['IssueFromDate'].setValue(
          this.GetInputHelpData.FromDate
        );
        this.AuditReportsForm.controls['IssueToDate'].setValue(
          this.GetInputHelpData.ToDate
        );
        this.storefDate = this.GetInputHelpData.FromDate;
        this.storetDate = this.GetInputHelpData.FromDate;
        this.spinner.hide();
      });

  }

  public RadioButtonValue(e) {
    console.log("RadioBtn1----->",e)
    if (e == 1) {
      this.AllInfo = false;
      this.AllMember = false;
      this.AllAccountInfo = false;
      this.OtherInfo = false;

      this.AllUserShowHide = true;
      this.AllFieldShowHide = false;
      this.AllMemberShowHide = false;
      this.AllAccShowHide = false;
    } else if (e == 2) {
      this.AllInfo = true;
      this.AllMember = true;
      this.AllAccountInfo = true;
      this.OtherInfo = true;

      this.AllUserShowHide = true;
      this.AllFieldShowHide = false;
      this.AllMemberShowHide = false;
      this.AllAccShowHide = false;
    } else if (e == 3) {
      this.AllInfo = true;
      this.AllMember = false;
      this.AllAccountInfo = false;
      this.OtherInfo = true;

      this.AllUserShowHide = true;
      this.AllFieldShowHide = false;
      this.AllMemberShowHide = false;
      this.AllAccShowHide = false;
    } else if (e == 4) {
      this.AllInfo = true;
      this.AllMember = false;
      this.AllAccountInfo = false;
      this.OtherInfo = true;

      this.AllUserShowHide = true;
      this.AllFieldShowHide = false;
      this.AllMemberShowHide = false;
      this.AllAccShowHide = false;
    }
  }

  public RadioButtonValue2(evnt) {
    console.log('Radio2Value:', evnt);
    if (evnt == 1) {
      this.AllUserShowHide = true;
      this.AllFieldShowHide = false;
      this.AllMemberShowHide = false;
      this.AllAccShowHide = false;
    } else if (evnt == 2) {
      this.AllUserShowHide = true;
      this.AllFieldShowHide = true;
      this.AllMemberShowHide = true;
      this.AllAccShowHide = false;
    } else if (evnt == 3) {
      this.AllUserShowHide = true;
      this.AllFieldShowHide = true;
      this.AllMemberShowHide = true;
      this.AllAccShowHide = true;
    } else if (evnt == 4) {
      this.AllUserShowHide = true;
      this.AllFieldShowHide = true;
      this.AllMemberShowHide = false;
      this.AllAccShowHide = false;
    }
  }

  //events AccType okk
  checkIsAllUserTypeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllUserTypeStatus = true;
      this.IsAllUserTypeDisabled = true;
      this.AuditReportsForm.controls['AllUserTypeDDL'].setValue('0');
      this.AuditReportsForm.controls['AllUserTypeCode'].setValue('');
      this.AuditReportsForm.get('AllUserTypeDDL').disable();
    } else {
      this.chbIsAllUserTypeStatus = false;
      this.AuditReportsForm.get('AllUserTypeDDL').enable();
    }
  }

  checkIsAllFieldTypeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllFieldTypeStatus = true;
      this.IsAllFieldTypeDisabled = true;
      this.AuditReportsForm.controls['FieldTypeDDL'].setValue('0');
      this.AuditReportsForm.get('FieldTypeDDL').disable();
    } else {
      this.chbIsAllFieldTypeStatus = false;
      this.IsAllFieldTypeDisabled = false;
      this.AuditReportsForm.get('FieldTypeDDL').enable();
    }
  }

  checkIsAllMemberTypeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllMemberTypeStatus = true;
      this.IsAllMemberTypeDisabled = true;
      this.AuditReportsForm.controls['AllMemberTypeDDL'].setValue('0');
      this.AuditReportsForm.controls['AllMemberCode'].setValue('');
      this.AuditReportsForm.get('AllMemberTypeDDL').disable();
    } else {
      this.chbIsAllMemberTypeStatus = false;
      this.IsAllMemberTypeDisabled = false;
      this.AuditReportsForm.get('AllMemberTypeDDL').enable();
    }
  }

  checkIsAllAccTypeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllAccTypeStatus = true;
      this.IsAllAccTypeDisabled = true;
      this.AuditReportsForm.controls['AccType'].setValue('0');
      this.AuditReportsForm.controls['AccTypeCode'].setValue('');
      this.AuditReportsForm.get('AccType').disable();
    } else {
      this.chbIsAllAccTypeStatus = false;
      this.IsAllAccTypeDisabled = false;
      this.AuditReportsForm.get('AccType').enable();
    }
  }

  public UserCodeInputField() {
    this.AuditReportsForm.controls['AllUserTypeDDL'].setValue(
      this.AuditReportsForm.value.AllUserTypeCode
    );

    let selectedCode = this.GetInputHelpData.AllUserIdDropdown.find(
      (x) => x.Id == this.AuditReportsForm.value.AllUserTypeDDL
    );
    this.AllUserDescriptionValue =
      this.AuditReportsForm.controls['AllUserTypeDDL'].value;
  }

  public UserCodeDropDown() {
    this.AuditReportsForm.controls['AllUserTypeCode'].setValue(
      this.AuditReportsForm.value.AllUserTypeDDL
    );
    let selectedCode = this.GetInputHelpData.AllUserIdDropdown.find(
      (x) => x.Id == this.AuditReportsForm.value.AllUserTypeDDL
    );
    this.AllUserDescription = selectedCode.Description;
    this.AllUserDescriptionValue =
      this.AuditReportsForm.controls['AllUserTypeDDL'].value;
    console.log('UserName:', this.AllUserDescription);
    console.log('UserNo:', this.AllUserDescriptionValue);
  }

  public FieldDropDown() {
    let selectedCode = this.GetInputHelpData.AllFieldsDropdown.find(
      (x) => x.Id == this.AuditReportsForm.value.FieldTypeDDL
    );
    this.AllFieldDescription = selectedCode.Description;
    this.AllFieldDescriptionValue =
      this.AuditReportsForm.controls['FieldTypeDDL'].value;
    console.log('Field:', this.AllFieldDescription);
    console.log('FieldNo:', this.AllFieldDescriptionValue);
  }

  public MemberInputField() {
    this.AuditReportsForm.controls['AllMemberTypeDDL'].setValue(
      this.AuditReportsForm.value.AllMemberCode
    );

    let selectedCode = this.GetInputHelpData.AllMemberDropdown.find(
      (x) => x.Id == this.AuditReportsForm.value.AllMemberTypeDDL
    );
    this.AllMemberDescriptionValue =
      this.AuditReportsForm.controls['AllMemberTypeDDL'].value;
  }
  public AllMemberDropDownList() {
    this.AuditReportsForm.controls['AllMemberCode'].setValue(
      this.AuditReportsForm.value.AllMemberTypeDDL
    );
    let selectedCode = this.GetInputHelpData.AllMemberDropdown.find(
      (x) => x.Id == this.AuditReportsForm.value.AllMemberTypeDDL
    );
    this.AllMemberDescription = selectedCode.Description;
    this.AllMemberDescriptionValue =
      this.AuditReportsForm.controls['AllMemberTypeDDL'].value;
    console.log('MemberName:', this.AllMemberDescription);
    console.log('MemberNo:', this.AllMemberDescriptionValue);
  }

  public AccInputField() {
    this.AuditReportsForm.controls['AccType'].setValue(
      this.AuditReportsForm.value.AccTypeCode
    );
    let selectedCode = this.GetInputHelpData.AllAccTypeDropdown.find(
      (x) => x.Id == this.AuditReportsForm.value.AccType
    );
    this.AllAccDescriptionValue =
      this.AuditReportsForm.controls['AccType'].value;
  }

  public AllAccDropDownList() {
    this.AuditReportsForm.controls['AccTypeCode'].setValue(
      this.AuditReportsForm.value.AccType
    );
    let selectedCode = this.GetInputHelpData.AllAccTypeDropdown.find(
      (x) => x.Id == this.AuditReportsForm.value.AccType
    );
    this.AllAccDescription = selectedCode.Description;
    this.AllAccDescriptionValue =
      this.AuditReportsForm.controls['AccType'].value;
    console.log('AccName:', this.AllAccDescription);
    console.log('AccNo:', this.AllAccDescriptionValue);
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
  };
  private setParameter(): void {
    var fValue = this.AuditReportsForm.value;
    this.reportModel.Values = [];

    this.reportModel.ReportName = 'CCULB_rptAuditReport';

    this.reportModel.Values.push(
      new ReportKeyValue('fDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('tDate', this.storetDate)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('tDate', this.storetDate)
    );

    if (this.chbIsAllUserTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('UserIdNo', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('UserIdNo', this.AllUserDescriptionValue)
      );
    }

    if (fValue.rbReportName1 == 1) {
      this.reportModel.Values.push(new ReportKeyValue('rbt1', '0'));
      this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '0'));
    } else if (fValue.rbReportName1 == 2) {
      this.reportModel.Values.push(new ReportKeyValue('rbt1', '1'));
      if (fValue.rbReportName2 == 1) {
        this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '0'));
      } else if (fValue.rbReportName2 == 2) {
        this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '1'));
      } else if (fValue.rbReportName2 == 3) {
        this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '2'));
      }
      else if (fValue.rbReportName2 == 4) {
        this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '3'));
      }
    } else if (fValue.rbReportName1 == 3) {
      this.reportModel.Values.push(new ReportKeyValue('rbt1', '2'));
      if (fValue.rbReportName2 == 1) {
        this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '0'));
      } 
      else if (fValue.rbReportName2 == 4) {
        this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '3'));
      }
    } else if (fValue.rbReportName1 == 4) {
      this.reportModel.Values.push(new ReportKeyValue('rbt1', '3'));
      if (fValue.rbReportName2 == 1) {
        this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '0'));
      } 
      else if (fValue.rbReportName2 == 4) {
        this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '3'));
      }
    }

    // if (fValue.rbReportName2 == 1) {
    //   this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '0'));
    // } else if (fValue.rbReportName2 == 2) {
    //   this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '1'));
    // } else if (fValue.rbReportName2 == 3) {
    //   this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '2'));
    // }
    // else if (fValue.rbReportName2 == 4) {
    //   this.reportModel.Values.push(new ReportKeyValue('radioSecond1', '3'));
    // }

    console.log('heckalue:', fValue.IsAllFieldTypeChb);

    if (this.chbIsAllFieldTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('fieldNo', '0'));

      this.reportModel.Values.push(new ReportKeyValue('fieldName', ' '));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('fieldNo', this.AllFieldDescriptionValue)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('fieldName', this.AllFieldDescription)
      );
    }

    if (this.chbIsAllMemberTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('MemberNo', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('MemberNo', this.AllMemberDescriptionValue)
      );
    }

    if (this.chbIsAllAccTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('AccType', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('AccType', this.AllAccDescriptionValue)
      );
    }

    console.log(this.reportModel.Values);
  }

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
  applicationDateChange() {
    var fv = this.AuditReportsForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.AuditReportsForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.AuditReportsForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.AuditReportsForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.AuditReportsForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.AuditReportsForm.value);
    console.log(this.storetDate);
  }

}
