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
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';

@Component({
  selector: 'app-account-transfer-report',
  templateUrl: './account-transfer-report.component.html',
  styleUrls: ['./account-transfer-report.component.css'],
})
export class AccountTransferReportComponent implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  storefDate: any;
  storetDate: any;

  chbIsAllAccTypeStatus: any;
  IsAccTypeDisabled: any;

  AccountTransferListForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    this.reportModel.ReportName = 'rptMCsAccountTransferList';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.MemberDetailsList = null;
    this.chbIsAllAccTypeStatus = true;
    this.IsAccTypeDisabled = true;

    this.AccountTransferListForm = new FormGroup({
      IsAllAccType: new FormControl('true'),
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),

      //AccStatus: new FormControl('1'),
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
        this.AccountTransferListForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.AccountTransferListForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
        this.spinner.hide();
      });
  }

  // eneter key event
  onEnterAccTypeCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IssueFromDate`).focus();
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.AccountTransferListForm.controls['AccTypeCode']
      .value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.AccountTransferListForm.patchValue({
        AccType: this.getSelectedItemIDAccType(
          AccTypeCodeId,
          this.inputHelpData.accTransferAccountTypeList
        ),
      });
    }
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
      this.AccountTransferListForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
  }
  onChangeAccType(event: any) {
    let AccTypeId = this.AccountTransferListForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.AccountTransferListForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
  }
  checkIsAllAccTypeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllAccTypeStatus = true;
      this.IsAccTypeDisabled = true;
      this.AccountTransferListForm.controls['AccType'].setValue('0');
      this.AccountTransferListForm.controls['AccTypeCode'].setValue('');
    } else {
      this.chbIsAllAccTypeStatus = false;
      this.AccountTransferListForm.get('AccType').enable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.AccountTransferListForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );
    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));
    //start AccType
    if (this.chbIsAllAccTypeStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('AccTypeDesc', 'All AccType')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'AccTypeDesc',
          this.getSelectedItemText(
            fValue.AccType,
            this.inputHelpData.accTransferAccountTypeList
          )
        )
      );
    }
    // end AccType
  }

  public getReportToken = (type: any) => {
    // let AccType = this.AccountTransferListForm.controls['AccType'].value;
    // console.log(AccType);
    // if (AccType == 0) {
    //   this.toastr.error('Please Select Account Type!', 'Error');
    // } else {
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
    // }
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

  // Date change event
  applicationDateChange() {
    var fv = this.AccountTransferListForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.AccountTransferListForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.AccountTransferListForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.AccountTransferListForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.AccountTransferListForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.AccountTransferListForm.value);
    console.log(this.storetDate);
  }
}
