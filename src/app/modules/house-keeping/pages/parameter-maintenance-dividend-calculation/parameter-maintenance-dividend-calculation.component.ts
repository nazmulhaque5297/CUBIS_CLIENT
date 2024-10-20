import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import {
  ParameterMaintenanceCustomerServiceDataTypeModel,
  InterestCalculationLoadDataModel,
  InterestCalculationInputDataModel,
} from '../../../Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-parameter-maintenance-dividend-calculation',
  templateUrl: './parameter-maintenance-dividend-calculation.component.html',
  styleUrls: ['./parameter-maintenance-dividend-calculation.component.css'],
})
export class ParameterMaintenanceDividendCalculationComponent
  implements OnInit
{
  dataList: ParameterMaintenanceCustomerServiceDataTypeModel[] = [];
  targetDataList: ParameterMaintenanceCustomerServiceDataTypeModel[] = [];
  loadData: InterestCalculationLoadDataModel =
    new InterestCalculationLoadDataModel();
  inputData: InterestCalculationInputDataModel =
    new InterestCalculationInputDataModel();
  DividendCalculationForm: FormGroup;
  interestFixed: boolean = false;
  showShare: boolean = false;
  ShowSubmit: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  inputLoadData() {
    this.spinner.show();
    this.houseKeepingService
      .DividendCalculationLoadData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.dataList = x.AccTypeDropDown;
          this.targetDataList = x.TargetTypeDropDown;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  initializeForm() {
    this.DividendCalculationForm = new FormGroup({
      PrmIntRate: new FormControl(''),
      PrmMinBalForInt: new FormControl(''),
      PrmMinIntAmt: new FormControl(''),
      PrmShareValue: new FormControl(''),
      TargetAccType: new FormControl('0'),
      PrmLastOpenDate: new FormControl(''),
      ShareProtDeductAccType: new FormControl('0'),
      ShareProtGLCode: new FormControl(''),
      ShareProtGLDesc: new FormControl(''),
      ShareProtMinBalance: new FormControl(''),
      ShareProtMaxBalance: new FormControl(''),
      ShareProtIntRate: new FormControl(''),
      ShareProtFixedAmt: new FormControl(''),
      rbFY: new FormControl('1'),
      rbIntCalMethod: new FormControl('3'),
      rbInterestType: new FormControl('1'),
      rbShareValue: new FormControl('1'),
      rbIntCalPeriod: new FormControl(''),
      AccType: new FormControl('0'),
    });
    this.inputLoadData();
  }

  //enter key events
  onEnterPrmIntRateHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmShareValue`).focus();
  }
  onEnterPrmShareValueHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmMinBalForInt`).focus();
  }
  onEnterPrmMinBalForIntHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmMinIntAmt`).focus();
  }
  onPrmMinIntAmtHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ShareProtMinBalance`).focus();
  }
  onEnterShareProtMinBalanceHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ShareProtMaxBalance`).focus();
  }
  onEnterShareProtMaxBalanceHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ShareProtIntRate`).focus();
  }
  onEnterShareProtIntRateHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ShareProtFixedAmt`).focus();
  }
  onEnterShareProtFixedAmtHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ShareProtGLCode`).focus();
  }

  exitPage() {
    this.router.navigate(['housekeeping/']);
  }

  selectChangeHandler(data: any) {
    this.DividendCalculationForm.controls['AccType'].setValue(
      data.target.value
    );
    this.spinner.show();
    this.houseKeepingService
      .InterestCalculationAccTypeData(data.target.value)
      .pipe(first())
      .subscribe((x: any) => {
        if (x.AccType == 0) {
          this.ShowSubmit = true;
          this.spinner.hide();
          return;
        }
        this.loadData = x;
        this.DividendCalculationForm.controls['PrmIntRate'].setValue(
          x.PrmIntRate.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })
        );
        this.DividendCalculationForm.controls['PrmMinBalForInt'].setValue(
          x.PrmMinBalForInt.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })
        );
        this.DividendCalculationForm.controls['PrmMinIntAmt'].setValue(
          x.PrmMinIntAmt.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })
        );
        this.DividendCalculationForm.controls['PrmShareValue'].setValue(
          x.PrmShareValue
        );
        this.DividendCalculationForm.controls['TargetAccType'].setValue(
          x.TargetAccType
        );
        this.DividendCalculationForm.controls['PrmLastOpenDate'].setValue(
          x.PrmLastOpenDate
        );
        this.DividendCalculationForm.controls[
          'ShareProtDeductAccType'
        ].setValue(x.ShareProtDeductAccType);
        this.DividendCalculationForm.controls['ShareProtGLCode'].setValue(
          x.ShareProtGLCode
        );
        this.DividendCalculationForm.controls['ShareProtGLDesc'].setValue(
          x.ShareProtGLDesc
        );
        this.DividendCalculationForm.controls['ShareProtMinBalance'].setValue(
          x.ShareProtMinBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })
        );
        this.DividendCalculationForm.controls['ShareProtMaxBalance'].setValue(
          x.ShareProtMaxBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })
        );
        this.DividendCalculationForm.controls['ShareProtIntRate'].setValue(
          x.ShareProtIntRate.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })
        );
        this.DividendCalculationForm.controls['ShareProtFixedAmt'].setValue(
          x.ShareProtFixedAmt.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })
        );
        if (x.PrmCalculateFY == 1 || x.PrmCalculateFY == 2)
          this.DividendCalculationForm.controls['rbFY'].setValue(
            x.PrmCalculateFY.toString()
          );
        if (x.PrmCalMethod == 3 || x.PrmCalMethod == 10)
          this.DividendCalculationForm.controls['rbIntCalMethod'].setValue(
            x.PrmCalMethod.toString()
          );
        if (x.PrmInterestType == 1 || x.PrmInterestType == 2)
          this.DividendCalculationForm.controls['rbInterestType'].setValue(
            x.PrmInterestType.toString()
          );
        if (x.PrmShareValueFlag == 1 || x.PrmShareValueFlag == 2)
          this.DividendCalculationForm.controls['rbShareValue'].setValue(
            x.PrmShareValueFlag.toString()
          );
        if (this.DividendCalculationForm.value.rbInterestType == '2') {
          this.interestFixed = true;
        }
        if (this.DividendCalculationForm.value.rbShareValue == '2') {
          this.showShare = true;
        }
        this.spinner.hide();
      });
  }
  changeShareProtectionCode() {
    this.houseKeepingService
      .ShareProtGLCodeChange(this.DividendCalculationForm.value.ShareProtGLCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x: any) => {
        console.log(x.Description);
        if (x.Description == '' || x.Description == null) {
          this.DividendCalculationForm.controls['ShareProtGLCode'].setValue('');
          alert('Invalid GL Code!');
        } else {
          this.DividendCalculationForm.controls['ShareProtGLDesc'].setValue(
            x.Description
          );
          this.DividendCalculationForm.controls['ShareProtGLCode'].setValue(
            x.Id
          );
        }
      });
  }

  submitData() {
    if (this.DividendCalculationForm.value.AccType == 0) {
      alert('Please Select Account Type!');
    } else {
      if (confirm('Are you you want to submit information?')) {
        this.inputData.AccType = this.DividendCalculationForm.value.AccType;
        this.inputData.PrmCalMethod = Number(
          this.DividendCalculationForm.value.rbIntCalMethod
        );
        this.inputData.PrmCalPeriod = Number(2);
        this.inputData.PrmCalculateFY = this.DividendCalculationForm.value.rbFY;
        this.inputData.PrmInterestType =
          this.DividendCalculationForm.value.rbInterestType;
        this.inputData.PrmShareValueFlag =
          this.DividendCalculationForm.value.PrmShareValueFlag;
        this.inputData.PrmShareValue =
          this.DividendCalculationForm.value.rbShareValue;
        this.inputData.PrmIntRate =
          this.DividendCalculationForm.value.PrmIntRate;
        this.inputData.PrmMinBalForInt =
          this.DividendCalculationForm.value.PrmMinBalForInt;
        this.inputData.PrmMinIntAmt =
          this.DividendCalculationForm.value.PrmMinIntAmt;
        this.inputData.TargetAccType =
          this.DividendCalculationForm.value.TargetAccType;
        this.inputData.PrmLastOpenDate =
          this.DividendCalculationForm.value.PrmLastOpenDate;
        this.inputData.ShareProtDeductAccType =
          this.DividendCalculationForm.value.ShareProtDeductAccType;
        this.inputData.ShareProtMinBalance =
          this.DividendCalculationForm.value.ShareProtMinBalance;
        this.inputData.ShareProtMaxBalance = Number(
          this.DividendCalculationForm.value.ShareProtMaxBalance
        );
        this.inputData.ShareProtIntRate =
          this.DividendCalculationForm.value.ShareProtIntRate;
        this.inputData.ShareProtFixedAmt =
          this.DividendCalculationForm.value.ShareProtFixedAmt;
        this.inputData.ShareProtGLCode =
          this.DividendCalculationForm.value.ShareProtGLCode;
        this.inputData.IntRateApr = this.loadData.IntRateApr;
        this.inputData.IntRateAug = this.loadData.IntRateAug;
        this.inputData.IntRateDec = this.loadData.IntRateDec;
        this.inputData.IntRateFeb = this.loadData.IntRateFeb;
        this.inputData.IntRateJan = this.loadData.IntRateJan;
        this.inputData.IntRateJul = this.loadData.IntRateJul;
        this.inputData.IntRateJun = this.loadData.IntRateJun;
        this.inputData.IntRateMar = this.loadData.IntRateMar;
        this.inputData.IntRateMay = this.loadData.IntRateMay;
        this.inputData.IntRateNov = this.loadData.IntRateNov;
        this.inputData.IntRateOct = this.loadData.IntRateOct;
        this.inputData.IntRateSep = this.loadData.IntRateSep;
        this.inputData.PrmCalEndDay = this.loadData.PrmCalEndDay;
        this.inputData.PrmCalStartDay = this.loadData.PrmCalStartDay;
        this.inputData.PrmCheckNotice = Number(this.loadData.PrmCheckNotice);
        this.inputData.PrmGiveInt25Cons = Number(
          this.loadData.PrmGiveInt25Cons
        );
        this.inputData.PrmGiveIntOver25 = Number(
          this.loadData.PrmGiveIntOver25
        );
        this.inputData.PrmMaxBalForInt = this.loadData.PrmMinBalForInt;
        this.inputData.PrmMaxIntAmt = this.loadData.PrmMaxIntAmt;
        this.inputData.PrmNoticeAmt = this.loadData.PrmNoticeAmt;
        this.inputData.PrmSpeIntFlag = Number(this.loadData.PrmSpeIntFlag);
        this.inputData.PrmSpeIntRate1 = this.loadData.PrmSpeIntRate1;
        this.inputData.PrmSpeIntRate2 = this.loadData.PrmSpeIntRate2;
        this.houseKeepingService
          .InsertInterestCalculationData(this.inputData)
          .pipe(first())
          .subscribe(
            (x: any) => {
              if (x == 1) {
                this.ngOnInit();
                this.ShowSubmit = false;
                alert('Data Submitted Successfully.!');
              } else {
                alert("Error Data didn't submitted!");
              }
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
            }
          );
      }
    }
  }
  updateData() {
    if (this.DividendCalculationForm.value.AccType == 0) {
      alert('Please Select Account Type!');
    } else {
      if (confirm('Are you you want to update information?')) {
        this.inputData.AccType = this.DividendCalculationForm.value.AccType;
        this.inputData.PrmCalMethod = Number(
          this.DividendCalculationForm.value.rbIntCalMethod
        );
        this.inputData.PrmCalPeriod = Number(2);
        this.inputData.PrmCalculateFY = this.DividendCalculationForm.value.rbFY;
        this.inputData.PrmInterestType =
          this.DividendCalculationForm.value.rbInterestType;
        this.inputData.PrmShareValueFlag =
          this.DividendCalculationForm.value.PrmShareValueFlag;
        this.inputData.PrmShareValue =
          this.DividendCalculationForm.value.rbShareValue;
        this.inputData.PrmIntRate =
          this.DividendCalculationForm.value.PrmIntRate;
        this.inputData.PrmMinBalForInt =
          this.DividendCalculationForm.value.PrmMinBalForInt;
        this.inputData.PrmMinIntAmt =
          this.DividendCalculationForm.value.PrmMinIntAmt;
        this.inputData.TargetAccType =
          this.DividendCalculationForm.value.TargetAccType;
        this.inputData.PrmLastOpenDate =
          this.DividendCalculationForm.value.PrmLastOpenDate;
        this.inputData.ShareProtDeductAccType =
          this.DividendCalculationForm.value.ShareProtDeductAccType;
        this.inputData.ShareProtMinBalance =
          this.DividendCalculationForm.value.ShareProtMinBalance;
        this.inputData.ShareProtMaxBalance = Number(
          this.DividendCalculationForm.value.ShareProtMaxBalance
        );
        this.inputData.ShareProtIntRate =
          this.DividendCalculationForm.value.ShareProtIntRate;
        this.inputData.ShareProtFixedAmt =
          this.DividendCalculationForm.value.ShareProtFixedAmt;
        this.inputData.ShareProtGLCode =
          this.DividendCalculationForm.value.ShareProtGLCode;
        this.inputData.IntRateApr = this.loadData.IntRateApr;
        this.inputData.IntRateAug = this.loadData.IntRateAug;
        this.inputData.IntRateDec = this.loadData.IntRateDec;
        this.inputData.IntRateFeb = this.loadData.IntRateFeb;
        this.inputData.IntRateJan = this.loadData.IntRateJan;
        this.inputData.IntRateJul = this.loadData.IntRateJul;
        this.inputData.IntRateJun = this.loadData.IntRateJun;
        this.inputData.IntRateMar = this.loadData.IntRateMar;
        this.inputData.IntRateMay = this.loadData.IntRateMay;
        this.inputData.IntRateNov = this.loadData.IntRateNov;
        this.inputData.IntRateOct = this.loadData.IntRateOct;
        this.inputData.IntRateSep = this.loadData.IntRateSep;
        this.inputData.PrmCalEndDay = this.loadData.PrmCalEndDay;
        this.inputData.PrmCalStartDay = this.loadData.PrmCalStartDay;
        this.inputData.PrmCheckNotice = Number(this.loadData.PrmCheckNotice);
        this.inputData.PrmGiveInt25Cons = Number(
          this.loadData.PrmGiveInt25Cons
        );
        this.inputData.PrmGiveIntOver25 = Number(
          this.loadData.PrmGiveIntOver25
        );
        this.inputData.PrmMaxBalForInt = this.loadData.PrmMinBalForInt;
        this.inputData.PrmMaxIntAmt = this.loadData.PrmMaxIntAmt;
        this.inputData.PrmNoticeAmt = this.loadData.PrmNoticeAmt;
        this.inputData.PrmSpeIntFlag = Number(this.loadData.PrmSpeIntFlag);
        this.inputData.PrmSpeIntRate1 = this.loadData.PrmSpeIntRate1;
        this.inputData.PrmSpeIntRate2 = this.loadData.PrmSpeIntRate2;
        this.houseKeepingService
          .UpdateInterestCalculationData(this.inputData)
          .pipe(first())
          .subscribe(
            (x: any) => {
              if (x == 1) {
                this.ngOnInit();
                alert('Data Updated Successfully.!');
              } else {
                alert("Error Data didn't submitted!");
              }
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
            }
          );
      }
    }
  }

  targetAccChange(data: any) {
    this.DividendCalculationForm.controls['TargetAccType'].setValue(
      data.target.value
    );
  }
  shareProtDeductAccTypeChange(data: any) {
    this.DividendCalculationForm.controls['ShareProtDeductAccType'].setValue(
      data.target.value
    );
  }
  changeInterestType() {
    if (this.DividendCalculationForm.value.rbInterestType == '2') {
      this.interestFixed = true;
    } else {
      this.interestFixed = false;
    }
  }
  changeShareShow() {
    if (this.DividendCalculationForm.value.rbShareValue == '2') {
      this.showShare = true;
    } else {
      this.showShare = false;
    }
  }
}
