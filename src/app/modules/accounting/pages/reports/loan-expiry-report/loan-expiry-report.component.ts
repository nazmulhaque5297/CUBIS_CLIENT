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
  selector: 'app-loan-expiry-report',
  templateUrl: './loan-expiry-report.component.html',
  styleUrls: ['./loan-expiry-report.component.css'],
})
export class LoanExpiryReportComponent implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  storeEValue: any;

  //chbIsAllAccTypeStatus: any;
  //IsAccTypeDisabled: any;
  //chbShowZeroBalance: any;

  LoanExpiryDateForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    this.reportModel.ReportName = 'rptCSLoanExpiryDate06';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.MemberDetailsList = null;
    // this.chbIsAllAccTypeStatus = true;
    // this.IsAccTypeDisabled = true;
    // this.chbShowZeroBalance = false;

    this.LoanExpiryDateForm = new FormGroup({
      //IsAllAccType: new FormControl('true'),
      ExpiryDate: new FormControl(''),
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
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
        this.LoanExpiryDateForm.controls['ExpiryDate'].setValue(
          data.ApplicationDate
        );
        this.storeEValue = data.ApplicationDate;
        // this.AccountTransferListForm.controls['IssueToDate'].setValue(
        //   data.ApplicationDate
        // );
        this.spinner.hide();
      });
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.LoanExpiryDateForm.controls['AccTypeCode'].value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.LoanExpiryDateForm.patchValue({
        AccType: this.getSelectedItemIDAccType(
          AccTypeCodeId,
          this.inputHelpData.loanExpAccountTypeList
        ),
      });
      // start get acctype class
      this.spinner.show();
      this.loanReceivedReportService
        .getAccTypeClassDetails(AccTypeCodeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.accTypeClassData = data;
          console.log(this.accTypeClassData);

          if (this.accTypeClassData.AccTypeClass == 6) {
            this.reportModel.ReportName = 'rptCSLoanExpiryDate06';
          } else {
            this.reportModel.ReportName = 'rptCSLoanExpiryDate';
          }

          this.spinner.hide();

          (err) => {
            this.spinner.hide();
          };
        });
      //end get acctype class
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
      this.LoanExpiryDateForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
  }
  onChangeAccType(event: any) {
    let AccTypeId = this.LoanExpiryDateForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.LoanExpiryDateForm.patchValue({
        AccTypeCode: AccTypeId,
      });
      //start get acc type class
      this.spinner.show();
      this.loanReceivedReportService
        .getAccTypeClassDetails(AccTypeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.accTypeClassData = data;
          console.log(this.accTypeClassData);

          if (this.accTypeClassData.AccTypeClass == 6) {
            this.reportModel.ReportName = 'rptCSLoanExpiryDate06';
          } else {
            this.reportModel.ReportName = 'rptCSLoanExpiryDate';
          }

          this.spinner.hide();

          (err) => {
            this.spinner.hide();
          };
        });
      //end get acc type class
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.LoanExpiryDateForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('ExpiryDate', this.storeEValue)
    );
    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));
    // this.reportModel.Values.push(
    //   new ReportKeyValue('ShowZeroBalance', fValue.ShowZeroBalance ? '1' : '0')
    // );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccTypeDesc',
        this.getSelectedItemText(
          fValue.AccType,
          this.inputHelpData.loanExpAccountTypeList
        )
      )
    );
  }

  public getReportToken = (type: any) => {
    let AccType = this.LoanExpiryDateForm.controls['AccType'].value;
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
    var fv = this.LoanExpiryDateForm.value;
    var value = this.datepipe.transform(fv.ExpiryDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.LoanExpiryDateForm.value.ExpiryDate = formatedValue;
    this.storeEValue = formatedValue;
    console.log(this.LoanExpiryDateForm.value);
    console.log(this.storeEValue);
  }
}
