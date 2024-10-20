import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ParameterMaintenanceCustomerServiceDataTypeModel } from '../../../Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-parameter-maintenance-rebate-calculation',
  templateUrl: './parameter-maintenance-rebate-calculation.component.html',
  styleUrls: ['./parameter-maintenance-rebate-calculation.component.css'],
})
export class ParameterMaintenanceRebateCalculationComponent implements OnInit {
  AccountTypeData: ParameterMaintenanceCustomerServiceDataTypeModel[] = [];
  RebateCalculationTypeEnum: ParameterMaintenanceCustomerServiceDataTypeModel[] =
    [];
  RestMonthsEnum: ParameterMaintenanceCustomerServiceDataTypeModel[] = [];
  UptoMonthEnum: ParameterMaintenanceCustomerServiceDataTypeModel[] = [];
  RebateCalculationForm: FormGroup;
  ShowSubmit: boolean = false;
  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.RebateCalculationForm = new FormGroup({
      AccType: new FormControl('0'),
      InterestRate: new FormControl(''),
      TAPrincipalPercent: new FormControl(''),
      TANoOfTimes: new FormControl(''),
      RebateFullMonthFlagTimes: new FormControl(''),
      TargetAccType: new FormControl('0'),
      RebateGlDrCode: new FormControl(''),
      RebateGlDrDesc: new FormControl(''),
      RebateCalType: new FormControl('0'),
      UptoMthCal: new FormControl('0'),
      RestMthCalType: new FormControl('0'),
      DebitGLCode: new FormControl(''),
      DebitGLCodeDescription: new FormControl(''),
      rbCalculationFor: new FormControl('1'),
      rbRescheduleFlag: new FormControl('1'),
      rbTAYesNo: new FormControl('1'),
      rbRebateFullMonthFlag: new FormControl('1'),
      rbMultipleDepositFlag: new FormControl('1'),
      rbTwoLoanFlag: new FormControl('1'),
      rbRebateExpireDateFlag: new FormControl('1'),
    });
    this.inputLoadData();
  }
  inputLoadData() {
    this.spinner.show();
    this.houseKeepingService
      .RebateCalculationLoadData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.AccountTypeData = x.AccountTypeData;
          this.RebateCalculationTypeEnum = x.RebateCalculationTypeEnum;
          this.RestMonthsEnum = x.RestMonthsEnum;
          this.UptoMonthEnum = x.UptoMonthEnum;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  submitData() {
    if (this.RebateCalculationForm.value.AccType == 0) {
      alert('Please Select Account Type!');
    } else {
      if (confirm('Are you you want to submit information?')) {
        var data = {
          AccType: this.RebateCalculationForm.value.AccType,
          CalculationFor: this.RebateCalculationForm.value.rbCalculationFor,
          InterestRate: this.RebateCalculationForm.value.InterestRate,
          RebateGlDrCode: this.RebateCalculationForm.value.RebateGlDrCode,
          RescheduleFlag: this.RebateCalculationForm.value.rbRescheduleFlag,
          AccTAYesNoType: this.RebateCalculationForm.value.TAYesNo,
          TAPrincipalPercent:
            this.RebateCalculationForm.value.TAPrincipalPercent,
          TANoOfTimes: this.RebateCalculationForm.value.TANoOfTimes,
          RebateFullMonthFlag:
            this.RebateCalculationForm.value.rbRebateFullMonthFlag,
          RebateFullMonthFlagTimes:
            this.RebateCalculationForm.value.RebateFullMonthFlagTimes,
          MultipleDepositFlag:
            this.RebateCalculationForm.value.rbMultipleDepositFlag,
          TargetAccType: this.RebateCalculationForm.value.TargetAccType,
          TwoLoanFlag: this.RebateCalculationForm.value.rbTwoLoanFlag,
          RebateExpireDateFlag:
            this.RebateCalculationForm.value.rbRebateExpireDateFlag,
          RebateCalType: this.RebateCalculationForm.value.RebateCalType,
          UptoMthCal: this.RebateCalculationForm.value.UptoMthCal,
          RestMthCalType: this.RebateCalculationForm.value.RestMthCalType,
          RebateGlDrDesc: this.RebateCalculationForm.value.RebateGlDrDesc,
          RebateGlCrCode: this.RebateCalculationForm.value.DebitGLCode,
          RebateGlCrDesc:
            this.RebateCalculationForm.value.DebitGLCodeDescription,
        };
        console.log(data);
        this.houseKeepingService
          .RebateCalculationSubmitData(data)
          .pipe(first())
          .subscribe((x: any) => {
            if (x == 1) {
              this.ngOnInit();
              this.ShowSubmit = true;
              alert('Data Submitted Successfully.!');
            } else {
              alert("Error Data didn't submitted!");
            }
          });
      }
    }
  }
  updateData() {
    if (this.RebateCalculationForm.value.AccType == 0) {
      alert('Please Select Account Type!');
    } else {
      if (confirm('Are you you want to submit information?')) {
        var data = {
          AccType: this.RebateCalculationForm.value.AccType,
          CalculationFor: this.RebateCalculationForm.value.rbCalculationFor,
          InterestRate: this.RebateCalculationForm.value.InterestRate,
          RebateGlDrCode: this.RebateCalculationForm.value.RebateGlDrCode,
          RescheduleFlag: this.RebateCalculationForm.value.rbRescheduleFlag,
          AccTAYesNoType: this.RebateCalculationForm.value.TAYesNo,
          TAPrincipalPercent:
            this.RebateCalculationForm.value.TAPrincipalPercent,
          TANoOfTimes: this.RebateCalculationForm.value.TANoOfTimes,
          RebateFullMonthFlag:
            this.RebateCalculationForm.value.rbRebateFullMonthFlag,
          RebateFullMonthFlagTimes:
            this.RebateCalculationForm.value.RebateFullMonthFlagTimes,
          MultipleDepositFlag:
            this.RebateCalculationForm.value.rbMultipleDepositFlag,
          TargetAccType: this.RebateCalculationForm.value.TargetAccType,
          TwoLoanFlag: this.RebateCalculationForm.value.rbTwoLoanFlag,
          RebateExpireDateFlag:
            this.RebateCalculationForm.value.rbRebateExpireDateFlag,
          RebateCalType: this.RebateCalculationForm.value.RebateCalType,
          UptoMthCal: this.RebateCalculationForm.value.UptoMthCal,
          RestMthCalType: this.RebateCalculationForm.value.RestMthCalType,
          RebateGlDrDesc: this.RebateCalculationForm.value.RebateGlDrDesc,
          RebateGlCrCode: this.RebateCalculationForm.value.DebitGLCode,
          RebateGlCrDesc:
            this.RebateCalculationForm.value.DebitGLCodeDescription,
        };
        this.houseKeepingService
          .RebateCalculationUpdateData(data)
          .pipe(first())
          .subscribe((x: any) => {
            if (x == 1) {
              this.ngOnInit();
              alert('Data Updated Successfully.!');
            } else {
              alert("Error Data didn't submitted!");
            }
          });
      }
    }
  }
  exitPage() {
    this.router.navigate(['housekeeping/']);
  }

  selectChangeHandler(data: any) {
    this.RebateCalculationForm.controls['AccType'].setValue(data.target.value);
    this.houseKeepingService
      .RebateCalculationAccTypeData(data.target.value)
      .pipe(first())
      .subscribe((x: any) => {
        if (x.AccType == 0) {
          this.ShowSubmit = true;
          return;
        }
        this.ShowSubmit = false;
        this.RebateCalculationForm.controls['InterestRate'].setValue(
          x.InterestRate.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })
        );
        this.RebateCalculationForm.controls['TAPrincipalPercent'].setValue(
          x.TAPrincipalPercent
        );
        this.RebateCalculationForm.controls['TANoOfTimes'].setValue(
          x.TANoOfTimes
        );
        this.RebateCalculationForm.controls[
          'RebateFullMonthFlagTimes'
        ].setValue(x.RebateFullMonthFlagTimes);
        this.RebateCalculationForm.controls['TargetAccType'].setValue(
          x.TargetAccType
        );
        this.RebateCalculationForm.controls['RebateGlDrCode'].setValue(
          x.RebateGlDrCode
        );
        this.RebateCalculationForm.controls['RebateGlDrDesc'].setValue(
          x.RebateGlDrDesc
        );
        this.RebateCalculationForm.controls['RebateCalType'].setValue(
          x.RebateCalType
        );
        this.RebateCalculationForm.controls['UptoMthCal'].setValue(
          x.UptoMthCal
        );
        this.RebateCalculationForm.controls['RestMthCalType'].setValue(
          x.RestMthCalType
        );
        this.RebateCalculationForm.controls['DebitGLCode'].setValue(
          x.RebateGlCrCode
        );
        this.RebateCalculationForm.controls['DebitGLCodeDescription'].setValue(
          x.RebateGlCrDesc
        );
        this.RebateCalculationForm.controls['rbCalculationFor'].setValue(
          x.CalculationFor.toString()
        );
        this.RebateCalculationForm.controls['rbRescheduleFlag'].setValue(
          x.RescheduleFlag.toString()
        );
        this.RebateCalculationForm.controls['rbTAYesNo'].setValue(
          x.TAYesNo.toString()
        );
        this.RebateCalculationForm.controls['rbRebateFullMonthFlag'].setValue(
          x.RebateFullMonthFlag.toString()
        );
        this.RebateCalculationForm.controls['rbMultipleDepositFlag'].setValue(
          x.MultipleDepositFlag.toString()
        );
        this.RebateCalculationForm.controls['rbTwoLoanFlag'].setValue(
          x.TwoLoanFlag.toString()
        );
        this.RebateCalculationForm.controls['rbRebateExpireDateFlag'].setValue(
          x.RebateExpireDateFlag.toString()
        );
      });
  }
  changeGLCode() {
    this.houseKeepingService
      .RebateGLCodeChange(this.RebateCalculationForm.value.RebateGlDrCode)
      .pipe(first())
      .subscribe((x: any) => {
        if (
          x.DebitGLCodeDescription == '' ||
          x.DebitGLCodeDescription == null
        ) {
          this.RebateCalculationForm.controls['RebateGlDrDesc'].setValue('');
          alert('Invalid GL Code!');
        } else {
          this.RebateCalculationForm.controls['RebateGlDrCode'].setValue(
            x.DebitGLCode
          );
          this.RebateCalculationForm.controls['RebateGlDrDesc'].setValue(
            x.DebitGLCodeDescription
          );
        }
      });
  }
}
