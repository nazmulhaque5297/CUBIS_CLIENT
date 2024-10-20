import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import {
  AccClassDetails,
  LoanReceivedReportInputHelp,
} from 'src/app/Models/loanreceived-report.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-member-nominee-statement-report',
  templateUrl: './member-nominee-statement-report.component.html',
  styleUrls: ['./member-nominee-statement-report.component.css'],
})
export class MemberNomineeStatementReportComponent
  implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  branchNo: any;

  // chbIsAllMemberStatus: any;

  chbIsAllAccTypeStatus: any;
  IsAccTypeDisabled: any;
  //chbShowZeroBalance: any;

  MemberNomineeStatementForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    //this.reportModel.ReportName = 'MemberNomineeStatement';
    this.reportModel.ReportName = 'rptMemberNomineeStatement';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    //  this.chbIsAllMemberStatus = true;
    this.chbIsAllAccTypeStatus = true;
    this.IsAccTypeDisabled = true;
    // this.chbShowZeroBalance = false;

    this.MemberNomineeStatementForm = new FormGroup({
      IsAllAccType: new FormControl('true'),

      IsOldMem: new FormControl(false),
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
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
        console.log('AllData:', data);
        this.inputHelpData = data;
        this.branchNo = this.inputHelpData.BranchNo;
        console.log(this.inputHelpData);
        this.spinner.hide();
      });
  }

  onChangeMemNo(event: any) {
    let IsOldCheck = this.MemberNomineeStatementForm.controls['IsOldMem'].value;
    console.log(IsOldCheck);
    let MemNoId = this.MemberNomineeStatementForm.controls['MemNo'].value;
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
              this.MemberNomineeStatementForm.patchValue({
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
    let AccTypeCodeId = this.MemberNomineeStatementForm.controls['AccTypeCode']
      .value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.MemberNomineeStatementForm.patchValue({
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
      this.MemberNomineeStatementForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
  }
  onChangeAccType(event: any) {
    let AccTypeId = this.MemberNomineeStatementForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.MemberNomineeStatementForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
  }

  checkIsAllAccTypeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllAccTypeStatus = true;
      this.IsAccTypeDisabled = true;
      this.MemberNomineeStatementForm.controls['AccType'].setValue('0');
      this.MemberNomineeStatementForm.controls['AccTypeCode'].setValue('');
    } else {
      this.chbIsAllAccTypeStatus = false;
      this.MemberNomineeStatementForm.get('AccType').enable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.MemberNomineeStatementForm.value;
    this.reportModel.Values = [];

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

    this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));
    var mName = this.MemberDetailsList.MemberName;
    this.reportModel.Values.push(new ReportKeyValue('MemberDesc', mName));
    if (fValue.AccTypeCode == '') {
      this.reportModel.Values.push(new ReportKeyValue('AccNo', '0'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('AccNo', fValue.AccTypeCode)
      );
    }

    this.reportModel.Values.push(new ReportKeyValue('BranchNo', this.branchNo));
  }

  public getReportToken = (type: any) => {
    let mNo = this.MemberNomineeStatementForm.controls['MemNo'].value;
    console.log(mNo);
    if (mNo === '') {
      alert('Please Input Member!');
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
