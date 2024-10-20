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
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loan-information-report',
  templateUrl: './loan-information-report.component.html',
  styleUrls: ['./loan-information-report.component.css'],
})
export class LoanInformationReportComponent implements OnInit, OnDestroy {
  module: string = '1';
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  loanInfoReportForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanInfoReportService: LoanInfoReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService
  ) {
    //this.reportModel.ReportName = 'LoanInformation';
    this.reportModel.ReportName = 'rptCSLoanInformationReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    //this.spinner.show();
    // this.coaReportService
    //   .getInputHelp()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data) => {
    //     this.inputHelpData = data;
    //     this.spinner.hide();
    //   });

    // this.getReportToken();
    //this.displayIFrame = true;
  }

  private initializeForm() {
    this.loanInfoReportForm = new FormGroup({
      MemNo: new FormControl(''),
      MemName: new FormControl(''),
      IsOldMem: new FormControl(false),
      BranchNo: new FormControl('0'),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.loanInfoReportForm.value;
    this.reportModel.Values = [];
    this.reportModel.Values.push(
      new ReportKeyValue('MemberNumber', fValue.MemNo)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('MemberName', fValue.MemName)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('BranchNo', this.MemberDetailsList.BranchNo.toString())
    );
    this.reportModel.Values.push(
      new ReportKeyValue('MemType', this.MemberDetailsList.MemType.toString())
    );
  }

  public getReportToken = (type: any) => {
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
  };

  onChangeMemNo(event: any) {
    let IsOldCheck = this.loanInfoReportForm.controls['IsOldMem'].value;
    console.log(IsOldCheck);
    let MemNoId = this.loanInfoReportForm.controls['MemNo'].value;
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
              this.loanInfoReportForm.patchValue({
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
