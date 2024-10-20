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
import {
  CashCollectionAccPageLoadModel,
  CashCollectionMemberNoChngModel,
} from '../../../models/cash-collection-report-by-acc.model';
import { Router } from '@angular/router';
import { AccountOpenCloseReportService } from 'src/app/services/account-open-close-report.service';
import { AccountOpenCloseReportPageLoadModel } from '../../../models/account-open-close-report.model';
import { GeneralLedgerReportService } from 'src/app/services/general-ledger-report.service';
import { GeneralLedgerReportPageLoadModel } from '../../../models/general-ledger-report.model';
import { MutualAidServiceReportService } from 'src/app/services/mutual-aid-service-report.service';
import { MutualAidServiceReportPageLoadModel } from '../../../models/mutual-aid-service-report.model';
import { isBuffer } from 'util';
import { IdDescription } from 'src/app/interfaces/id-description';

@Component({
  selector: 'app-loan-disb-recovery-analysis-report',
  templateUrl: './loan-disb-recovery-analysis-report.component.html',
  styleUrls: ['./loan-disb-recovery-analysis-report.component.css'],
})
export class LoanDisbRecoveryAnalysisReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: MutualAidServiceReportPageLoadModel = new MutualAidServiceReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  LoanAccShow: boolean = false;
  LoanAccShow2: boolean = true;
  chbForCollectorDisable: boolean = true;
  chbForGroupDisable: boolean = true;
  chbForGenderDisable: boolean = true;
  LoanDisbRecoveryAnalysisForm: FormGroup;

  chbIsAllCollectorStatus: any;
  IsCollectorDisabled: any;
  storefDate: any;
  storef1Date: any;
  storetDate: any;

  selectedItem: any[] = [];

  selectedAccTypes: string = '';

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private mutualAidServiceReportService: MutualAidServiceReportService
  ) {
    this.reportModel.ReportName = 'CCULB_rptLoanRecoveredByCollectorWise2';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.chbIsAllCollectorStatus = true;
    this.IsCollectorDisabled = true;
    this.LoanDisbRecoveryAnalysisForm = new FormGroup({
      IssueFromDate: new FormControl(''),
      IssueFromDate1: new FormControl(''),
      IssueToDate1: new FormControl(''),
      AccountServiceRb: new FormControl('0'),
      IsAllCollector: new FormControl('true'),
      CollectorCode: new FormControl(''),
      Collector: new FormControl('0'),
    });

    this.getInputHelpData();
    this.getInputHelpData2();
  }
  public getInputHelpData() {
    this.mutualAidServiceReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
        // this.LoanDisbRecoveryAnalysisForm.controls['IssueFromDate'].setValue(
        //   this.pageLoadModel.FromDate
        // );
        // this.LoanDisbRecoveryAnalysisForm.controls['IssueFromDate1'].setValue(
        //   this.pageLoadModel.FromDate
        // );
        // this.LoanDisbRecoveryAnalysisForm.controls['IssueToDate1'].setValue(
        //   this.pageLoadModel.FromDate
        // );
        // this.storef1Date = this.pageLoadModel.FromDate;
        // this.storefDate = this.pageLoadModel.FromDate;
        // this.storetDate = this.pageLoadModel.FromDate;
      });
  }
  private getInputHelpData2(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        this.LoanDisbRecoveryAnalysisForm.controls['IssueFromDate'].setValue(
          this.inputHelpData.ApplicationDate
        );
        this.LoanDisbRecoveryAnalysisForm.controls['IssueFromDate1'].setValue(
          this.inputHelpData.ApplicationDate
        );
        this.LoanDisbRecoveryAnalysisForm.controls['IssueToDate1'].setValue(
          this.inputHelpData.ApplicationDate
        );
        this.storef1Date = this.inputHelpData.ApplicationDate;
        this.storefDate = this.inputHelpData.ApplicationDate;
        this.storetDate = this.inputHelpData.ApplicationDate;
        console.log(this.inputHelpData);

        this.spinner.hide();
      });
  }

  LoanRbSelect() {
    this.LoanAccShow = true;
    this.LoanAccShow2 = false;
    this.LoanDisbRecoveryAnalysisForm.controls['IssueFromDate1'].setValue(
      this.inputHelpData.ApplicationDate
    );
    this.LoanDisbRecoveryAnalysisForm.controls['IssueToDate1'].setValue(
      this.inputHelpData.ApplicationDate
    );
    this.storef1Date = this.inputHelpData.ApplicationDate;
    this.storetDate = this.inputHelpData.ApplicationDate;
  }
  AccRbSelect() {
    this.LoanAccShow = false;
    this.LoanAccShow2 = true;
  }

  public getReportToken = (type: any) => {
    if (this.selectedItem.length < 1) {
      alert('No A/c Type Selected!');
      return;
    } else if (this.selectedItem.length > 5) {
      alert('You Cannot Select More than 5 AccType!!!');
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
    var fValue = this.LoanDisbRecoveryAnalysisForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('rbLoanRecovery', fValue.AccountServiceRb)
    );

    //start Collector
    this.reportModel.Values.push(
      new ReportKeyValue('Collector', fValue.Collector)
    );
    if (this.chbIsAllCollectorStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorDesc', 'All Collector')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'CollectorDesc',
          this.getSelectedItemText(
            fValue.Collector,
            this.inputHelpData.CollectorList
          )
        )
      );
    }
    //end Collector

    // start date push
    if (fValue.AccountServiceRb == '0') {
      this.reportModel.Values.push(
        new ReportKeyValue('AsOnDate', this.storefDate)
      );
    } else {
      this.reportModel.Values.push(new ReportKeyValue('AsOnDate', ''));
    }

    if (fValue.AccountServiceRb == '1') {
      this.reportModel.Values.push(
        new ReportKeyValue('fDate', this.storef1Date)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('tDate', this.storetDate)
      );
    } else {
      this.reportModel.Values.push(new ReportKeyValue('fDate', ''));
      this.reportModel.Values.push(new ReportKeyValue('tDate', ''));
    }

    // for (let i = 0; i < this.selectedItem.length; i++) {
    //   this.selectedAccTypes = this.selectedAccTypes.concat(
    //     this.selectedItem[i].Id.toString(),
    //     ','
    //   );
    // }
    // this.reportModel.Values.push(
    //   new ReportKeyValue('selectedData', this.selectedAccTypes)
    // );

    // end date push

    this.reportModel.Values.push(
      new ReportKeyValue(
        'selectedDataCount',
        this.selectedItem.length.toString()
      )
    );

    for (let i = 0; i < this.selectedItem.length; i++) {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'selectedAccType' + i.toString(),
          this.selectedItem[i].Id.toString()
        )
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'selectedAccTypeDesc' + i.toString(),
          this.selectedItem[i].Description.toString()
        )
      );
    }

    // report name logic start
    if (this.selectedItem.length == 1) {
      this.reportModel.ReportName = 'CCULB_rptLoanRecoveredByCollectorWise1';
    } else if (this.selectedItem.length == 2) {
      this.reportModel.ReportName = 'CCULB_rptLoanRecoveredByCollectorWise2';
    } else if (this.selectedItem.length == 3) {
      this.reportModel.ReportName = 'CCULB_rptLoanRecoveredByCollectorWise3';
    } else if (this.selectedItem.length == 4) {
      this.reportModel.ReportName = 'CCULB_rptLoanRecoveredByCollectorWise4';
    } else {
      this.reportModel.ReportName = 'CCULB_rptLoanRecoveredByCollectorWise5';
    }
    if (fValue.AccountServiceRb == '1') {
      this.reportModel.ReportName =
        'CCULB_rptWeeklylLoanDisburseAndRecoveredByCollector';
    }
    // report name logic end

    console.log(this.reportModel.Values);
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
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

  // events Collector
  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.LoanDisbRecoveryAnalysisForm.controls['Collector'].setValue('0');
      this.LoanDisbRecoveryAnalysisForm.controls['CollectorCode'].setValue('');
    } else {
      this.chbIsAllCollectorStatus = false;
      this.LoanDisbRecoveryAnalysisForm.get('Collector').enable();
    }
  }

  onChangeCollectorCode(event: any) {
    let CollectorCodeId = this.LoanDisbRecoveryAnalysisForm.controls[
      'CollectorCode'
    ].value;
    console.log(CollectorCodeId);
    if (CollectorCodeId) {
      this.LoanDisbRecoveryAnalysisForm.patchValue({
        Collector: this.getSelectedItemIDCollector(
          CollectorCodeId,
          this.inputHelpData.CollectorList
        ),
      });
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
      this.LoanDisbRecoveryAnalysisForm.patchValue({
        Collector: 0,
        CollectorCode: '',
      });
    }
    return selected.Id;
  }

  onChangeCollector(event: any) {
    let CollectorId = this.LoanDisbRecoveryAnalysisForm.controls['Collector']
      .value;
    console.log(CollectorId);
    if (CollectorId) {
      this.LoanDisbRecoveryAnalysisForm.patchValue({
        CollectorCode: CollectorId,
      });
    }
  }

  selectedItemList(data: any) {
    let check = this.selectedItem.find((x) => x == data);
    if (!check) {
      this.selectedItem.push(data);
      console.log('This is selected data', this.selectedItem);
    } else {
      let index = this.selectedItem.indexOf(data);
      let temp = [];
      var i = 0;
      while (i < this.selectedItem.length) {
        if (i != index) {
          temp.push(this.selectedItem[i]);
        }
        i++;
      }
      this.selectedItem = temp;
      console.log(this.selectedItem);
    }
  }

  asGoOnDateChange() {
    var fv = this.LoanDisbRecoveryAnalysisForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanDisbRecoveryAnalysisForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.LoanDisbRecoveryAnalysisForm.value);
    console.log(this.storefDate);
  }

  applicationDateChange() {
    var fv = this.LoanDisbRecoveryAnalysisForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate1, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanDisbRecoveryAnalysisForm.value.IssueFromDate1 = formatedValue;
    this.storef1Date = formatedValue;
    console.log(this.LoanDisbRecoveryAnalysisForm.value);
    console.log(this.storef1Date);
  }
  applicationDateChange2() {
    var fv = this.LoanDisbRecoveryAnalysisForm.value;
    var value = this.datepipe.transform(fv.IssueToDate1, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanDisbRecoveryAnalysisForm.value.IssueToDate1 = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.LoanDisbRecoveryAnalysisForm.value);
    console.log(this.storetDate);
  }
}
