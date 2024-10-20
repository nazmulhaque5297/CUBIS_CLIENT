import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import { BudgetInputLoadModel } from '../../models/accounting-input-budget.model';
import { LoanPaymentScheduleService } from '../../services/loan-payment-schedule.service';

@Component({
  selector: 'app-loan-payment-schedule',
  templateUrl: './loan-payment-schedule.component.html',
  styleUrls: ['./loan-payment-schedule.component.css'],
})
export class LoanPaymentScheduleComponent implements OnInit {
  loanCalMethodList: IdDescription[] = [];
  paymentList: IdDescription[] = [];
  paymentSubList: IdDescription[] = [];
  LoanScheduleForm: FormGroup;
  submitBtn: boolean = false;
  updateBtn: boolean = false;
  dataList: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  constructor(
    private loanPaymentScheduleService: LoanPaymentScheduleService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    public datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private aService: ReportCommonService
  ) {
    this.reportModel.ReportName = 'rptLoanCalculateReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.LoanScheduleForm = new FormGroup({
      LoanAmount: new FormControl(''),
      NoOfInstallment: new FormControl(''),
      InterestRate: new FormControl(''),
      PaymentType: new FormControl('0'),
      PaymentTypeDesc: new FormControl(''),
      PaymentSubType: new FormControl('0'),
      FirstInstallmentDate: new FormControl(''),
      SecondInstallmentDate: new FormControl(''),
      LoanCalculationMethod: new FormControl('0'),
      InstallmentAmount: new FormControl(''),
      LastInstallmentAmount: new FormControl(''),
      HolWeekDayName1: new FormControl(''),
      HolWeekDayName2: new FormControl(''),
      TotalInterestAmount: new FormControl(''),
      NetPayableAmount: new FormControl(''),
    });
    this.inputLoadData();
  }
  inputLoadData() {
    this.spinner.show();
    this.loanPaymentScheduleService
      .pageLoadData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.loanCalMethodList = x.LoanCalculationMethodDropDown;
          this.paymentList = x.PaymentTypeDropdown;
          this.paymentSubList = x.PaymentTypeSubDropDown;
          this.LoanScheduleForm.controls['HolWeekDayName1'].setValue(
            x.HolWeekDayName1
          );
          this.LoanScheduleForm.controls['HolWeekDayName2'].setValue(
            x.HolWeekDayName2
          );
          this.LoanScheduleForm.controls['FirstInstallmentDate'].setValue(
            x.FirstInstallmentDate
          );
          this.LoanScheduleForm.controls['SecondInstallmentDate'].setValue(
            x.SecondInstallmentDate
          );
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  exitPage() {
    this.router.navigate(['accounting/']);
  }

  installmentAmountChange() {
    if (this.LoanScheduleForm.value.LoanAmount == '') {
      alert('Please input some Loan Amount.');
      this.LoanScheduleForm.controls['InstallmentAmount'].setValue('');
    } else {
      this.loanPaymentScheduleService
        .installmentAmountChange(
          this.LoanScheduleForm.value.InstallmentAmount,
          this.LoanScheduleForm.value.LoanAmount
        )
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            console.log(x);
            this.LoanScheduleForm.controls['NoOfInstallment'].setValue(
              x.NoOfInstallment
            );
            this.LoanScheduleForm.controls['LastInstallmentAmount'].setValue(
              x.LastInstallmentAmount
            );
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
    document.getElementById(`NoOfInstallment`).focus();
  }
  installmentAmountChangekeydown(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`NoOfInstallment`).focus();
  }
  noOfInstallmentChange() {
    if (this.LoanScheduleForm.value.LoanAmount == '') {
      alert('Please input some Loan Amount.');
      this.LoanScheduleForm.controls['NoOfInstallment'].setValue('');
    } else {
      this.loanPaymentScheduleService
        .noOfInstallmentChange(
          this.LoanScheduleForm.value.LoanAmount,
          this.LoanScheduleForm.value.NoOfInstallment
        )
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            console.log(x);
            this.LoanScheduleForm.controls['InstallmentAmount'].setValue(
              x.InstallmentAmount
            );
            this.LoanScheduleForm.controls['LastInstallmentAmount'].setValue(
              x.LastInstallmentAmount
            );
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
    document.getElementById(`InterestRate`).focus();
  }
  noOfInstallmentChangekeydown(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`InterestRate`).focus();
  }
  InterestRatekeydown(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PaymentType`).focus();
  }

  PaymentTypeChange() {
    document.getElementById(`dateFormat`).focus();
  }
  FirstInstallmentDateChange(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`LoanCalculationMethod`).focus();
  }

  onEnterLoanAmountHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`InstallmentAmount`).focus();
  }

  calculateSchedule() {
    if (this.LoanScheduleForm.value.LoanAmount == '') {
      alert('Please input some Loan Amount.');
    } else if (this.LoanScheduleForm.value.NoOfInstallment == '') {
      alert('Please input No of Installment.');
    } else if (this.LoanScheduleForm.value.InterestRate == '') {
      alert('Please input Interest Rate.');
    } else if (this.LoanScheduleForm.value.PaymentType == '0') {
      alert('Please select Payment Type.');
    } else if (
      this.LoanScheduleForm.value.PaymentType == '2' &&
      this.LoanScheduleForm.value.PaymentSubType == '0'
    ) {
      alert('Please select payment for Weekly Type.');
    } else {
      this.spinner.show();
      let selectedCode = this.paymentList.find(
        (x) => x.Id == this.LoanScheduleForm.value.PaymentType
      );
      this.LoanScheduleForm.controls['PaymentTypeDesc'].setValue(
        selectedCode.Description
      );
      var data = this.LoanScheduleForm.value;
      if (data.FirstInstallmentDate.toString().length > 10)
        data.FirstInstallmentDate = this.firstInstallmentDateChange();
      console.log(data);
      this.loanPaymentScheduleService
        .loanScheduleCalculate(data)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.LoanScheduleForm.controls['TotalInterestAmount'].setValue(
              x.TotalIntAmt
            );
            this.LoanScheduleForm.controls['NetPayableAmount'].setValue(
              x.NetPayable
            );
            this.dataList = x.DataList;
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }
  firstInstallmentDateChange() {
    var fv = this.LoanScheduleForm.value;
    var value = this.datepipe.transform(fv.FirstInstallmentDate, 'dd-MM-yyyy');
    return this.loanPaymentScheduleService.convertDateToString(value);
  }

  private setParameter(): void {
    this.reportModel.ReportName = 'rptLoanCalculateReport';
    var memNo = '0';
    var accTypeDesc = '0';
    var LoanAmount = this.LoanScheduleForm.value.LoanAmount;
    var NoInstallment = this.LoanScheduleForm.value.NoOfInstallment;
    var InterestRate = this.LoanScheduleForm.value.InterestRate;

    var OpenDate = '0';
    var InstallAmt = this.LoanScheduleForm.value.InstallmentAmount;
    var LastInstallAmt = this.LoanScheduleForm.value.LastInstallmentAmount;

    var memName = '0';
    console.log('This is data', LoanAmount);
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('MemberNo', memNo.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('Acc Type', accTypeDesc.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('LoanApplicationAmount', LoanAmount.toString())
    );
    this.reportModel.Values.push(
      new ReportKeyValue('No of Installment', NoInstallment.toString())
    );
    this.reportModel.Values.push(
      new ReportKeyValue('Interest Rate', InterestRate.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('Application Date', OpenDate.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('Installment Amount', InstallAmt.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('Last Installment Amount', LastInstallAmt.toString())
    );

    this.reportModel.Values.push(
      new ReportKeyValue('Member Name', memName.toString())
    );
  }

  public getReportToken = () => {
    // let mNo = this.PrevTransTransferListForm.controls['MemNo'].value;
    // console.log(mNo);
    // if (mNo === '') {
    //   this.toastr.error('Please Input Member!', 'Error');
    // } else {
    this.spinner.show();
    this.setParameter();
    //this.spinner.show();
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
    // }
  };

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };
}
