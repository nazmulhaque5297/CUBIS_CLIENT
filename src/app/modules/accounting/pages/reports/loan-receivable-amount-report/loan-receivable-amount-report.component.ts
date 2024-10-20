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
  selector: 'app-loan-receivable-amount-report',
  templateUrl: './loan-receivable-amount-report.component.html',
  styleUrls: ['./loan-receivable-amount-report.component.css'],
})
export class LoanReceivableAmountReportComponent implements OnInit, OnDestroy {
  module: string = '1';
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  chbIsAllCollectorStatus: any;
  chbIsAllGroupStatus: any;

  IsCollectorDisabled: any;
  IsGroupDisabled: any;

  LoanReceivedForm: FormGroup;

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
    //this.reportModel.ReportName = 'LoanReceived';
    this.reportModel.ReportName = 'rptLoanReceivableList';
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

    this.LoanReceivedForm = new FormGroup({
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
      IsAllCollector: new FormControl('true'),
      CollectorCode: new FormControl(''),
      Collector: new FormControl('0'),
      IsAllGroup: new FormControl('true'),
      GroupCode: new FormControl(''),
      Group: new FormControl('0'),
      rbDue: new FormControl('1'),
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
        this.spinner.hide();
      });
  }
  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.LoanReceivedForm.controls['Collector'].setValue('0');
      this.LoanReceivedForm.controls['CollectorCode'].setValue('');
    } else {
      this.chbIsAllCollectorStatus = false;
      this.LoanReceivedForm.get('Collector').enable();
    }
  }
  checkIsAllGroupValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGroupStatus = true;
      this.IsGroupDisabled = true;
      this.LoanReceivedForm.controls['Group'].setValue('0');
      this.LoanReceivedForm.controls['GroupCode'].setValue('');
    } else {
      this.chbIsAllGroupStatus = false;
      this.LoanReceivedForm.get('Group').enable();
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
      this.LoanReceivedForm.patchValue({
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
      this.LoanReceivedForm.patchValue({
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
      this.LoanReceivedForm.patchValue({
        Group: 0,
        GroupCode: '',
      });
    }
    return selected.Id;
  }
  onChangeGroupCode(event: any) {
    let GroupCodeId = this.LoanReceivedForm.controls['GroupCode'].value;
    console.log(GroupCodeId);
    if (GroupCodeId) {
      this.LoanReceivedForm.patchValue({
        Group: this.getSelectedItemIDGroup(
          GroupCodeId,
          this.inputHelpData.GroupList
        ),
      });
    }
  }
  onChangeCollectorCode(event: any) {
    let CollectorCodeId = this.LoanReceivedForm.controls['CollectorCode'].value;
    console.log(CollectorCodeId);
    if (CollectorCodeId) {
      this.LoanReceivedForm.patchValue({
        Collector: this.getSelectedItemIDCollector(
          CollectorCodeId,
          this.inputHelpData.CollectorList
        ),
      });
    }
  }
  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.LoanReceivedForm.controls['AccTypeCode'].value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.LoanReceivedForm.patchValue({
        AccType: this.getSelectedItemIDAccType(
          AccTypeCodeId,
          this.inputHelpData.AccountTypeList
        ),
      });
    }
  }
  onChangeAccType(event: any) {
    let AccTypeId = this.LoanReceivedForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.LoanReceivedForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
  }
  onChangeCollector(event: any) {
    let CollectorId = this.LoanReceivedForm.controls['Collector'].value;
    console.log(CollectorId);
    if (CollectorId) {
      this.LoanReceivedForm.patchValue({
        CollectorCode: CollectorId,
      });
    }
  }
  onChangeGroup(event: any) {
    let GroupId = this.LoanReceivedForm.controls['Group'].value;
    console.log(GroupId);
    if (GroupId) {
      this.LoanReceivedForm.patchValue({
        GroupCode: GroupId,
      });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.LoanReceivedForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));

    this.reportModel.Values.push(
      new ReportKeyValue('Collector', fValue.Collector)
    );

    this.reportModel.Values.push(new ReportKeyValue('Group', fValue.Group));

    this.reportModel.Values.push(new ReportKeyValue('rbDue', fValue.rbDue));

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
  }

  public getReportToken = (type: any) => {
    let AccType = this.LoanReceivedForm.controls['AccType'].value;
    console.log(AccType);
    if (AccType == 0) {
      alert('Please Select Account Type!');
    } else {
      this.setParameter();
      this.spinner.show();
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
}
