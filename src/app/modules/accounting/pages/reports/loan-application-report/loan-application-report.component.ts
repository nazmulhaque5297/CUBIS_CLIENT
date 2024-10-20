import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ReportCommonModel, ReportKeyValue } from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import { __await } from 'tslib';
import { AccTypeModel } from '../../../models/member-application.model';
import { EditLoanApplicationService } from '../../../services/edit-loan-application.service';

@Component({
  selector: 'app-loan-application-report',
  templateUrl: './loan-application-report.component.html',
  styleUrls: ['./loan-application-report.component.css'],
})
export class LoanApplicationReportComponent implements OnInit {
  LoanApplicationReportForm: FormGroup;
  LoanApplicationDate:any;
  LoanApplicationNo:any;
  AccType:any;
  AccTypeDescription:any;
  InputBy:any;
  LoanApplicationAmt:any;
  LoanIntRate:any;
  LoanTotGuarantorAmt:any;
  MemNo:any;
  MemType:any;
  accList:AccTypeModel[];
  private destroy$: Subject<void> = new Subject<void>();

  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  constructor(
    private editLoanApplication: EditLoanApplicationService,
    private toaster: ToastrService,
    private aService: ReportCommonService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAcctype();
  }
  private initializeForm() {
    this.LoanApplicationReportForm = new FormGroup({
      loanAppNo: new FormControl(''),
    });
  }


  async changeLoanAppNo() {

    if (
      this.LoanApplicationReportForm.value.loanAppNo != '' &&
      this.LoanApplicationReportForm.value.loanAppNo != '0'
    ) {

      // const delayedCall = (array, ms) =>
      //     array.forEach((func, index) => setTimeout(func, index * ms))

      // delayedCall([
      //       () => this.findApplicationData(),
      //       () => this.getReportToken(),

      // ],500)
      await this.editLoanApplication
      .applicationNoChangeReport( this.LoanApplicationReportForm.value.loanAppNo)
      .pipe(first()).toPromise().then
      ((x: any) => {
        if (x.Success) {
          console.log("This is api response",x);
          this.LoanApplicationDate=x.LoanApplicationDate;
          this.LoanApplicationNo= this.LoanApplicationReportForm.value.loanAppNo;
          this.AccType=x.AccType;
          this.InputBy=x.Input;
          this.LoanApplicationAmt=x.LoanAppAmount;
          this.LoanIntRate=x.LoanInterestRate;
          this.MemNo=x.MemNumber;
          this.MemType=x.MemType;
          let status = this.accList.find((i) => i.Code == x.AccType)
          console.log("This is status",status.Name)
          this.AccTypeDescription=status.Name;
          if (
            x.ShareGuarantorList != null &&
            x.ShareGuarantorList != undefined
          ) {
            var tot = 0;
            for (var i = 0; i < x.ShareGuarantorList.length; i++) {
              tot += Number(x.ShareGuarantorList[i].AccAmount);
            }
            console.log("This is total value", Number(tot));
            this.LoanTotGuarantorAmt=Number(tot);
          }
        }
      });
      this.getReportToken();
    } else {
      alert("Application No Not Found!")
    }
  }





  getReportToken () {
    this.setParameter();
    this.displayIFrame = true;
    console.log(this.reportModel);
    this.aService
      .getReportToken(this.reportModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (x) => {
          this.setIframe(x);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };



  private setParameter(): void {
    console.log("This is loan app no", this.LoanApplicationReportForm.value.loanAppNo)
    this.reportModel.ReportName = 'rptLoanApplicationReport';

    //var fValue = this.LoanReturnScheduleForm.value;
    this.reportModel.Values = [];
    this.reportModel.Values.push(
      new ReportKeyValue('LoanApplicationDate', this.LoanApplicationDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('LoanApplicationNo', this.LoanApplicationReportForm.value.loanAppNo)
    );
    this.reportModel.Values.push(new ReportKeyValue('AccType', this.AccType));
    this.reportModel.Values.push(
      new ReportKeyValue('AccTypeDescription', this.AccTypeDescription)
    );
    this.reportModel.Values.push(new ReportKeyValue('InputBy', this.InputBy));
    this.reportModel.Values.push(
      new ReportKeyValue('LoanApplicationAmt', this.LoanApplicationAmt)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('LoanIntRate', this.LoanIntRate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('LoanTotGuarantorAmt', this.LoanTotGuarantorAmt)
    );
    this.reportModel.Values.push(new ReportKeyValue('MemNo', this.MemNo));
    this.reportModel.Values.push(new ReportKeyValue('MemType', this.MemType));
  }
  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath,"_blank");
  }

  getAcctype(){
    this.editLoanApplication.getAccTypes().pipe(takeUntil(this.destroy$)).subscribe((data:any) => {
      this.accList = data;
    });
  }
}
