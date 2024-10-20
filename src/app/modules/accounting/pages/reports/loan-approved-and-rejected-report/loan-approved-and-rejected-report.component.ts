import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { FormGroup, FormControl } from '@angular/forms';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import { Router } from '@angular/router';
import { LoanRecoveryReportPageLoadModel } from '../../../models/loan-recovery-report.model';
import { LoanApproveAndRejectReportService } from 'src/app/services/loan-approve-and-reject-report.service';
import { LoanApproveAndRejectReportPageLoadModel } from '../../../models/loan-approve-and-reject-report.model';

@Component({
  selector: 'app-loan-approved-and-rejected-report',
  templateUrl: './loan-approved-and-rejected-report.component.html',
  styleUrls: ['./loan-approved-and-rejected-report.component.css'],
})
export class LoanApprovedAndRejectedReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: LoanApproveAndRejectReportPageLoadModel = new LoanApproveAndRejectReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  isCollectorDisable: boolean = true;
  isGroupDisable: boolean = true;
  CollectorName: any;
  GroupName: any;
  rbShowHide: boolean = false;
  LoanApprovedRejectForm: FormGroup;

  storeFvalue: any;
  storeTvalue: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    // private loanInfoReportService: LoanInfoReportService,
    private loanApproveAndRejectReportService: LoanApproveAndRejectReportService
  ) {
    this.reportModel.ReportName = 'rptCSLoanApprovedList';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.LoanApprovedRejectForm = new FormGroup({
      CollectorChb: new FormControl('0'),
      CollectorCodeInput: new FormControl(''),
      CollectorCodeDdl: new FormControl('0'),
      GroupChb: new FormControl('0'),
      GroupNameInput: new FormControl(''),
      AllGroupDdl: new FormControl('0'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      LoanInfoeRb: new FormControl('0'),
      LoanApprovedRb: new FormControl('1'),
    });
    this.LoanApprovedRejectForm.get('CollectorCodeDdl').disable();
    this.LoanApprovedRejectForm.get('AllGroupDdl').disable();

    this.getInputHelpData();
  }

  public getInputHelpData() {
    this.loanApproveAndRejectReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
        this.LoanApprovedRejectForm.controls['IssueFromDate'].setValue(
          this.pageLoadModel.FromDate
        );
        this.LoanApprovedRejectForm.controls['IssueToDate'].setValue(
          this.pageLoadModel.ToDate
        );
        this.storeFvalue = this.pageLoadModel.FromDate;
        this.storeTvalue = this.pageLoadModel.ToDate;
      });

    this.rbShowHide = false;
  }

  public CollectorDDlChb() {
    if (this.isCollectorDisable == true) {
      this.isCollectorDisable = false;
      this.LoanApprovedRejectForm.get('CollectorCodeDdl').enable();
    } else {
      this.isCollectorDisable = true;
      this.LoanApprovedRejectForm.get('CollectorCodeDdl').disable();
      this.LoanApprovedRejectForm.controls['CollectorCodeInput'].setValue('');
      this.LoanApprovedRejectForm.controls['CollectorCodeDdl'].setValue('0');
    }
  }
  public GroupDDlChb() {
    if (this.isGroupDisable == true) {
      this.isGroupDisable = false;
      this.LoanApprovedRejectForm.get('AllGroupDdl').enable();
    } else {
      this.isGroupDisable = true;
      this.LoanApprovedRejectForm.get('AllGroupDdl').disable();
      this.LoanApprovedRejectForm.controls['GroupNameInput'].setValue('');
      this.LoanApprovedRejectForm.controls['AllGroupDdl'].setValue('0');
    }
  }
  public CollectorOptChange() {
    this.LoanApprovedRejectForm.controls['CollectorCodeInput'].setValue(
      this.LoanApprovedRejectForm.value.CollectorCodeDdl
    );
    let selectedCode = this.pageLoadModel.AllCollectorDropdown.find(
      (x) => x.Id == this.LoanApprovedRejectForm.value.CollectorCodeInput
    );
    this.CollectorName = selectedCode.Description;
  }

  public CollectorInputChange() {
    this.LoanApprovedRejectForm.controls['CollectorCodeDdl'].setValue(
      this.LoanApprovedRejectForm.value.CollectorCodeInput
    );
  }

  public GroupInputChange() {
    this.LoanApprovedRejectForm.controls['AllGroupDdl'].setValue(
      this.LoanApprovedRejectForm.value.GroupNameInput
    );
  }
  public GroupDDLOptChange() {
    this.LoanApprovedRejectForm.controls['GroupNameInput'].setValue(
      this.LoanApprovedRejectForm.value.AllGroupDdl
    );
    let selectedCode = this.pageLoadModel.AllGroupDropdown.find(
      (x) => x.Id == this.LoanApprovedRejectForm.value.GroupNameInput
    );
    this.GroupName = selectedCode.Description;
  }
  public RadioBtnSHowHide() {
    if (this.LoanApprovedRejectForm.value.LoanInfoeRb == 1) {
      this.rbShowHide = true;
    } else {
      this.rbShowHide = false;
    }
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
  };
  private setParameter(): void {
    var fValue = this.LoanApprovedRejectForm.value;
    this.reportModel.Values = [];

    if (fValue.LoanInfoeRb === '1') {
      this.reportModel.ReportName = 'rptCSLoanApprovedList';
    } else if (fValue.LoanInfoeRb === '2') {
      this.reportModel.ReportName = 'rptCSLoanRejectList';
    } else if (fValue.LoanInfoeRb === '0') {
      this.reportModel.ReportName = 'rptCSLoanOnProcessList';
    }

    this.reportModel.Values.push(
      new ReportKeyValue('CommonNo1', fValue.LoanApprovedRb)
    );

    this.reportModel.Values.push(new ReportKeyValue('fDate', this.storeFvalue));
    this.reportModel.Values.push(new ReportKeyValue('tDate', this.storeTvalue));

    if (fValue.CollectorCodeInput == '') {
      this.reportModel.Values.push(new ReportKeyValue('CollectorCode', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorCodeName', 'All')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorCode', fValue.CollectorCodeInput)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorCodeName', this.CollectorName)
      );
    }

    if (fValue.GroupNameInput == '') {
      this.reportModel.Values.push(new ReportKeyValue('GroupCode', '0'));
      this.reportModel.Values.push(new ReportKeyValue('GroupCodeName', 'All'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorCode', fValue.GroupNameInput)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorCodeName', this.GroupName)
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

  // Date change event
  applicationDateChange() {
    var fv = this.LoanApprovedRejectForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanApprovedRejectForm.value.IssueFromDate = formatedValue;
    this.storeFvalue = formatedValue;
    console.log(this.LoanApprovedRejectForm.value);
    console.log(this.storeFvalue);
  }
  applicationDateChange2() {
    var fv = this.LoanApprovedRejectForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanApprovedRejectForm.value.IssueToDate = formatedValue;
    this.storeTvalue = formatedValue;
    console.log(this.LoanApprovedRejectForm.value);
    console.log(this.storeTvalue);
  }
}
