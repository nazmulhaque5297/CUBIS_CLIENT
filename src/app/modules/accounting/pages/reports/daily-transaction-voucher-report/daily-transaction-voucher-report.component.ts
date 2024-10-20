import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { UserInfo } from 'src/app/Models/Common.model';
import { JournalReportInputHelp } from 'src/app/Models/journal-report.model';
import {
  AccClassDetails,
  LoanReceivedReportInputHelp,
} from 'src/app/Models/loanreceived-report.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { DailyGLTransactionVchReportService } from 'src/app/services/daily-gl-transaction-vch-report.service';
import { JournalReportService } from 'src/app/services/journal-report.service';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import {
  DailyGLTransactionVchReportPageLoadModel,
  DailyGLTransactionVchReportVchInfoModel,
} from '../../../models/daily-gl-transaction-vch-report.model';

@Component({
  selector: 'app-daily-transaction-voucher-report',
  templateUrl: './daily-transaction-voucher-report.component.html',
  styleUrls: ['./daily-transaction-voucher-report.component.css'],
})
export class DailyTransactionVoucherReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  public;
  public inputHelpData2: JournalReportInputHelp = new JournalReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  storeProcessDate: any;
  voucherNo: any;
  VchNo: any;

  GLTransactionVchForm: FormGroup;

  GetInputHelpData: DailyGLTransactionVchReportPageLoadModel = new DailyGLTransactionVchReportPageLoadModel();
  VchInfo: DailyGLTransactionVchReportVchInfoModel = new DailyGLTransactionVchReportVchInfoModel();
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private journalReportService: JournalReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService,
    private dailyGLTransactionVchReportService: DailyGLTransactionVchReportService
  ) {
    this.reportModel.ReportName = 'CCULB_rptGLTransactionVch';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelpData();
  }
  private initializeForm() {
    this.GLTransactionVchForm = new FormGroup({
      IsOldMem: new FormControl(false),

      ProcessDate: new FormControl(' '),
      VoucherNo: new FormControl(''),
    });
  }
  public getInputHelpData() {
    this.dailyGLTransactionVchReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        console.log('GetInputHelpData:', data);
        this.GetInputHelpData = data;
        this.GLTransactionVchForm.controls['ProcessDate'].setValue(
          this.GetInputHelpData.ProcessDate
        );
      });
  }

  // enter key event
  onEnterProcessDateHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`VoucherNo`).focus();
  }

  // Date change event
  public ProcessDateDateChange() {
    var fv = this.GLTransactionVchForm.value;
    var value = this.datepipe.transform(fv.ProcessDate, 'dd-MM-yyyy');
    console.log('Value:', value);
    var formatedValue = this.aService.convertDateToString(value);
    this.GLTransactionVchForm.value.ProcessDate = formatedValue;
    this.storeProcessDate = formatedValue;
    console.log('FormatChange:', this.storeProcessDate);
  }

  public onChangeVchNo(event: any) {
    var processDate = this.GetInputHelpData.ProcessDate;
    console.log('ProcessDate:', processDate);
    let changesDate = this.storeProcessDate;
    if (changesDate == null) {
      changesDate = processDate;
    }

    this.VchNo = this.GLTransactionVchForm.controls['VoucherNo'].value;
    console.log('VoucherNo::', this.VchNo);

    this.dailyGLTransactionVchReportService
      .GetVchData(processDate, changesDate, this.VchNo)
      .pipe(first())
      .subscribe((data: any) => {
        this.VchInfo = data;
        console.log('Voucher:', this.VchInfo.Success);
        console.log('VoucherDetails:', this.VchInfo);
        if (this.VchInfo.Success == false) {
          this.toastr.warning('Voucher Is Not Available In this Date!');
          return;
        }
      });
  }

  private setParameter(): void {
    var fValue = this.GLTransactionVchForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('ProcessDate', fValue.ProcessDate)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('FromDate', this.VchInfo.FromDate)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('ToDate', this.VchInfo.ToDate)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('VoucherNo', fValue.VoucherNo)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('VchFlag', this.VchInfo.VchFlag)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('VchYear', this.VchInfo.VchYear)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('boothNo', this.VchInfo.BoothNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('boothName', this.VchInfo.BoothName)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('trnType', this.VchInfo.TrnTypeTitle)
    );
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
