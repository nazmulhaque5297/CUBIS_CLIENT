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
import { CSBlankSheetReportService } from 'src/app/services/cs-blank-sheet-report.service';
import { CSBlankSheetReportPageLoadModel } from '../../../models/cs-blank-sheet-report.model';
import { FinalAccountsReportService } from 'src/app/services/final-accounts-report.service';

@Component({
  selector: 'app-blank-collection-sheet',
  templateUrl: './blank-collection-sheet.component.html',
  styleUrls: ['./blank-collection-sheet.component.css'],
})
export class BlankCollectionSheetComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: CSBlankSheetReportPageLoadModel = new CSBlankSheetReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  RbButtonshow: boolean = false;
  BlankCollectionForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    // private loanInfoReportService: LoanInfoReportService,
    private csBlankSheetReportService: CSBlankSheetReportService
  ) {
    this.reportModel.ReportName = 'rptMCSWeeklySavingsCollectionSheet';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.BlankCollectionForm = new FormGroup({
      AllAccDdl: new FormControl('0'),
      GroupTypeInput: new FormControl(''),
      GroupDdl: new FormControl('0'),
      CustomerServiceRb: new FormControl('1'),
    });

    this.getInputHelpData();
  }

  public getInputHelpData() {
    this.csBlankSheetReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        console.log('AllData:', data);
        this.pageLoadModel = data;
      });
  }
  public AccChange() {
    var fValue = this.BlankCollectionForm.value;
    console.log('DDLValue-->', fValue.AllAccDdl);
    if (fValue.AllAccDdl == 120) {
      this.RbButtonshow = true;
    } else {
      this.RbButtonshow = false;
    }
  }
  public GroupDDlChange() {
    this.BlankCollectionForm.controls['GroupTypeInput'].setValue(
      this.BlankCollectionForm.value.GroupDdl
    );
  }
  public GroupInputCode() {
    this.BlankCollectionForm.controls['GroupDdl'].setValue(
      this.BlankCollectionForm.value.GroupTypeInput
    );
  }
  public rb1Checked() {
    //this.RbButtonshow=false;
  }
  public rb2Checked() {
    //this.RbButtonshow=true;
  }

  public getReportToken = (type: any) => {
    if (this.BlankCollectionForm.value.AllAccDdl == '0') {
      alert('Please Select A Account Type!!! ');
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
  private setParameter(): void {
    var fValue = this.BlankCollectionForm.value;
    this.reportModel.Values = [];

    if (fValue.AllAccDdl == 121) {
      this.reportModel.ReportName = 'rptMCSWeeklySavingsCollectionSheet';
    } else if (fValue.AllAccDdl == 214) {
      this.reportModel.ReportName = 'rptMCSHPSMonthlyCollectionSheet';
    } else if (fValue.AllAccDdl == 120) {
      var fValue = this.BlankCollectionForm.value;
      if (fValue.CustomerServiceRb == 1) {
        this.reportModel.Values.push(new ReportKeyValue('rbValue', '1'));
      } else {
        this.reportModel.Values.push(new ReportKeyValue('rbValue', '0'));
      }
      this.reportModel.ReportName = 'rptMCSDailySavingsCollectionSheet';
      this.reportModel.Values.push(
        new ReportKeyValue('CommonName1', 'Daily Savings')
      );
    } else if (fValue.AllAccDdl == 751) {
      this.reportModel.ReportName = 'rptDailyLoanCollectionSheet';
    } else if (
      fValue.AllAccDdl == 757 ||
      fValue.AllAccDdl == 758 ||
      fValue.AllAccDdl == 759
    ) {
      this.reportModel.ReportName = 'rptWeeklyLoanCollectionSheet';
    }

    this.reportModel.Values.push(
      new ReportKeyValue('AccValue', fValue.AllAccDdl),
      new ReportKeyValue('GroupValue', fValue.GroupDdl)
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
