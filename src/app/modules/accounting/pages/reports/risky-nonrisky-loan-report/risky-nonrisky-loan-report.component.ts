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

@Component({
  selector: 'app-risky-nonrisky-loan-report',
  templateUrl: './risky-nonrisky-loan-report.component.html',
  styleUrls: ['./risky-nonrisky-loan-report.component.css'],
})
export class RiskyNonriskyLoanReportComponent implements OnInit, OnDestroy {
  module: string = '1';
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  chbIsAllCollectorStatus: any;
  chbIsAllGroupStatus: any;

  IsCollectorDisabled: any;
  IsGroupDisabled: any;
  storefDate: any;
  storetDate: any;

  RiskyAndNonRiskyLoanForm: FormGroup;

  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe
  ) {
    //  this.reportModel.ReportName = 'RiskyAndNonRiskyLoan';
    this.reportModel.ReportName = 'rptMCSRiskyLoanReport';

    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }
  private initializeForm() {
    this.chbIsAllCollectorStatus = true;
    this.chbIsAllGroupStatus = true;

    this.IsCollectorDisabled = true;
    this.IsGroupDisabled = true;

    this.RiskyAndNonRiskyLoanForm = new FormGroup({
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
      IsAllCollector: new FormControl('true'),
      CollectorCode: new FormControl(''),
      Collector: new FormControl('0'),
      IsAllGroup: new FormControl('true'),
      GroupCode: new FormControl(''),
      Group: new FormControl('0'),
      rbWRisky: new FormControl('0'),
      rbtnExpiryDate: new FormControl('0'),

      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
    });
  }
  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.RiskyAndNonRiskyLoanForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.RiskyAndNonRiskyLoanForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
        this.spinner.hide();
      });
  }
  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.RiskyAndNonRiskyLoanForm.controls['Collector'].setValue('0');
      this.RiskyAndNonRiskyLoanForm.controls['CollectorCode'].setValue('');
    } else {
      this.chbIsAllCollectorStatus = false;
      this.RiskyAndNonRiskyLoanForm.get('Collector').enable();
    }
  }
  checkIsAllGroupValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGroupStatus = true;
      this.IsGroupDisabled = true;
      this.RiskyAndNonRiskyLoanForm.controls['Group'].setValue('0');
      this.RiskyAndNonRiskyLoanForm.controls['GroupCode'].setValue('');
    } else {
      this.chbIsAllGroupStatus = false;
      this.RiskyAndNonRiskyLoanForm.get('Group').enable();
    }
  }
  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }
  public getSelectedItemIDAccType(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Account Type!');
      this.RiskyAndNonRiskyLoanForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
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
      this.RiskyAndNonRiskyLoanForm.patchValue({
        Collector: 0,
        CollectorCode: '',
      });
    }
    return selected.Id;
  }
  public getSelectedItemIDGroup(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Group !');
      this.RiskyAndNonRiskyLoanForm.patchValue({
        Group: 0,
        GroupCode: '',
      });
    }
    return selected.Id;
  }
  onChangeGroupCode(event: any) {
    let GroupCodeId = this.RiskyAndNonRiskyLoanForm.controls['GroupCode'].value;
    console.log(GroupCodeId);
    if (GroupCodeId) {
      this.RiskyAndNonRiskyLoanForm.patchValue({
        Group: this.getSelectedItemIDGroup(
          GroupCodeId,
          this.inputHelpData.GroupList
        ),
      });
    }
  }
  onChangeCollectorCode(event: any) {
    let CollectorCodeId = this.RiskyAndNonRiskyLoanForm.controls[
      'CollectorCode'
    ].value;
    console.log(CollectorCodeId);
    if (CollectorCodeId) {
      this.RiskyAndNonRiskyLoanForm.patchValue({
        Collector: this.getSelectedItemIDCollector(
          CollectorCodeId,
          this.inputHelpData.CollectorList
        ),
      });
    }
  }
  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.RiskyAndNonRiskyLoanForm.controls['AccTypeCode']
      .value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.RiskyAndNonRiskyLoanForm.patchValue({
        AccType: this.getSelectedItemIDAccType(
          AccTypeCodeId,
          this.inputHelpData.AccountTypeList
        ),
      });
    }
  }
  onChangeAccType(event: any) {
    let AccTypeId = this.RiskyAndNonRiskyLoanForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.RiskyAndNonRiskyLoanForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
  }
  onChangeCollector(event: any) {
    let CollectorId = this.RiskyAndNonRiskyLoanForm.controls['Collector'].value;
    console.log(CollectorId);
    if (CollectorId) {
      this.RiskyAndNonRiskyLoanForm.patchValue({
        CollectorCode: CollectorId,
      });
    }
  }
  onChangeGroup(event: any) {
    let GroupId = this.RiskyAndNonRiskyLoanForm.controls['Group'].value;
    console.log(GroupId);
    if (GroupId) {
      this.RiskyAndNonRiskyLoanForm.patchValue({
        GroupCode: GroupId,
      });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private setParameter(): void {
    var fValue = this.RiskyAndNonRiskyLoanForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));

    this.reportModel.Values.push(
      new ReportKeyValue('Collector', fValue.Collector)
    );

    this.reportModel.Values.push(new ReportKeyValue('Group', fValue.Group));

    this.reportModel.Values.push(
      new ReportKeyValue('rbWRisky', fValue.rbWRisky)
    );

    if (this.chbIsAllGroupStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('GroupDesc', 'All Group')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'GroupDesc',
          this.getSelectedItemText(fValue.Group, this.inputHelpData.GroupList)
        )
      );
    }
    //start
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
    //end
    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccTypeDesc',
        this.getSelectedItemText(
          fValue.AccType,
          this.inputHelpData.AccountTypeList
        )
      )
    );

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('rbtnExpiryDate', fValue.rbtnExpiryDate)
    );
  }

  public getReportToken = (type: any) => {
    let AccType = this.RiskyAndNonRiskyLoanForm.controls['AccType'].value;
    console.log(AccType);
    if (AccType == 0) {
      alert('Please Select Account Type!');
    } else {
      if (
        !this.chbIsAllCollectorStatus &&
        this.RiskyAndNonRiskyLoanForm.controls['CollectorCode'].value == ''
      ) {
        alert('Please Select Collector Code!');
        return;
      }
      if (
        !this.chbIsAllGroupStatus &&
        this.RiskyAndNonRiskyLoanForm.controls['GroupCode'].value == ''
      ) {
        alert('Please Select Group Name!');
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
    }
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

  applicationDateChange() {
    var fv = this.RiskyAndNonRiskyLoanForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.RiskyAndNonRiskyLoanForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.RiskyAndNonRiskyLoanForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.RiskyAndNonRiskyLoanForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.RiskyAndNonRiskyLoanForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.RiskyAndNonRiskyLoanForm.value);
    console.log(this.storetDate);
  }
}
