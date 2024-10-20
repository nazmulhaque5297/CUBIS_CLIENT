import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { UserInfo } from 'src/app/Models/Common.model';
import {
  AccClassDetails,
  LoanReceivedReportInputHelp,
} from 'src/app/Models/loanreceived-report.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { LedgerBalanceReportReportService } from 'src/app/services/ledger-balance-report.service';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import { LedgerBalanceReportPageLoadModel } from '../../../models/ledger-balance-report.model';

@Component({
  selector: 'app-ledger-balance-report-by-ctrl',
  templateUrl: './ledger-balance-report-by-ctrl.component.html',
  styleUrls: ['./ledger-balance-report-by-ctrl.component.css'],
})
export class LedgerBalanceReportByCtrlComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: LedgerBalanceReportPageLoadModel = new LedgerBalanceReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  chbForGroupDisable: boolean = true;
  ReportDDLValue: any;
  ReportDDLName: any;
  LedgerBalanceReportForm: FormGroup;
  storeFDate: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private ledgerBalanceReportReportService: LedgerBalanceReportReportService
  ) {
    this.reportModel.ReportName = 'rptMCSProductLedgerBalanceReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.LedgerBalanceReportForm = new FormGroup({
      GroupChb: new FormControl('0'),
      AllReportHeadDdl: new FormControl('0'),
      AllGroupDdl: new FormControl('0'),
      AllCollectorCodeInput: new FormControl(''),
      AllGroupCodeInput: new FormControl(''),
      IssueFromDate: new FormControl(''),
      ReportHeadInput: new FormControl(''),
    });

    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.ledgerBalanceReportReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        console.log('Data:', data);
        this.pageLoadModel = data;
        this.LedgerBalanceReportForm.controls['IssueFromDate'].setValue(
          this.pageLoadModel.FromDate
        );
        this.storeFDate = this.pageLoadModel.FromDate;
      });

    this.LedgerBalanceReportForm.get('AllGroupDdl').disable();
  }

  public ReportDdlChange() {
    let selectedCode = this.pageLoadModel.AllReportHeadDropdown.find(
      (x) => x.Id == this.LedgerBalanceReportForm.value.AllReportHeadDdl
    );
    this.ReportDDLValue = this.LedgerBalanceReportForm.controls[
      'AllReportHeadDdl'
    ].value;
    this.ReportDDLName = selectedCode.Description;
    console.log('ReportDDL:', this.ReportDDLValue);
    console.log('ReportDDLName:', this.ReportDDLName);
  }

  public GroupDdlChange() {
    console.log(this.LedgerBalanceReportForm.value.AllAccDdl);
    this.LedgerBalanceReportForm.controls['AllGroupCodeInput'].setValue(
      this.LedgerBalanceReportForm.value.AllGroupDdl
    );
  }
  public GroupCodeChange() {
    this.LedgerBalanceReportForm.controls['AllGroupDdl'].setValue(
      this.LedgerBalanceReportForm.value.AllGroupCodeInput
    );
  }

  public ChbForGroupCode() {
    if (this.chbForGroupDisable == true) {
      this.chbForGroupDisable = false;
      this.LedgerBalanceReportForm.get('AllGroupDdl').enable();
    } else {
      this.chbForGroupDisable = true;
      this.LedgerBalanceReportForm.get('AllGroupDdl').disable();
      this.LedgerBalanceReportForm.controls['AllGroupCodeInput'].setValue('');
      this.LedgerBalanceReportForm.controls['AllGroupDdl'].setValue('0');
    }
  }

  public getReportToken = (type: any) => {
    console.log('FinalCheck', this.ReportDDLValue);
    if (this.ReportDDLValue == null) {
      this.toastr.warning('Plase Select Report Head!');
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
    var fValue = this.LedgerBalanceReportForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(new ReportKeyValue('fDate', this.storeFDate));
    this.reportModel.Values.push(
      new ReportKeyValue('reportHeadValue', this.ReportDDLValue)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('reportDDlName', this.ReportDDLName)
    );
    if (fValue.AllGroupCodeInput == '') {
      this.reportModel.Values.push(new ReportKeyValue('textGroupCode', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('textGroupCode', fValue.AllGroupCodeInput)
      );
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

  // Date change event
  applicationDateChange() {
    var fv = this.LedgerBalanceReportForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LedgerBalanceReportForm.value.IssueFromDate = formatedValue;
    this.storeFDate = formatedValue;
    console.log(this.LedgerBalanceReportForm.value);
    console.log(this.storeFDate);
  }
}
