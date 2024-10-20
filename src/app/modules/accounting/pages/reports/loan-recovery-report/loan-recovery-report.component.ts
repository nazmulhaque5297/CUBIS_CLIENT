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

import { CSBlankSheetReportService } from 'src/app/services/cs-blank-sheet-report.service';
import { CSBlankSheetReportPageLoadModel } from '../../../models/cs-blank-sheet-report.model';
import { LoanRecoveryReportService } from 'src/app/services/loan-recovery-report.service';
import { LoanRecoveryReportPageLoadModel } from '../../../models/loan-recovery-report.model';
import { IdDescription } from 'src/app/interfaces/id-description';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-loan-recovery-report',
  templateUrl: './loan-recovery-report.component.html',
  styleUrls: ['./loan-recovery-report.component.css'],
})
export class LoanRecoveryReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: LoanRecoveryReportPageLoadModel = new LoanRecoveryReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  module: string = '1';
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  isCollectorDisable: boolean = true;
  isGroupDisable: boolean = true;
  LoanRecoveryForm: FormGroup;
  selectedMonth: any;
  selectedYear: any;
  processDate: any;
  monthDdl: any;
  yearDdl: any;
  storefDate: any;
  storetDate: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    // private loanInfoReportService: LoanInfoReportService,
    private loanRecoveryReportService: LoanRecoveryReportService,

    private route: ActivatedRoute
  ) {
    this.reportModel.ReportName = 'CCULB_rptCSDailyLoanRecoveryReportE';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
    this.initializeForm();
  }
  private initializeForm() {
    this.LoanRecoveryForm = new FormGroup({
      AllAccDdl: new FormControl('0'),
      MonthDdl: new FormControl('0'),
      YearDdl: new FormControl('0'),
      CollectorChb: new FormControl('0'),
      CollectorCodeInput: new FormControl(''),
      GroupChb: new FormControl('0'),
      GroupNameInput: new FormControl(''),
      AllGroupDdl: new FormControl('0'),
      LangModeRb: new FormControl('0'),
      CollectorCodeDdl: new FormControl('0'),
      CollectionRb: new FormControl('0'),
      chbOldAccNoWise: new FormControl(false),
    });
    this.LoanRecoveryForm.get('CollectorCodeDdl').disable();
    this.LoanRecoveryForm.get('AllGroupDdl').disable();

    this.getInputHelpData();
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    let url = route.pathFromRoot
      .map((v) => v.url.map((segment) => segment.toString()).join('/'))
      .join('/');
    const queryParam = route.queryParamMap;
    if (queryParam.keys.length > 0) {
      url +=
        '?' +
        queryParam.keys
          .map((key) =>
            queryParam
              .getAll(key)
              .map((value) => key + '=' + value)
              .join('&')
          )
          .join('&');
    }
    return this.getModuleName(url);
  }
  getModuleName(urlData: any) {
    console.log(urlData);
    var result = '';
    for (var i = 1; i < urlData.length; i++) {
      if (urlData[i] == '/') return result;
      result += urlData[i];
    }
  }

  public getInputHelpData() {
    this.loanRecoveryReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
        console.log('All Data:', this.pageLoadModel);

        this.selectedMonth = data.AllMonthDropdown;
        this.selectedYear = data.AllYearDropdown;

        this.processDate = this.pageLoadModel.ProcessDate;
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
        console.log('SelectedMonth:', this.monthDdl.Id);
        console.log('SelectedMonth:', this.yearDdl.Id);
        this.LoanRecoveryForm.controls['MonthDdl'].setValue(this.monthDdl.Id);
        this.LoanRecoveryForm.controls['YearDdl'].setValue(this.yearDdl.Id);
      });
  }
  public CollectorDDlChb() {
    if (this.isCollectorDisable == true) {
      this.isCollectorDisable = false;
      this.LoanRecoveryForm.get('CollectorCodeDdl').enable();
    } else {
      this.isCollectorDisable = true;
      this.LoanRecoveryForm.get('CollectorCodeDdl').disable();
      this.LoanRecoveryForm.controls['CollectorCodeInput'].setValue('');
      this.LoanRecoveryForm.controls['CollectorCodeDdl'].setValue('0');
    }
  }
  public GroupDDlChb() {
    if (this.isGroupDisable == true) {
      this.isGroupDisable = false;
      this.LoanRecoveryForm.get('AllGroupDdl').enable();
    } else {
      this.isGroupDisable = true;
      this.LoanRecoveryForm.get('AllGroupDdl').disable();
      this.LoanRecoveryForm.controls['GroupNameInput'].setValue('');
      this.LoanRecoveryForm.controls['AllGroupDdl'].setValue('0');
    }
  }

  public CollectorOptChange() {
    this.LoanRecoveryForm.controls['CollectorCodeInput'].setValue(
      this.LoanRecoveryForm.value.CollectorCodeDdl
    );
  }
  public CollectorInputChange() {
    this.LoanRecoveryForm.controls['CollectorCodeDdl'].setValue(
      this.LoanRecoveryForm.value.CollectorCodeInput
    );
  }

  public GroupInputChange() {
    this.LoanRecoveryForm.controls['AllGroupDdl'].setValue(
      this.LoanRecoveryForm.value.GroupNameInput
    );
  }
  public GroupDDLOptChange() {
    this.LoanRecoveryForm.controls['GroupNameInput'].setValue(
      this.LoanRecoveryForm.value.AllGroupDdl
    );
  }

  public getReportToken = (type: any) => {
    if (this.LoanRecoveryForm.controls['AllAccDdl'].value == '0') {
      alert('Please Select Account Type!');
      return;
    }

    if (this.LoanRecoveryForm.controls['MonthDdl'].value == '0') {
      alert('Please Select Month!');
      return;
    }

    if (this.LoanRecoveryForm.controls['YearDdl'].value == '0') {
      alert('Please Select Year!');
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
  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }
  private setParameter(): void {
    var fValue = this.LoanRecoveryForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('CollectionRb', fValue.CollectionRb)
    );

    //start AccType
    this.reportModel.Values.push(
      new ReportKeyValue('AccType', fValue.AllAccDdl)
    );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccTypeDesc',
        this.getSelectedItemText(
          fValue.AllAccDdl,
          this.pageLoadModel.AllAccountDropdown
        )
      )
    );

    // end AccType

    //start Collector
    if (fValue.CollectorChb === '0') {
      this.reportModel.Values.push(new ReportKeyValue('Collector', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorDesc', 'All Collector')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('Collector', fValue.CollectorCodeInput)
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'CollectorDesc',
          this.getSelectedItemText(
            fValue.CollectorCodeInput,
            this.pageLoadModel.AllCollectorDropdown
          )
        )
      );
    }

    //end Collector

    //start Group
    if (fValue.GroupChb === '0') {
      this.reportModel.Values.push(new ReportKeyValue('Group', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue('GroupDesc', 'All Group')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('Group', fValue.GroupNameInput)
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'GroupDesc',
          this.getSelectedItemText(
            fValue.GroupNameInput,
            this.pageLoadModel.AllGroupDropdown
          )
        )
      );
    }

    //end Group

    this.reportModel.Values.push(
      new ReportKeyValue('MonthDdl', fValue.MonthDdl.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('YearDdl', fValue.YearDdl.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('chbOldAccNoWise', fValue.chbOldAccNoWise)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('LanguageRb', fValue.LangModeRb)
    );

    //report name lodgic start

    if (this.accTypeClassData.AccTypeClass == 1) {
      console.log('This is AccTypeMode 1 ');
      if (fValue.LangModeRb == 0) {
        this.reportModel.ReportName = 'CCULB_rptCSDailyLoanRecoveryReportE';
      } else {
        this.reportModel.ReportName = 'rptCSDailyLoanRecoveryReport';
      }
    }
    if (this.accTypeClassData.AccTypeClass == 2) {
      console.log('This is AccTypeMode 2 ');
      if (fValue.LangModeRb == 0) {
        this.reportModel.ReportName = 'CCULB_rptCSWeeklyLoanRecoveryReportE';
      } else {
        this.reportModel.ReportName = 'rptCSWeeklyLoanRecoveryReport';
      }
    }
    if (this.accTypeClassData.AccTypeClass == 3) {
      console.log(
        'This is AccTypeMode 3 and oldAccNoWise--->',
        fValue.chbOldAccNoWise
      );
      if (fValue.LangModeRb == 0 && fValue.chbOldAccNoWise) {
        this.reportModel.ReportName =
          'CCULB_rptCSMonthlyLoanRecoveryReportE_ByOldAcc';
      } else if (fValue.LangModeRb == 0 && !fValue.chbOldAccNoWise) {
        this.reportModel.ReportName = 'CCULB_rptCSMonthlyLoanRecoveryReportE';
      } else if (fValue.LangModeRb == 1 && fValue.chbOldAccNoWise) {
        this.reportModel.ReportName = 'rptCSMonthlyLoanRecoveryReport_ByOldAcc';
      } else if (fValue.LangModeRb == 1 && !fValue.chbOldAccNoWise) {
        this.reportModel.ReportName = 'rptCSMonthlyLoanRecoveryReport';
      }
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

  //events A/C Type
  onChangeAccType(event: any) {
    let AccTypeId = this.LoanRecoveryForm.controls['AllAccDdl'].value;
    console.log(AccTypeId);

    //start get acctype Mode
    this.spinner.show();
    this.loanRecoveryReportService
      .getAccTypeClassDetails(AccTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accTypeClassData = data;
        console.log('This is accTypeMode=', this.accTypeClassData);
        this.spinner.hide();

        (err) => {
          this.spinner.hide();
        };
      });
    //end get acctype Mode
  }

  // Date change event
  applicationDateChange() {
    var fv = this.LoanRecoveryForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanRecoveryForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.LoanRecoveryForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.LoanRecoveryForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanRecoveryForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.LoanRecoveryForm.value);
    console.log(this.storetDate);
  }
}
