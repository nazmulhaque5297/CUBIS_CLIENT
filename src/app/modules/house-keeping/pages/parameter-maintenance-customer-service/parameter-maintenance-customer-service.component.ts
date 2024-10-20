import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import {
  ParameterMaintenanceCustomerServiceDataTypeModel,
  ParameterMaintenanceCustomerServiceEnumModel,
  ParameterMaintenanceCustomerServiceGetDataTypeModel,
} from '../../../Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';
import { SlabMaintainService } from '../../services/slab-maintain.service';
import { SlabMaintainDepositAndSchemeComponent } from '../slab-maintain/slab-maintain-deposit-and-scheme/slab-maintain-deposit-and-scheme.component';
import { SlabMaintainLoanComponent } from '../slab-maintain/slab-maintain-loan/slab-maintain-loan.component';

@Component({
  selector: 'app-parameter-maintenance-customer-service',
  templateUrl: './parameter-maintenance-customer-service.component.html',
  styleUrls: ['./parameter-maintenance-customer-service.component.css'],
})
export class ParameterMaintenanceCustomerServiceComponent implements OnInit {
  dataList: ParameterMaintenanceCustomerServiceDataTypeModel[] = [];
  accTypeData: ParameterMaintenanceCustomerServiceGetDataTypeModel = new ParameterMaintenanceCustomerServiceGetDataTypeModel();
  CustomerServiceForm: FormGroup;
  enumData: ParameterMaintenanceCustomerServiceEnumModel = new ParameterMaintenanceCustomerServiceEnumModel();

  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private slabService: SlabMaintainService,
    private router: Router,
    private datepipe: DatePipe,
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getInputHelpData();
    this.getEnumData();
    this.initializeForm();
  }
  initializeForm() {
    this.CustomerServiceForm = new FormGroup({
      AccClosingFees: new FormControl(''),
      AccProcFees: new FormControl(''),
      AccProcFlag: new FormControl(''),
      AccType: new FormControl('0'),
      AccTypeClass: new FormControl(''),
      AccTypeCode: new FormControl(''),
      AnniversaryFlag: new FormControl(''),
      AutoDepositFees: new FormControl(''),
      AutoDepositFlag: new FormControl(''),
      BenefitBy: new FormControl(''),
      BenefitWBy: new FormControl(''),
      CalculationMethod: new FormControl(''),
      CalculationPeriod: new FormControl(''),
      FundRate: new FormControl(''),
      GraceFlag: new FormControl(''),
      GraceMonth: new FormControl(''),
      IntWithdrDays: new FormControl(''),
      InterestRate: new FormControl(''),
      LoanCalculationMethod: new FormControl(''),
      LoanGuarantyAmtPerc: new FormControl(''),
      LoanPenaltyAmtPerc: new FormControl(''),
      MandatoryDepFlag: new FormControl(''),
      MaxAgeLoanGuarantee: new FormControl(''),
      MaxAgeLoanOpen: new FormControl(''),
      MaxPenalAmount: new FormControl(''),
      MinAgeLoanGuarantee: new FormControl(''),
      MinAgeLoanOpen: new FormControl(''),
      MinBalanceAmt: new FormControl(''),
      MinDepositAmt: new FormControl(''),
      NoDouble: new FormControl(''),
      PenalAmount: new FormControl(''),
      Period: new FormControl(''),
      PeriodSlab: new FormControl(''),
      PrmLoanGuarantyAmtPerc: new FormControl(''),
      PrmLoanPenaltyAmtPerc: new FormControl(''),
      PrmMutualAidFixedAmt: new FormControl(''),
      PrmMutualAidMaxBalance: new FormControl(''),
      PrmMutualAidMinBalance: new FormControl(''),
      ProductCondition: new FormControl(''),
      ProductInterestType: new FormControl(''),
      ProvBegDate: new FormControl(''),
      ProvBegNullDate: new FormControl(''),
      ProvisionFlag: new FormControl(''),
      RecordFlag: new FormControl(''),
      RenewalFlag: new FormControl(''),
      RoundFlag: new FormControl(''),
      ShareGuaranteeMonth: new FormControl(''),
      ShareGuaranteeNo: new FormControl(''),
      SurityPictureFrom: new FormControl(''),
    });
  }
  getInputHelpData() {
    this.spinner.show();
    this.houseKeepingService
      .GetPerameterControlCustomerServiceInputHelpData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.dataList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  getEnumData() {
    this.spinner.show();
    this.houseKeepingService
      .GetPerameterControlCustomerServiceEnumData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.enumData = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  selectChangeHandler(event: any) {
    this.spinner.show();
    this.houseKeepingService
      .GetPerameterControlCustomerServiceAccTypeData(event.target.value)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.accTypeData = x;
          console.log('this is acctype data:', this.accTypeData);
          this.setSelectValues(event.target.value);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  setSelectValues(accType: number) {
    this.CustomerServiceForm.controls['AccClosingFees'].setValue(
      this.accTypeData.AccClosingFees.toLocaleString('en-US',{
        minimumFractionDigits:2
      })
    );
    this.CustomerServiceForm.controls['AccProcFees'].setValue(
      this.accTypeData.AccProcFees.toLocaleString('en-US',{
        minimumFractionDigits:2
      })
    );
    this.CustomerServiceForm.controls['AccProcFlag'].setValue(
      this.accTypeData.AccProcFlag
    );
    this.CustomerServiceForm.controls['AccType'].setValue(
      this.accTypeData.AccType
    );
    this.CustomerServiceForm.controls['AccTypeClass'].setValue(
      this.accTypeData.AccTypeClass
    );
    this.CustomerServiceForm.controls['AccTypeCode'].setValue(
      this.accTypeData.AccTypeCode
    );
    this.CustomerServiceForm.controls['AnniversaryFlag'].setValue(
      this.accTypeData.AnniversaryFlag
    );
    this.CustomerServiceForm.controls['AutoDepositFees'].setValue(
      this.accTypeData.AutoDepositFees.toLocaleString('en-US',{
        minimumFractionDigits:2,
      })
    );
    this.CustomerServiceForm.controls['AutoDepositFlag'].setValue(
      this.accTypeData.AutoDepositFlag
    );
    this.CustomerServiceForm.controls['BenefitBy'].setValue(
      this.accTypeData.BenefitBy
    );
    this.CustomerServiceForm.controls['BenefitWBy'].setValue(
      this.accTypeData.BenefitWBy
    );
    this.CustomerServiceForm.controls['CalculationMethod'].setValue(
      this.accTypeData.CalculationMethod
    );
    this.CustomerServiceForm.controls['CalculationPeriod'].setValue(
      this.accTypeData.CalculationPeriod
    );
    this.CustomerServiceForm.controls['FundRate'].setValue(
      this.accTypeData.FundRate
    );
    this.CustomerServiceForm.controls['GraceFlag'].setValue(
      this.accTypeData.GraceFlag
    );
    this.CustomerServiceForm.controls['GraceMonth'].setValue(
      this.accTypeData.GraceMonth
    );
    this.CustomerServiceForm.controls['IntWithdrDays'].setValue(
      this.accTypeData.IntWithdrDays
    );
    this.CustomerServiceForm.controls['InterestRate'].setValue(
      this.accTypeData.InterestRate.toLocaleString('en-US',{
        minimumFractionDigits: 2
      })
    );
    this.CustomerServiceForm.controls['LoanCalculationMethod'].setValue(
      this.accTypeData.LoanCalculationMethod
    );
    this.CustomerServiceForm.controls['LoanGuarantyAmtPerc'].setValue(
      this.accTypeData.LoanGuarantyAmtPerc.toLocaleString('en-US',{
        minimumFractionDigits: 2
      })
    );
    this.CustomerServiceForm.controls['LoanPenaltyAmtPerc'].setValue(
      this.accTypeData.LoanPenaltyAmtPerc
    );
    this.CustomerServiceForm.controls['MandatoryDepFlag'].setValue(
      this.accTypeData.MandatoryDepFlag
    );
    this.CustomerServiceForm.controls['MaxAgeLoanGuarantee'].setValue(
      this.accTypeData.MaxAgeLoanGuarantee
    );
    this.CustomerServiceForm.controls['MaxAgeLoanOpen'].setValue(
      this.accTypeData.MaxAgeLoanOpen
    );
    this.CustomerServiceForm.controls['MaxPenalAmount'].setValue(
      this.accTypeData.MaxPenalAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      })
    );
    this.CustomerServiceForm.controls['MinAgeLoanGuarantee'].setValue(
      this.accTypeData.MinAgeLoanGuarantee
    );
    this.CustomerServiceForm.controls['MinAgeLoanOpen'].setValue(
      this.accTypeData.MinAgeLoanOpen
    );
    this.CustomerServiceForm.controls['MinBalanceAmt'].setValue(
      this.accTypeData.MinBalanceAmt.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      })
    );
    this.CustomerServiceForm.controls['MinDepositAmt'].setValue(
      this.accTypeData.MinDepositAmt.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      })
    );
    this.CustomerServiceForm.controls['NoDouble'].setValue(
      this.accTypeData.NoDouble
    );
    this.CustomerServiceForm.controls['PenalAmount'].setValue(
      this.accTypeData.PenalAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      })
    );
    this.CustomerServiceForm.controls['Period'].setValue(
      this.accTypeData.Period
    );
    this.CustomerServiceForm.controls['PeriodSlab'].setValue(
      this.accTypeData.PeriodSlab
    );
    this.CustomerServiceForm.controls['PrmLoanGuarantyAmtPerc'].setValue(
      this.accTypeData.PrmLoanGuarantyAmtPerc
    );
    this.CustomerServiceForm.controls['PrmLoanPenaltyAmtPerc'].setValue(
      this.accTypeData.PrmLoanPenaltyAmtPerc
    );
    this.CustomerServiceForm.controls['PrmMutualAidFixedAmt'].setValue(
      this.accTypeData.PrmMutualAidFixedAmt.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      })
    );
    this.CustomerServiceForm.controls['PrmMutualAidMaxBalance'].setValue(
      this.accTypeData.PrmMutualAidMaxBalance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      })
    );
    this.CustomerServiceForm.controls['PrmMutualAidMinBalance'].setValue(
      this.accTypeData.PrmMutualAidMinBalance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      })
    );
    this.CustomerServiceForm.controls['ProductCondition'].setValue(
      this.accTypeData.ProductCondition
    );
    this.CustomerServiceForm.controls['ProductInterestType'].setValue(
      this.accTypeData.ProductInterestType
    );
    this.CustomerServiceForm.controls['ProvBegDate'].setValue(
      this.accTypeData.ProvBegDate
    );
    this.CustomerServiceForm.controls['ProvBegNullDate'].setValue(
      this.accTypeData.ProvBegNullDate
    );
    this.CustomerServiceForm.controls['ProvisionFlag'].setValue(
      this.accTypeData.ProvisionFlag
    );
    this.CustomerServiceForm.controls['RecordFlag'].setValue(
      this.accTypeData.RecordFlag
    );
    this.CustomerServiceForm.controls['RenewalFlag'].setValue(
      this.accTypeData.RenewalFlag
    );
    this.CustomerServiceForm.controls['RoundFlag'].setValue(
      this.accTypeData.RoundFlag
    );
    this.CustomerServiceForm.controls['ShareGuaranteeMonth'].setValue(
      this.accTypeData.ShareGuaranteeMonth
    );
    this.CustomerServiceForm.controls['ShareGuaranteeNo'].setValue(
      this.accTypeData.ShareGuaranteeNo
    );
    this.CustomerServiceForm.controls['SurityPictureFrom'].setValue(
      this.accTypeData.SurityPictureFrom
    );
    var title = this.dataList.find(
      (x) => x.AccTypeCode == this.accTypeData.AccTypeCode
    ).AccTypeDescription;
    this.slabService.data.AccountTitle = title;
    this.slabService.data.BenefitBy = this.accTypeData.BenefitBy;
    this.slabService.data.TypeClass = this.accTypeData.AccTypeClass;
    this.slabService.data.TypeCode = this.accTypeData.AccTypeCode;
    console.log('AccType:', accType);
    if (accType == 0) {
      this.accTypeData.BtnUpdate = false;
      this.CustomerServiceForm.controls['AccTypeCode'].setValue('');
    }
  }
  submitData() {
    if (confirm('Are you sure you want to Insert information?')) {
      if (this.CustomerServiceForm.value.AccType != '') {
        this.spinner.show();
        console.log('This is submit data', this.CustomerServiceForm.value);
        this.houseKeepingService
          .PerameterControlCustomerServiceSubmit(this.CustomerServiceForm.value)
          .pipe(first())
          .subscribe(
            (x: any) => {
              if (x == 1) {
                this.spinner.hide();
                alert('Data Submitted Successfully.!');
              } else {
                this.toastr.error("Error Data didn't updated!", 'Error');
              }
              this.spinner.show();
              this.ngOnInit();
              location.reload();
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
            }
          );
      } else {
        alert('Please Select An Account Type');
      }
    }
  }
  updateData() {
    if (confirm('Are you sure you want to Update information?')) {
      if (this.CustomerServiceForm.value.AccType != '') {
        this.spinner.show();
        console.log('This is submit data', this.CustomerServiceForm.value);
        this.CustomerServiceForm.value.ProvBegDate = this.datepipe.transform(this.CustomerServiceForm.value.ProvBegDate, 'yyyy-MM-dd');
        this.houseKeepingService
          .PerameterControlCustomerServiceUpdate(this.CustomerServiceForm.value)
          .pipe(first())
          .subscribe(
            (x: any) => {
              if (x == 1) {
                this.spinner.hide();
                alert('Data Updated Successfully.!');
              } else {
                this.toastr.error("Error Data didn't updated!", 'Error');
              }
              this.spinner.show();
              this.ngOnInit();
              location.reload();
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
            }
          );
      } else {
        alert('Please Select An Account Type');
      }
    }
  }

  slabData() {
    console.log(this.accTypeData.AccTypeClass);
    if (this.accTypeData.AccTypeClass == 7) {
      const modalRef = this.modalService.open(SlabMaintainLoanComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        windowClass: 'my-modal',
      });
    } else {
      const modalRef = this.modalService.open(
        SlabMaintainDepositAndSchemeComponent,
        {
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
          windowClass: 'my-modal2',
        }
      );
    }
  }
  exitPage() {
    this.router.navigate(['housekeeping/']);
  }
}
