import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ReportCommonService } from 'src/app/services/report-common.service';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
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
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import { AuditReportService } from 'src/app/services/audit-reports.service';
import { AuditReportPageLoadModel } from '../../../models/audit-reports.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StrengthAnalysisReportService } from 'src/app/services/strength-analysis-report.service';
import { StrengthAnalysisReportPageLoadModel } from '../../../models/strength-analysis-report.model';

@Component({
  selector: 'app-strength-analysis-report',
  templateUrl: './strength-analysis-report.component.html',
  styleUrls: ['./strength-analysis-report.component.css'],
})
export class StrengthAnalysisReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  public inputHelpData2: JournalReportInputHelp = new JournalReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  processDate: any;
  selectedMonth: any;
  selectedYear: any;
  monthDdl: any;
  yearDdl: any;

  StrengthAnalysisForm: FormGroup;

  GetInputHelpData: StrengthAnalysisReportPageLoadModel = new StrengthAnalysisReportPageLoadModel();
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private journalReportService: JournalReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService,
    private strengthAnalysisReportService: StrengthAnalysisReportService,
    private router: Router
  ) {
    this.reportModel.ReportName = 'CCULB_rptMemberAnalysisReport';
    this.reportModel.Values = [];
  }
  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelpData();
  }
  private initializeForm() {
    this.MemberDetailsList = null;

    this.StrengthAnalysisForm = new FormGroup({
      MonthDDL: new FormControl('0'),
      YearDDL: new FormControl('0'),
      rbReportName: new FormControl('1'),
    });
  }
  public getInputHelpData() {
    this.strengthAnalysisReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        console.log('GetInputHelpData:', data);
        this.GetInputHelpData = data;
        this.selectedMonth = data.AllMonthDropdown;
        this.selectedYear = data.AllYearDropdown;

        this.processDate = this.GetInputHelpData.ProcessDate;
        let month = this.processDate[3] + '' + this.processDate[4];
        let year =
          this.processDate[6] +
          '' +
          this.processDate[7] +
          '' +
          this.processDate[8] +
          '' +
          this.processDate[9];
        console.log('Month', month);

        this.monthDdl = this.selectedMonth.find((x) => x.Id == month);
        this.yearDdl = this.selectedYear.find((x) => x.Id == year);

        console.log('SelectedMonth:', this.monthDdl.Description);
        this.StrengthAnalysisForm.controls['MonthDDL'].setValue(
          this.monthDdl.Id
        );
        this.StrengthAnalysisForm.controls['YearDDL'].setValue(this.yearDdl.Id);

        //this.StrengthAnalysisForm.controls['IssueFromDate'].setValue( this.GetInputHelpData.);
      });
  }

  public RadioButtonValue(e) {}

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
    var fValue = this.StrengthAnalysisForm.value;
    this.reportModel.Values = [];
    this.monthDdl = this.selectedMonth.find(
      (x) => x.Id == this.StrengthAnalysisForm.value.MonthDDL
    );
    if (fValue.rbReportName == 1) {
      this.reportModel.ReportName = 'CCULB_rptMemberAnalysisReport';
    } else {
      this.reportModel.ReportName = 'CCULB_rptLoanAnalysisReport';
    }

    this.reportModel.Values.push(
      new ReportKeyValue('month', this.monthDdl.Description)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('year', fValue.YearDDL.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('monthID', this.monthDdl.Id)
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
