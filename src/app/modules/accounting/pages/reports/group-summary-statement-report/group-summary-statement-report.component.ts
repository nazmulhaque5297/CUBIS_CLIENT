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
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-group-summary-statement-report',
  templateUrl: './group-summary-statement-report.component.html',
  styleUrls: ['./group-summary-statement-report.component.css'],
})
export class GroupSummaryStatementReportComponent implements OnInit, OnDestroy {
  module: string = '1';
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  showOldAc: boolean = false;

  accTypeData: IdDescription[] = [];

  GroupSummaryStatementForm: FormGroup;
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.reportModel.ReportName = 'GroupSummaryStatement';
    this.reportModel.ReportName = 'rptGroupSummaryStatement';

    this.reportModel.Values = [];
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

  ngOnInit(): void {
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    this.GroupSummaryStatementForm = new FormGroup({
      IsOldMem: new FormControl(false),
      OldAcNo: new FormControl(''),
      //IssueFromDate: new FormControl(''),
      // IssueToDate: new FormControl(''),
      MemNo: new FormControl(''),
      MemName: new FormControl(''),
      AccStatus: new FormControl('1'),
      AccType: new FormControl('0'),
      AccTypeCode: new FormControl('0'),
      // IsActiveAcc: new FormControl(true),
      // rbAccount: new FormControl('1'),
    });
  }

  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('Dataaaaqa====>', data);
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        if (this.inputHelpData.ctrlOldAccNo == '1') {
          this.showOldAc = true;
        }
        this.accTypeData = data.AccTypeData;
        this.spinner.hide();
      });
  }

  onEnterOldAcNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemNo`).focus();
  }

  onEnterAccTypeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`OldAcNo`).focus();
  }

  onAccTypeChange(event: any) {
    let selectedItem = this.accTypeData.find((x) => x.Id == event.target.value);

    if (!selectedItem) {
      alert('Invalid Account Type');
      this.GroupSummaryStatementForm.controls['AccType'].setValue('0');
      document.getElementById(`AccType`).focus();
      return;
    } else {
      console.log('Selectedd===>', selectedItem);
      this.GroupSummaryStatementForm.controls['AccTypeCode'].setValue(
        selectedItem.Id
      );
      document.getElementById(`OldAcNo`).focus();
    }
  }

  onChangeOldAcNo(event: any) {
    let IsOldCheck = true;
    console.log(IsOldCheck);
    let MemNoId = this.GroupSummaryStatementForm.controls['OldAcNo'].value;
    let AccType = this.GroupSummaryStatementForm.controls['AccType'].value;
    console.log(MemNoId);
    if (MemNoId && AccType) {
      this.spinner.show();
      this.loanInfoReportService
        .GetMemberDetailsByOld(AccType, MemNoId)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            if (x.data != -1) {
              this.GroupSummaryStatementForm.controls['MemNo'].setValue(x.data);
              this.onChangeMemNoByOld();
            }
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.MemberDetailsList = null;
    }
  }

  onChangeMemNo(event: any) {
    let IsOldCheck = this.GroupSummaryStatementForm.controls['IsOldMem'].value;
    console.log(IsOldCheck);
    let MemNoId = this.GroupSummaryStatementForm.controls['MemNo'].value;
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
              this.GroupSummaryStatementForm.controls['MemNo'].setValue(' ');
            }
            if (this.MemberDetailsList.MemberName) {
              this.GroupSummaryStatementForm.patchValue({
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

  onChangeMemNoByOld() {
    let IsOldCheck = this.GroupSummaryStatementForm.controls['IsOldMem'].value;
    console.log(IsOldCheck);
    let MemNoId = this.GroupSummaryStatementForm.controls['MemNo'].value;
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
              this.GroupSummaryStatementForm.patchValue({
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.GroupSummaryStatementForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));
    var mName = this.MemberDetailsList.MemberName;
    this.reportModel.Values.push(new ReportKeyValue('MemberDesc', mName));
    this.reportModel.Values.push(
      new ReportKeyValue('AccStatus', fValue.AccStatus)
    );
  }

  public getReportToken = (type: any) => {
    let memNo = this.GroupSummaryStatementForm.controls['MemNo'].value;
    console.log(memNo);
    if (memNo == '') {
      alert('Please Input Member No!');
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
