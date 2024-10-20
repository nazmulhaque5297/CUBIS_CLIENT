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
import { GLAccountStatementPageLoadModel } from '../../../models/gl-account-statement-report.model';
import { GLAccountStatementService } from 'src/app/services/gl-account-statement-report.service';
import { Location } from '@angular/common';
import { VoterIdListReportService } from 'src/app/services/voter-id-list.service';
import { VoterIdListPageLoadModel } from '../../../models/voter-id-list.model';
import { PaymentAndReceiveReportPageLoadModel } from '../../../models/payment-and-receive.model';
import { ReceivedAndPaymentReportService } from 'src/app/services/receive-and-payment-report.service';
import { Router } from '@angular/router';
import { MemberImageInfoReportService } from 'src/app/services/member-image-info-report.service';
import { MemberImageInfoReportPageLoadModel } from '../../../models/member-image-info-report.model';
import { TouchSequence } from 'selenium-webdriver';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-member-image-information-report',
  templateUrl: './member-image-information-report.component.html',
  styleUrls: ['./member-image-information-report.component.css'],
})
export class MemberImageInformationReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: MemberImageInfoReportPageLoadModel = new MemberImageInfoReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  MemberImageInfoForm: FormGroup;
  chbIsZeroStatus: boolean = true;
  IsAllMemberTypeDisabled: boolean = true;
  IsAllCollectorTypeDisabled: boolean = true;
  IsAllGroupDisabled: boolean = true;
  GroupDDLName: any;
  GroupDDLValue: any;
  CollectorDDLName: any;
  CollectorDDLValue: any;
  MemberTypeDDLName: any;
  MemberTypeDDLValue: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    // private loanInfoReportService: LoanInfoReportService,
    private memberImageInfoReportService: MemberImageInfoReportService
  ) {
    //this.reportModel.ReportName = 'rptMCsGenerateMemberImageList';
    this.reportModel.ReportName = 'CCULB_rptMCsGenerateMemberImageList';

    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.IsAllMemberTypeDisabled = true;
    this.IsAllCollectorTypeDisabled = true;
    this.IsAllGroupDisabled = true;
    this.initializeForm();
  }
  private initializeForm() {
    this.MemberImageInfoForm = new FormGroup({
      ImageTypeRb: new FormControl('1'),
      ImageTypeRb2: new FormControl('1'),
      AllMemberType: new FormControl('0'),
      AllCollectorType: new FormControl('0'),
      AllGroupType: new FormControl('0'),
      IsAllMemberTypeChecked: new FormControl('0'),
      IsAllCollectorTypeChecked: new FormControl('0'),
      IsAllGroupChecked: new FormControl('0'),
    });

    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.IsAllMemberTypeDisabled = true;
    this.IsAllCollectorTypeDisabled = true;
    this.IsAllGroupDisabled = true;
    this.memberImageInfoReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
      });
    this.MemberImageInfoForm.get('AllMemberType').disable();
    this.MemberImageInfoForm.get('AllCollectorType').disable();
    this.MemberImageInfoForm.get('AllGroupType').disable();
  }

  public CheckAllMemberType() {
    if (this.IsAllMemberTypeDisabled == true) {
      this.IsAllMemberTypeDisabled = false;
      this.MemberImageInfoForm.get('AllMemberType').enable();
    } else {
      this.IsAllMemberTypeDisabled = true;
      this.MemberImageInfoForm.get('AllMemberType').disable();
      this.MemberImageInfoForm.controls['AllMemberType'].setValue('0');
    }
  }

  public CheckAllCollectorType() {
    if (this.IsAllCollectorTypeDisabled == true) {
      this.IsAllCollectorTypeDisabled = false;
      this.MemberImageInfoForm.get('AllCollectorType').enable();
    } else {
      this.IsAllCollectorTypeDisabled = true;
      this.MemberImageInfoForm.controls['AllCollectorType'].setValue('0');
      this.MemberImageInfoForm.get('AllCollectorType').disable();
    }
  }

  public CheckAllGroupType() {
    if (this.IsAllGroupDisabled == true) {
      this.IsAllGroupDisabled = false;
      this.MemberImageInfoForm.get('AllGroupType').enable();
    } else {
      this.IsAllGroupDisabled = true;
      this.MemberImageInfoForm.controls['AllGroupType'].setValue('0');
      this.MemberImageInfoForm.get('AllGroupType').disable();
    }
  }

  public AllGroupDDL() {
    let selectedCode = this.pageLoadModel.AllGroupDropdown.find(
      (x) => x.Id == this.MemberImageInfoForm.value.AllGroupType
    );
    this.GroupDDLName = selectedCode.Description;
    this.GroupDDLValue = selectedCode;
  }

  public AllCollectorDDL() {
    let selectedCode = this.pageLoadModel.AllCollectorDropdown.find(
      (x) => x.Id == this.MemberImageInfoForm.value.AllCollectorType
    );
    this.CollectorDDLName = selectedCode.Description;
    this.CollectorDDLValue = selectedCode;
  }

  public AllMemberTypeDDL() {
    let selectedCode = this.pageLoadModel.AllGroupDropdown.find(
      (x) => x.Id == this.MemberImageInfoForm.value.AllMemberType
    );
    this.MemberTypeDDLName = selectedCode.Description;
    this.MemberTypeDDLValue = selectedCode;
  }

  public getReportToken = (type: any) => {
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
  private setParameter(): void {
    var fValue = this.MemberImageInfoForm.value;
    this.reportModel.Values = [];

    if (this.IsAllGroupDisabled == true) {
      this.reportModel.Values.push(new ReportKeyValue('CommonNo1', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName1', 'All Group')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo1', this.GroupDDLValue)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName1', this.GroupDDLName)
      );
    }

    if (this.IsAllCollectorTypeDisabled == true) {
      this.reportModel.Values.push(new ReportKeyValue('CommonNo2', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName2', 'All Collector')
      );
    } else if (fValue.IsAllCollectorTypeChecked == false) {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo2', this.CollectorDDLValue)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName2', this.CollectorDDLName)
      );
    }

    if (this.IsAllMemberTypeDisabled == true) {
      this.reportModel.Values.push(new ReportKeyValue('CommonNo3', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName3', 'All Member Type')
      );
    } else if (fValue.IsAllMemberTypeChecked == false) {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo3', this.MemberTypeDDLValue)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName3', this.MemberTypeDDLName)
      );
    }

    if (fValue.ImageTypeRb == '1') {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName4', 'Card Image')
      );
    } else if (fValue.ImageTypeRb == '2') {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName4', 'Picture Image')
      );
    } else if (fValue.ImageTypeRb == '3') {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName4', 'Signature Image')
      );
    } else if (fValue.ImageTypeRb == '4') {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName4', 'Referance Picture Image')
      );
    }

    if (fValue.ImageTypeRb2 == '1') {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName5', 'With Image')
      );
    } else if (fValue.ImageTypeRb2 == '2') {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName5', 'Without Image')
      );
    }

    this.reportModel.Values.push(new ReportKeyValue('rb1', fValue.ImageTypeRb));
    this.reportModel.Values.push(
      new ReportKeyValue('rb2', fValue.ImageTypeRb2)
    );

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
}
