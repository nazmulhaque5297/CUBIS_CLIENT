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
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';

@Component({
  selector: 'app-loan-time-allotment-report',
  templateUrl: './loan-time-allotment-report.component.html',
  styleUrls: ['./loan-time-allotment-report.component.css'],
})
export class LoanTimeAllotmentReportComponent implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  storeFvalue: any;
  storeTvalue: any;

  chbIsAllMemberStatus: any;

  LoanTimeAllotmentForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    this.reportModel.ReportName = 'rptMCsTimeAllotmentReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    this.chbIsAllMemberStatus = true;
    this.LoanTimeAllotmentForm = new FormGroup({
      //IsAllAccType: new FormControl('true'),

      IsOldMem: new FormControl(false),
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),

      IsAllMember: new FormControl('true'),
      MemNo: new FormControl(''),
      MemName: new FormControl(''),
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
        this.LoanTimeAllotmentForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.LoanTimeAllotmentForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.storeFvalue = data.ApplicationDate;
        this.storeTvalue = data.ApplicationDate;
        this.spinner.hide();
      });
  }

  checkIsAllMemberValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllMemberStatus = true;
      this.MemberDetailsList = null;
      this.LoanTimeAllotmentForm.controls['MemNo'].setValue('');
      this.LoanTimeAllotmentForm.controls['MemName'].setValue('');
    } else {
      this.chbIsAllMemberStatus = false;
    }
  }

  onChangeMemNo(event: any) {
    let IsOldCheck = this.LoanTimeAllotmentForm.controls['IsOldMem'].value;
    console.log(IsOldCheck);
    let MemNoId = this.LoanTimeAllotmentForm.controls['MemNo'].value;
    console.log(MemNoId);
    if (MemNoId) {
      this.spinner.show();
      this.loanInfoReportService
        .GetMemberDetails(IsOldCheck, MemNoId)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.MemberDetailsList = x;
            // invalid memberno
            if (this.MemberDetailsList.MemberNo == 0) {
              alert('Invalid Member No!');
            }
            if (this.MemberDetailsList.MemberName) {
              this.LoanTimeAllotmentForm.patchValue({
                //MemNo: this.MemberDetailsList.MemberNo,
                MemName: this.MemberDetailsList.MemberName,
              });
            }
            console.log(this.MemberDetailsList);
            console.log(this.MemberDetailsList.MemberName);
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.MemberDetailsList = null;
    }
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.LoanTimeAllotmentForm.controls['AccTypeCode']
      .value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.LoanTimeAllotmentForm.patchValue({
        AccType: this.getSelectedItemIDAccType(
          AccTypeCodeId,
          this.inputHelpData.AccountTypeList
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
      this.LoanTimeAllotmentForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
  }
  onChangeAccType(event: any) {
    let AccTypeId = this.LoanTimeAllotmentForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.LoanTimeAllotmentForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.LoanTimeAllotmentForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));
    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storeFvalue)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storeTvalue)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('MemberName', fValue.MemName)
    );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccTypeDesc',
        this.getSelectedItemText(
          fValue.AccType,
          this.inputHelpData.AccountTypeList
        )
      )
    );

    if (fValue.MemNo == '') {
      this.reportModel.Values.push(new ReportKeyValue('MemNo', '0'));
    } else {
      this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));
    }

    //start Member
    if (this.chbIsAllMemberStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('MemberDesc', 'All Member')
      );
    } else {
      var mName = this.MemberDetailsList.MemberName;
      this.reportModel.Values.push(new ReportKeyValue('MemberDesc', mName));
    }
    // end Member
  }

  public getReportToken = (type: any) => {
    let AccType = this.LoanTimeAllotmentForm.controls['AccType'].value;
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

  // Date change event
  applicationDateChange() {
    var fv = this.LoanTimeAllotmentForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanTimeAllotmentForm.value.IssueFromDate = formatedValue;
    this.storeFvalue = formatedValue;
    console.log(this.LoanTimeAllotmentForm.value);
    console.log(this.storeFvalue);
  }
  applicationDateChange2() {
    var fv = this.LoanTimeAllotmentForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanTimeAllotmentForm.value.IssueToDate = formatedValue;
    this.storeTvalue = formatedValue;
    console.log(this.LoanTimeAllotmentForm.value);
    console.log(this.storeTvalue);
  }
}
