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
import { GLBudgetReportService } from 'src/app/services/gl-budget-report.service';
import { GLBudgetReportPageLoadModel } from '../../../models/gl-budget-report.model';

@Component({
  selector: 'app-budget-reports',
  templateUrl: './budget-reports.component.html',
  styleUrls: ['./budget-reports.component.css'],
})
export class BudgetReportsComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  GetInputHelpData: GLBudgetReportPageLoadModel = new GLBudgetReportPageLoadModel();

  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  GLBudgetReportForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    public gLBudgetReportService: GLBudgetReportService
  ) {
    this.reportModel.ReportName = 'rptGLBudgetAssetLib4th';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.GLBudgetReportForm = new FormGroup({
      MonthControl: new FormControl('0'),
      YearControl: new FormControl(''),
      rbReportName: new FormControl('1'),
    });
    this.getInputHelpData();
  }

  public getInputHelpData() {
    this.gLBudgetReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        console.log('GetInputHelpData:', data);
        this.GetInputHelpData = data;
        let monthDate = Number(
          this.GetInputHelpData.ProcessDate[3] +
            '' +
            this.GetInputHelpData.ProcessDate[4]
        );
        console.log(monthDate);
        this.GLBudgetReportForm.controls['MonthControl'].setValue(monthDate);
        console.log('Total Data:', this.GetInputHelpData);
        this.GLBudgetReportForm.controls['YearControl'].setValue(
          this.GetInputHelpData.Year
        );
      });
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
    var fValue = this.GLBudgetReportForm.value;
    this.reportModel.Values = [];

    if (fValue.rbReportName === '1') {
      this.reportModel.ReportName = 'rptGLBudgetAssetLib4th';
    } else if (fValue.rbReportName === '2') {
      this.reportModel.ReportName = 'rptGLBudgetIncomeExp4th';
    }

    this.reportModel.Values.push(
      new ReportKeyValue('rbReportName', fValue.rbReportName)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('FromDate', this.GetInputHelpData.FromDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('ToDate', this.GetInputHelpData.ToDate)
    );

    if (fValue.rbReportName === '1') {
      this.reportModel.Values.push(
        new ReportKeyValue('commonName1', 'Assets and Liabilities')
      ),
        this.reportModel.Values.push(
          new ReportKeyValue('commonNameDesc', 'Total Liability')
        );
    } else if (fValue.rbReportName === '2') {
      this.reportModel.Values.push(
        new ReportKeyValue('commonName1', 'IncomeAssets and Expenditure')
      ),
        this.reportModel.Values.push(
          new ReportKeyValue('commonNameDesc', 'Total Expenditure')
        );
    }
    this.reportModel.Values.push(
      new ReportKeyValue('MonthControl', fValue.MonthControl)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('YearControl', fValue.YearControl)
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
}
