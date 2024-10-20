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
  selector: 'app-previous-transaction-transfer-report',
  templateUrl: './previous-transaction-transfer-report.component.html',
  styleUrls: ['./previous-transaction-transfer-report.component.css'],
})
export class PreviousTransactionTransferReportComponent
  implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  storefDate: any;
  storetDate: any;
  // chbIsAllMemberStatus: any;

  // chbIsAllAccTypeStatus: any;
  chbIsAllTellerStatus: any;
  // IsAccTypeDisabled: any;
  IsTellerDisabled: any;
  //chbShowZeroBalance: any;

  PrevTransTransferListForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    //this.reportModel.ReportName = 'PrevTransTransferList';
    this.reportModel.ReportName = 'rptCsPrevTransTrfReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    //  this.chbIsAllMemberStatus = true;
    // this.chbIsAllAccTypeStatus = true;
    this.chbIsAllTellerStatus = true;
    //this.IsAccTypeDisabled = true;
    this.IsTellerDisabled = true;
    // this.chbShowZeroBalance = false;

    this.PrevTransTransferListForm = new FormGroup({
      // IsAllAccType: new FormControl('true'),
      IsAllTeller: new FormControl('true'),

      //  IsOldMem: new FormControl(false),
      // AccTypeCode: new FormControl(''),
      TellerCode: new FormControl(''),
      //  AccType: new FormControl('0'),
      Teller: new FormControl('0'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),

      //  IsAllMember: new FormControl('true'),
      //  MemNo: new FormControl(''),
      // MemName: new FormControl(''),

      // ShowZeroBalance: new FormControl('False'),
      // IssueFromDate: new FormControl(''),
      // IssueToDate: new FormControl(''),

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
        this.PrevTransTransferListForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.PrevTransTransferListForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
        this.spinner.hide();
      });
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  onChangeTellerCode(event: any) {
    let TellerCodeId = this.PrevTransTransferListForm.controls['TellerCode']
      .value;
    console.log(TellerCodeId);
    if (TellerCodeId) {
      this.PrevTransTransferListForm.patchValue({
        Teller: this.getSelectedItemIDTeller(
          TellerCodeId,
          this.inputHelpData.cashDisbTellerList
        ),
      });
    }
  }
  public getSelectedItemIDTeller(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Account Type!');
      this.PrevTransTransferListForm.patchValue({
        Teller: 0,
        TellerCode: '',
      });
    }
    return selected.Id;
  }
  onChangeTeller(event: any) {
    let TellerId = this.PrevTransTransferListForm.controls['Teller'].value;
    console.log(TellerId);
    if (TellerId) {
      this.PrevTransTransferListForm.patchValue({
        TellerCode: TellerId,
      });
    }
  }

  checkIsAllTellerValue(e) {
    console.log(e);
    if (e) {
      // this.chbIsAllAccTypeStatus = true;
      this.chbIsAllTellerStatus = true;
      //  this.IsAccTypeDisabled = true;
      this.IsTellerDisabled = true;
      this.PrevTransTransferListForm.controls['Teller'].setValue('0');
      this.PrevTransTransferListForm.controls['TellerCode'].setValue('');
    } else {
      // this.chbIsAllAccTypeStatus = false;
      this.chbIsAllTellerStatus = false;
      this.PrevTransTransferListForm.get('Teller').enable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.PrevTransTransferListForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(new ReportKeyValue('Teller', fValue.Teller));
    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );

    //start Teller
    if (this.chbIsAllTellerStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('TellerDesc', 'All Teller')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'TellerDesc',
          this.getSelectedItemText(
            fValue.Teller,
            this.inputHelpData.cashDisbTellerList
          )
        )
      );
    }
    // end Teller
  }

  public getReportToken = (type: any) => {
    // let mNo = this.PrevTransTransferListForm.controls['MemNo'].value;
    // console.log(mNo);
    // if (mNo === '') {
    //   this.toastr.error('Please Input Member!', 'Error');
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

  applicationDateChange() {
    var fv = this.PrevTransTransferListForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.PrevTransTransferListForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.PrevTransTransferListForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.PrevTransTransferListForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.PrevTransTransferListForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.PrevTransTransferListForm.value);
    console.log(this.storetDate);
  }
}
