import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import {
  InterestCalculationInputDataModel,
  InterestCalculationLoadDataModel,
  ParameterMaintenanceCustomerServiceDataTypeModel,
} from '../../../Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-parameter-maintenance-interest-calculation',
  templateUrl: './parameter-maintenance-interest-calculation.component.html',
  styleUrls: ['./parameter-maintenance-interest-calculation.component.css'],
})
export class ParameterMaintenanceInterestCalculationComponent
  implements OnInit {
  dataList: ParameterMaintenanceCustomerServiceDataTypeModel[] = [];
  targetDataList: ParameterMaintenanceCustomerServiceDataTypeModel[] = [];
  loadData: InterestCalculationLoadDataModel = new InterestCalculationLoadDataModel();
  inputData: InterestCalculationInputDataModel = new InterestCalculationInputDataModel();
  InterestCalculationForm: FormGroup;
  showAll: boolean = false;
  showSeven: boolean = false;
  showOver25: boolean = false;
  showSpecialInterest: boolean = false;
  ShowSubmit: boolean = false;
  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showAll = false;
    this.showSeven = false;
    this.showOver25 = false;
    this.showSpecialInterest = false;
    this.initializeForm();
  }
  inputLoadData() {
    this.spinner.show();
    this.houseKeepingService
      .InterestCalculationLoadData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.dataList = x;
          this.targetDataList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  initializeForm() {
    this.InterestCalculationForm = new FormGroup({
      AccTypeCode: new FormControl(''),
      PrmCalStartDay: new FormControl(''),
      PrmCalEndDay: new FormControl(''),
      PrmNoticeAmt: new FormControl(''),
      PrmSpeIntRate1: new FormControl(''),
      PrmSpeIntRate2: new FormControl(''),
      PrmMinBalForInt: new FormControl(''),
      PrmMaxBalForInt: new FormControl(''),
      PrmMinIntAmt: new FormControl(''),
      PrmMaxIntAmt: new FormControl(''),
      IntRateJul: new FormControl(''),
      IntRateAug: new FormControl(''),
      IntRateSep: new FormControl(''),
      IntRateOct: new FormControl(''),
      IntRateNov: new FormControl(''),
      IntRateDec: new FormControl(''),
      IntRateJan: new FormControl(''),
      IntRateFeb: new FormControl(''),
      IntRateMar: new FormControl(''),
      IntRateApr: new FormControl(''),
      IntRateMay: new FormControl(''),
      IntRateJun: new FormControl(''),
      TargetAccType: new FormControl(''),
      rbIntCalPeriod: new FormControl(''), // radio button starts form here
      rbIntCalMethod: new FormControl(''),
      rbConWithdraw: new FormControl(''),
      rbSevenDay: new FormControl(''),
      rbSpeInt: new FormControl(''),
      rbGiveInt: new FormControl(''),
    });
    this.inputLoadData();
  }

  //enter key events
  onEnterPrmCalStartDayHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmCalEndDay`).focus();
  }
  onEnterPrmCalEndDayHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmMinBalForInt`).focus();
  }
  onEnterPrmMinBalForIntHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmMinIntAmt`).focus();
  }
  onEnterPrmMinIntAmtHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmMaxBalForInt`).focus();
  }
  onEnterPrmMaxBalForIntHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`PrmMaxIntAmt`).focus();
  }
  onEnterPrmMaxIntAmtHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateJul`).focus();
  }
  onEnterIntRateJulHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateOct`).focus();
  }
  onEnterIntRateOctHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateJan`).focus();
  }
  onEnterIntRateJanHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateApr`).focus();
  }
  onEnterIntRateAprHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateAug`).focus();
  }
  onEnterIntRateAugHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateNov`).focus();
  }
  onEnterIntRateNovHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateFeb`).focus();
  }
  onEnterIntRateFebHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateMay`).focus();
  }
  onEnterIntRateMayHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateSep`).focus();
  }
  onEnterIntRateSepHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateDec`).focus();
  }
  onEnterIntRateDecHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateMar`).focus();
  }
  onEnterIntRateMarHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`IntRateJun`).focus();
  }

  selectChangeHandler(data: any) {
    this.InterestCalculationForm.controls['AccTypeCode'].setValue(
      data.target.value
    );
    if (data.target.value == 0) {
      this.showAll = false;
    } else {
      this.spinner.show();
      this.showAll = true;
      this.houseKeepingService
        .InterestCalculationAccTypeData(data.target.value)
        .pipe(first())
        .subscribe((x: any) => {
          this.spinner.hide();
          console.log("AllResponse===>",x)
          if (x.AccType == 0) {
            this.ShowSubmit = true;
            return;
          }
          this.ShowSubmit = false;
          this.InterestCalculationForm.controls['PrmCalStartDay'].setValue(
            x.PrmCalStartDay
          );
          this.InterestCalculationForm.controls['PrmCalEndDay'].setValue(
            x.PrmCalEndDay
          );
          this.InterestCalculationForm.controls['PrmNoticeAmt'].setValue(
            x.PrmNoticeAmt
          );
          this.InterestCalculationForm.controls['PrmSpeIntRate1'].setValue(
            x.PrmSpeIntRate1
          );
          this.InterestCalculationForm.controls['PrmSpeIntRate2'].setValue(
            x.PrmSpeIntRate2
          );
          this.InterestCalculationForm.controls['PrmMinBalForInt'].setValue(
            x.PrmMinBalForInt.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['PrmMaxBalForInt'].setValue(
            x.PrmMaxBalForInt.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['PrmMinIntAmt'].setValue(
            x.PrmMinIntAmt.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['PrmMaxIntAmt'].setValue(
            x.PrmMaxIntAmt.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateJul'].setValue(
            x.IntRateJul.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateAug'].setValue(
            x.IntRateAug.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateSep'].setValue(
            x.IntRateSep.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateOct'].setValue(
            x.IntRateOct.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateNov'].setValue(
            x.IntRateNov.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateDec'].setValue(
            x.IntRateDec.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateJan'].setValue(
            x.IntRateJan.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateFeb'].setValue(
            x.IntRateFeb.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateMar'].setValue(
            x.IntRateMar.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateApr'].setValue(
            x.IntRateApr.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateMay'].setValue(
            x.IntRateMay.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['IntRateJun'].setValue(
            x.IntRateJun.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.InterestCalculationForm.controls['TargetAccType'].setValue(
            x.TargetAccType
          );
          this.InterestCalculationForm.controls['rbIntCalPeriod'].setValue(
            x.PrmCalPeriod.toString()
          );
          this.InterestCalculationForm.controls['rbIntCalMethod'].setValue(
            x.PrmCalMethod.toString()
          );
          this.InterestCalculationForm.controls['rbConWithdraw'].setValue(
            x.PrmGiveInt25Cons.toString()
          );
          this.InterestCalculationForm.controls['rbSevenDay'].setValue(
            x.PrmCheckNotice.toString()
          );
          if (x.PrmCheckNotice == 2) {
            this.showSeven = true;
          }
          this.InterestCalculationForm.controls['rbSpeInt'].setValue(
            x.PrmSpeIntFlag.toString()
          );
          this.InterestCalculationForm.controls['rbGiveInt'].setValue(
            x.PrmGiveIntOver25.toString()
          );
          if (this.InterestCalculationForm.value.rbConWithdraw == '1') {
            this.showOver25 = true;
          }
          if (this.InterestCalculationForm.value.rbSpeInt == '2') {
            this.showSpecialInterest = true;
          }
          this.loadData = x;
        });
    }
  }
  selectChangeHandlerTarget(event: any) {
    this.InterestCalculationForm.controls['TargetAccType'].setValue(
      event.target.value
    );
  }
  exitPage() {
    this.router.navigate(['housekeeping/']);
  }
  sevenDayNotice() {
    if (this.InterestCalculationForm.value.rbSevenDay == '2') {
      this.showSeven = true;
    } else {
      this.showSeven = false;
    }
  }
  checkOver25() {
    if (this.InterestCalculationForm.value.rbConWithdraw == '1') {
      this.showOver25 = true;
    } else {
      this.showOver25 = false;
    }
  }
  specialInterest() {
    if (this.InterestCalculationForm.value.rbSpeInt == '2') {
      this.showSpecialInterest = true;
    } else {
      this.showSpecialInterest = false;
    }
  }
  submitData() {
    if (this.InterestCalculationForm.value.AccTypeCode == '') {
      alert('Please Select An Account Type!');
    }
    if (confirm('Are you you want to submit information?')) {
      this.inputData.AccType = this.InterestCalculationForm.value.AccTypeCode;
      this.inputData.IntRateApr = +this.InterestCalculationForm.value
        .IntRateApr;
      this.inputData.IntRateAug = +this.InterestCalculationForm.value
        .IntRateAug;
      this.inputData.IntRateDec = +this.InterestCalculationForm.value
        .IntRateDec;
      this.inputData.IntRateFeb = +this.InterestCalculationForm.value
        .IntRateFeb;
      this.inputData.IntRateJan = +this.InterestCalculationForm.value
        .IntRateJan;
      this.inputData.IntRateJul = +this.InterestCalculationForm.value
        .IntRateJul;
      this.inputData.IntRateJun = +this.InterestCalculationForm.value
        .IntRateJun;
      this.inputData.IntRateMar = +this.InterestCalculationForm.value
        .IntRateMar;
      this.inputData.IntRateMay = +this.InterestCalculationForm.value
        .IntRateMay;
      this.inputData.IntRateNov = +this.InterestCalculationForm.value
        .IntRateNov;
      this.inputData.IntRateOct = +this.InterestCalculationForm.value
        .IntRateOct;
      this.inputData.IntRateSep = +this.InterestCalculationForm.value
        .IntRateSep;
      this.inputData.PrmCalEndDay = +this.InterestCalculationForm.value
        .PrmCalEndDay;
      this.inputData.PrmCalMethod = Number(
        this.InterestCalculationForm.value.rbIntCalMethod
      );
      this.inputData.PrmCalPeriod = Number(
        this.InterestCalculationForm.value.rbIntCalPeriod
      );
      this.inputData.PrmCalStartDay = +this.InterestCalculationForm.value
        .PrmCalStartDay;
      this.inputData.PrmCalculateFY = this.loadData.PrmCalculateFY;
      this.inputData.PrmCheckNotice = Number(
        this.InterestCalculationForm.value.rbSevenDay
      );
      this.inputData.PrmGiveInt25Cons = Number(
        this.InterestCalculationForm.value.rbConWithdraw
      );
      this.inputData.PrmGiveIntOver25 = Number(
        this.InterestCalculationForm.value.rbGiveInt
      );
      this.inputData.PrmIntRate = +this.loadData.PrmIntRate;
      this.inputData.PrmInterestType = +this.loadData.PrmInterestType;
      this.inputData.PrmLastOpenDate = this.loadData.PrmLastOpenDate;
      this.inputData.PrmMaxBalForInt = +this.InterestCalculationForm.value
        .PrmMaxBalForInt;
      this.inputData.PrmMaxIntAmt = +this.InterestCalculationForm.value
        .PrmMaxIntAmt;
      this.inputData.PrmMinBalForInt = +this.InterestCalculationForm.value
        .PrmMinBalForInt;
      this.inputData.PrmMinIntAmt = +this.InterestCalculationForm.value
        .PrmMinIntAmt;
      this.inputData.PrmNoticeAmt = +this.InterestCalculationForm.value
        .PrmNoticeAmt;
      this.inputData.PrmShareValue = +this.loadData.PrmShareValue ?? 0;
      this.inputData.PrmShareValueFlag = +this.loadData.PrmShareValueFlag ?? 0;
      this.inputData.PrmSpeIntFlag = Number(
        this.InterestCalculationForm.value.rbSpeInt
      );
      this.inputData.PrmSpeIntRate1 = +this.InterestCalculationForm.value
        .PrmSpeIntRate1;
      this.inputData.PrmSpeIntRate2 = +this.InterestCalculationForm.value
        .PrmSpeIntRate2;
      this.inputData.ShareProtDeductAccType =
        +this.loadData.ShareProtDeductAccType ?? 0;
      this.inputData.ShareProtFixedAmt = +this.loadData.ShareProtFixedAmt ?? 0;
      this.inputData.ShareProtGLCode = +this.loadData.ShareProtGLCode ?? 0;
      this.inputData.ShareProtIntRate = +this.loadData.ShareProtIntRate ?? 0;
      this.inputData.ShareProtMaxBalance =
        +this.loadData.ShareProtMaxBalance ?? 0;
      this.inputData.ShareProtMinBalance =
        +this.loadData.ShareProtMinBalance ?? 0;
      this.inputData.TargetAccType = +this.InterestCalculationForm.value
        .TargetAccType;
      this.houseKeepingService
        .InsertInterestCalculationData(this.inputData)
        .pipe(first())
        .subscribe(
          (x: any) => {
            if (x == 1) {
              this.ngOnInit();
              alert('Data Submitted Successfully.!');
            } else {
              this.toastr.error("Error Data didn't submitted!", 'Error');
            }
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }

  updateData() {
    if (this.InterestCalculationForm.value.AccTypeCode == '') {
      alert('Please Select An Account Type!');
    }
    if (confirm('Are you you want to update information?')) {
      this.inputData.AccType = this.InterestCalculationForm.value.AccTypeCode;
      this.inputData.IntRateApr = this.InterestCalculationForm.value.IntRateApr;
      this.inputData.IntRateAug = this.InterestCalculationForm.value.IntRateAug;
      this.inputData.IntRateDec = this.InterestCalculationForm.value.IntRateDec;
      this.inputData.IntRateFeb = this.InterestCalculationForm.value.IntRateFeb;
      this.inputData.IntRateJan = this.InterestCalculationForm.value.IntRateJan;
      this.inputData.IntRateJul = this.InterestCalculationForm.value.IntRateJul;
      this.inputData.IntRateJun = this.InterestCalculationForm.value.IntRateJun;
      this.inputData.IntRateMar = this.InterestCalculationForm.value.IntRateMar;
      this.inputData.IntRateMay = this.InterestCalculationForm.value.IntRateMay;
      this.inputData.IntRateNov = this.InterestCalculationForm.value.IntRateNov;
      this.inputData.IntRateOct = this.InterestCalculationForm.value.IntRateOct;
      this.inputData.IntRateSep = this.InterestCalculationForm.value.IntRateSep;
      this.inputData.PrmCalEndDay = this.InterestCalculationForm.value.PrmCalEndDay;
      this.inputData.PrmCalMethod = Number(
        this.InterestCalculationForm.value.rbIntCalMethod
      );
      this.inputData.PrmCalPeriod = Number(
        this.InterestCalculationForm.value.rbIntCalPeriod
      );
      this.inputData.PrmCalStartDay = this.InterestCalculationForm.value.PrmCalStartDay;
      this.inputData.PrmCalculateFY = this.loadData.PrmCalculateFY;
      this.inputData.PrmCheckNotice = Number(
        this.InterestCalculationForm.value.rbSevenDay
      );
      this.inputData.PrmGiveInt25Cons = Number(
        this.InterestCalculationForm.value.rbConWithdraw
      );
      this.inputData.PrmGiveIntOver25 = Number(
        this.InterestCalculationForm.value.rbGiveInt
      );
      this.inputData.PrmIntRate = this.loadData.PrmIntRate;
      this.inputData.PrmInterestType = this.loadData.PrmInterestType;
      this.inputData.PrmLastOpenDate = this.loadData.PrmLastOpenDate;
      this.inputData.PrmMaxBalForInt = this.InterestCalculationForm.value.PrmMaxBalForInt;
      this.inputData.PrmMaxIntAmt = this.InterestCalculationForm.value.PrmMaxIntAmt;
      this.inputData.PrmMinBalForInt = this.InterestCalculationForm.value.PrmMinBalForInt;
      this.inputData.PrmMinIntAmt = this.InterestCalculationForm.value.PrmMinIntAmt;
      this.inputData.PrmNoticeAmt = this.InterestCalculationForm.value.PrmNoticeAmt;
      this.inputData.PrmShareValue = this.loadData.PrmShareValue;
      this.inputData.PrmShareValueFlag = this.loadData.PrmShareValueFlag;
      this.inputData.PrmSpeIntFlag = Number(
        this.InterestCalculationForm.value.rbSpeInt
      );
      this.inputData.PrmSpeIntRate1 = this.InterestCalculationForm.value.PrmSpeIntRate1;
      this.inputData.PrmSpeIntRate2 = this.InterestCalculationForm.value.PrmSpeIntRate2;
      this.inputData.ShareProtDeductAccType = this.loadData.ShareProtDeductAccType;
      this.inputData.ShareProtFixedAmt = this.loadData.ShareProtFixedAmt;
      this.inputData.ShareProtGLCode = this.loadData.ShareProtGLCode;
      this.inputData.ShareProtIntRate = this.loadData.ShareProtIntRate;
      this.inputData.ShareProtMaxBalance = this.loadData.ShareProtMaxBalance;
      this.inputData.ShareProtMinBalance = this.loadData.ShareProtMinBalance;
      this.inputData.TargetAccType = this.InterestCalculationForm.value.TargetAccType;
      this.houseKeepingService
        .UpdateInterestCalculationData(this.inputData)
        .pipe(first())
        .subscribe(
          (x: any) => {
            if (x == 1) {
              this.ngOnInit();
              alert('Data Updated Successfully.!');
            } else {
              this.toastr.error("Error Data didn't submitted!", 'Error');
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
