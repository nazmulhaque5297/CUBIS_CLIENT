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
import { Router } from '@angular/router';
//import { Console } from 'console';

@Component({
  selector: 'app-voter-id-list',
  templateUrl: './voter-id-list.component.html',
  styleUrls: ['./voter-id-list.component.css'],
})
export class VoterIdListComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public voterDataListModel: VoterIdListPageLoadModel = new VoterIdListPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  acc1: boolean = false;
  VoterIdForm: FormGroup;

  vchNo: any;
  chbIsAccountType: boolean = false;
  IsAllAccountTypeDisabled: boolean = true;
  IsAllAccountType2Disabled: boolean = true;
  chbIsAccountType2: boolean = false;
  IsAccountType1Disable: boolean = true;
  IsAccountType2Disable: boolean = true;
  IsAccount1Checked: boolean = false;
  accountType1Value: any;
  accountType2Value: any;
  genderValue: any;
  pictureValue: any;
  GenderDescription: any;
  PictureDescription: any;
  Acc1Description: any;
  Acc2Description: any;
  fromDate1: any;
  fromDate2: any;
  toDate1: any;
  toDate2: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService,
    private voterIdListReportService: VoterIdListReportService,
    private router: Router
  ) // private editAccountService: EditLoanAccountService,
  //private dailyCsTransactionVoucherService:DailyCsTransactionVchRptService,
  {
    this.reportModel.ReportName = 'rptCSVoterIDList';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.IsAllAccountTypeDisabled = true;
    this.IsAllAccountType2Disabled = true;
    this.initializeForm();
    this.VoterIdForm.get('AccountType1').disable();
    this.VoterIdForm.get('AccountType2').disable();
  }
  private initializeForm() {
    this.VoterIdForm = new FormGroup({
      IsAccount1Checked: new FormControl(''),
      IsAccount2Checked: new FormControl(''),
      AccountType1: new FormControl('0'),
      AccountType2: new FormControl('0'),
      LanguageModeRb: new FormControl('0'),
      PictureControl: new FormControl('1'),
      GenderControl: new FormControl('0'),
      IssueFromDate1: new FormControl(''),
      IssueToDate1: new FormControl(''),
      IssueFromDate2: new FormControl(''),
      IssueToDate2: new FormControl(''),
    });
    this.pictureValue = this.VoterIdForm.value.PictureControl;
    this.genderValue = this.VoterIdForm.value.GenderControl;
    this.accountType1Value = this.VoterIdForm.value.AccountType1;
    this.accountType2Value = this.VoterIdForm.value.AccountType2;

    this.getInputHelpData();
  }
  private getInputHelpData() {
    this.IsAllAccountTypeDisabled = true;
    this.IsAllAccountType2Disabled = true;
    this.chbIsAccountType = false;
    this.voterIdListReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.voterDataListModel = data;
        console.log('PageLoadData:', this.voterDataListModel);
        this.VoterIdForm.controls['IssueFromDate1'].setValue(
          this.voterDataListModel.FDateMemStatReport
        );
        this.VoterIdForm.controls['IssueToDate1'].setValue(
          this.voterDataListModel.ToDate
        );
        this.VoterIdForm.controls['IssueFromDate2'].setValue(
          this.voterDataListModel.FDateMemStatReport
        );
        this.VoterIdForm.controls['IssueToDate2'].setValue(
          this.voterDataListModel.ToDate
        );
      });
  }

  CheckCheckBox1() {
    if (this.IsAllAccountTypeDisabled == true) {
      this.IsAllAccountTypeDisabled = false;
      this.VoterIdForm.get('AccountType1').enable();
    } else {
      this.IsAllAccountTypeDisabled = true;
      this.VoterIdForm.get('AccountType1').disable();
      this.VoterIdForm.controls['AccountType1'].setValue('0');
    }
  }

  CheckCheckBox2() {
    if (this.IsAllAccountType2Disabled == true) {
      this.IsAllAccountType2Disabled = false;
      this.VoterIdForm.get('AccountType2').enable();
    } else {
      this.IsAllAccountType2Disabled = true;
      this.VoterIdForm.get('AccountType2').disable();
      this.VoterIdForm.controls['AccountType2'].setValue('0');
    }
  }

  AccountType1() {
    let selectedCode = this.voterDataListModel.AccountType1DropDown.find(
      (x) => x.Id == this.VoterIdForm.value.AccountType1
    );
    this.Acc1Description = selectedCode.Description;
    console.log('AccDes1:', this.Acc1Description);
    this.accountType1Value = this.VoterIdForm.controls['AccountType1'].value;
    console.log('AccountType1:', this.accountType1Value);
  }
  AccountType2() {
    let selectedCode = this.voterDataListModel.AccountType2DropDown.find(
      (x) => x.Id == this.VoterIdForm.value.AccountType2
    );
    this.Acc2Description = selectedCode.Description;
    console.log('AccDes2:', this.Acc2Description);
    this.accountType2Value = this.VoterIdForm.controls['AccountType2'].value;
    console.log('AccountType2:', this.accountType2Value);
  }
  GenderType() {
    let selectedCode = this.voterDataListModel.GenderDropDown.find(
      (x) => x.Id == this.VoterIdForm.value.GenderControl
    );
    this.GenderDescription = selectedCode.Description;
    console.log('GenderDes:', this.GenderDescription);
    this.genderValue = this.VoterIdForm.controls['GenderControl'].value;
    console.log('Gender:', this.genderValue);
  }

  //Date Formatting
  convertDateToString(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('/');
  }
  PictureType() {
    let selectedCode = this.voterDataListModel.WithWithoutPicDropDown.find(
      (x) => x.Id == this.VoterIdForm.value.PictureControl
    );
    this.PictureDescription = selectedCode.Description;
    console.log('GenderDes:', this.PictureDescription);
    this.pictureValue = this.VoterIdForm.controls['PictureControl'].value;
    console.log('Picture:', this.pictureValue);
  }

  public getReportToken = (type: any) => {
    console.log('AccountGetReport ::::', this.VoterIdForm.value.AccountType1);
    if (this.acc1 === false) {
      alert('Please Select a Account Type!!!');
      return;
    }
    this.fromDate1 = this.VoterIdForm.controls['IssueFromDate1'].value;
    this.fromDate2 = this.VoterIdForm.controls['IssueFromDate2'].value;
    this.toDate1 = this.VoterIdForm.controls['IssueToDate1'].value;
    this.toDate2 = this.VoterIdForm.controls['IssueToDate2'].value;
    this.fromDate1 =
      typeof this.VoterIdForm.value.IssueFromDate1 == 'string'
        ? this.VoterIdForm.value.IssueFromDate1
        : this.convertDateToString(this.VoterIdForm.value.IssueFromDate1);
    console.log('ChangedDate:', this.fromDate1);
    this.fromDate2 =
      typeof this.VoterIdForm.value.IssueFromDate2 == 'string'
        ? this.VoterIdForm.value.IssueFromDate2
        : this.convertDateToString(this.VoterIdForm.value.IssueFromDate2);
    console.log('ChangedDate2:', this.fromDate2);
    this.toDate1 =
      typeof this.VoterIdForm.value.IssueToDate1 == 'string'
        ? this.VoterIdForm.value.IssueToDate1
        : this.convertDateToString(this.VoterIdForm.value.IssueToDate1);
    this.toDate2 =
      typeof this.VoterIdForm.value.IssueToDate2 == 'string'
        ? this.VoterIdForm.value.IssueToDate2
        : this.convertDateToString(this.VoterIdForm.value.IssueToDate2);
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
    var fValue = this.VoterIdForm.value;
    this.reportModel.Values = [];
    if (fValue.LanguageModeRb == 0) {
      this.reportModel.ReportName = 'CSVoterIDList';
    } else {
      this.reportModel.ReportName = 'rptCSVoterIDListB';
    }

    this.reportModel.Values.push(new ReportKeyValue('fDate1', this.fromDate1));

    this.reportModel.Values.push(new ReportKeyValue('tDate1', this.toDate1));
    this.reportModel.Values.push(new ReportKeyValue('fDate2', this.fromDate2));
    this.reportModel.Values.push(new ReportKeyValue('tDate2', this.toDate2));

    this.reportModel.Values.push(
      new ReportKeyValue('accountType1Value', this.accountType1Value)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('accountType2Value', this.accountType2Value)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('genderValue', this.genderValue)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('pictureValue', this.pictureValue)
    );
    if (this.genderValue == 0) {
      this.reportModel.Values.push(
        new ReportKeyValue('GenderDescription', 'ALL')
      );
    } else if (this.genderValue == 1) {
      this.reportModel.Values.push(
        new ReportKeyValue('GenderDescription', 'Male')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('GenderDescription', 'Female')
      );
    }

    if (this.pictureValue == 0) {
      this.reportModel.Values.push(
        new ReportKeyValue('PictureDescription', 'With Picture')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('PictureDescription', 'Without Picture')
      );
    }

    if (this.Acc1Description != null) {
      this.reportModel.Values.push(
        new ReportKeyValue('Acc1Description', this.Acc1Description)
      );
    } else {
      this.reportModel.Values.push(new ReportKeyValue('Acc1Description', '0'));
    }

    if (this.Acc2Description != null) {
      this.reportModel.Values.push(
        new ReportKeyValue('Acc2Description', this.Acc2Description)
      );
    } else {
      this.reportModel.Values.push(new ReportKeyValue('Acc2Description', '0'));
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
}
