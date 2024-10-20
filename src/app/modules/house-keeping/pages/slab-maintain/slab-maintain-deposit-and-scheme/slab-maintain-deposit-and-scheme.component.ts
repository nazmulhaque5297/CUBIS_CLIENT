import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import {
  AccountTypeClassModel,
  SlabGvDetails52Model,
  SlabGvDetailsModel,
  SlabMaintainDepositAndSchemeLoadDataModel,
  SlabMaintainInsertDataModel,
  SlabMaintainPrematureInsertDataModel,
} from 'src/app/modules/Models/HoseKeepingModel';
import { HouseKeepingService } from '../../../house-keeping.service';
import { SlabMaintainService } from '../../../services/slab-maintain.service';

@Component({
  selector: 'app-slab-maintain-deposit-and-scheme',
  templateUrl: './slab-maintain-deposit-and-scheme.component.html',
  styleUrls: ['./slab-maintain-deposit-and-scheme.component.css'],
})
export class SlabMaintainDepositAndSchemeComponent implements OnInit {
  dataList: SlabGvDetailsModel[] = [];
  dataList52: SlabGvDetails52Model[] = [];
  titleOftheSlab: string;
  btnUpdate: boolean = false;
  btnUpdatePre: boolean = false;
  btnDelete: boolean = false;
  SlabMaintainLoanForm: FormGroup;
  memberTypeEnum: AccountTypeClassModel[] = [];
  slabMaintainLoadData: SlabMaintainDepositAndSchemeLoadDataModel = new SlabMaintainDepositAndSchemeLoadDataModel();
  constructor(
    public activeModal: NgbActiveModal,
    private slabService: SlabMaintainService,
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}
  c;
  ngOnInit(): void {
    this.initializeForm();
    this.titleOftheSlab = this.slabService.data.AccountTitle;
    this.loadData();
  }
  initializeForm() {
    this.SlabMaintainLoanForm = new FormGroup({
      TypeClass: new FormControl(this.slabService.data.TypeClass),
      TypeCode: new FormControl(this.slabService.data.TypeCode),
      SlabFlag: new FormControl('0'),
      PensionRecord: new FormControl('0'),
      PeriodMonth: new FormControl('0'),
      BenefitAmount: new FormControl('0'),
      PensionInterestRate: new FormControl('0'),
      PenalAmount: new FormControl('0'),
      BonusAmount: new FormControl('0'),
      InterestRate: new FormControl('0'),
      MonthBelow: new FormControl('0'),
      SlabId: new FormControl('0')
    });
  }
  loadData() {
    this.houseKeepingService
      .SlabMaintainHelpDataGet(this.slabService.data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log(this.slabService.data.BenefitBy);
          if (
            this.slabService.data.TypeClass == 5 &&
            this.slabService.data.BenefitBy == 2
          ) {
            debugger
            this.dataList52 = x.GvDetails52;
          } else {
            debugger
            this.dataList = x.GvDetails;
          }
          this.slabMaintainLoadData = x;
          console.log(this.slabMaintainLoadData);
        },
        (err) => {
          this.spinner.hide();
        }
      );
    this.houseKeepingService
      .SlabMaintainEnumData()
      .pipe(first())
      .subscribe((x: any) => {
        this.memberTypeEnum = x;
      });
  }
  submitSlabData() {
    if (
      this.SlabMaintainLoanForm.value.SlabFlag == '' ||
      this.SlabMaintainLoanForm.value.SlabFlag == '0'
    ) {
      this.toastr.error('Please Select Member Type!', 'Error');
    } else {
      if (confirm('Are you you want to save information?')) {
        var data = new SlabMaintainInsertDataModel();
        data.BenefitAmount = this.SlabMaintainLoanForm.value.BenefitAmount;
        data.BonusAmount = this.SlabMaintainLoanForm.value.BonusAmount;
        data.PenalAmount = this.SlabMaintainLoanForm.value.PenalAmount;
        data.PensionInterestRate = this.SlabMaintainLoanForm.value.PensionInterestRate;
        data.PensionRecord = this.SlabMaintainLoanForm.value.PensionRecord;
        data.PeriodMonth = this.SlabMaintainLoanForm.value.PeriodMonth;
        data.SlabFlag = this.SlabMaintainLoanForm.value.SlabFlag;
        data.TypeClass = this.SlabMaintainLoanForm.value.TypeClass;
        data.TypeCode = this.SlabMaintainLoanForm.value.TypeCode;
        if (this.dataList.length != 0) {
          console.log(this.dataList);
          debugger
          var selectedCode = this.dataList.find(
            (x) =>
              x.AtyFlag == data.SlabFlag &&
              x.AtyIntRate == data.PensionInterestRate &&
              x.AtyPeriod == data.PeriodMonth &&
              x.AtyRecords == data.PensionRecord &&
              x.AtyMatureAmt == data.BenefitAmount
          );
          if (selectedCode) {
            this.toastr.error('This data is already in the list!', 'Error');
          } else {
            this.houseKeepingService
              .SubmitSlabData(data)
              .pipe(first())
              .subscribe(
                (x: any) => {
                  if (x == 1) {
                    this.toastr.success(
                      'Data submitted successfully!',
                      'Success'
                    );
                    this.loadData();
                    this.initializeForm();
                  } else {
                    this.toastr.error("Error Data didn't submit!", 'Error');
                  }
                },
                (err) => {
                  this.spinner.hide();
                }
              );
          }
        } else {
          var selectedCode2 = this.dataList52.find(
            (x) =>
              x.AtyFlag == data.SlabFlag &&
              x.AtyIntRate == data.PensionInterestRate &&
              x.AtyPeriod == data.PeriodMonth
          );
          if (selectedCode2) {
            this.toastr.error('This data is already in the list!', 'Error');
          } else {
            this.houseKeepingService
              .SubmitSlabData(data)
              .pipe(first())
              .subscribe(
                (x: any) => {
                  if (x == 1) {
                    this.toastr.success(
                      'Data submitted successfully!',
                      'Success'
                    );
                    this.loadData();
                    this.initializeForm();
                  } else {
                    this.toastr.error("Error Data didn't submit!", 'Error');
                  }
                },
                (err) => {
                  this.spinner.hide();
                }
              );
          }
        }
      }
    }
  }

  setUpdateData(data: any) {
    if (Number(data.AtyRecords) == 99) {
      console.log('This is AtyRecord>>>>>', data.AtyRecords);
      this.SlabMaintainLoanForm.controls['InterestRate'].setValue(
        data.AtyIntRate
      );
      this.SlabMaintainLoanForm.controls['SlabId'].setValue(data.Id);
      this.SlabMaintainLoanForm.controls['MonthBelow'].setValue(data.AtyPeriod);
      this.SlabMaintainLoanForm.controls['SlabFlag'].setValue(data.AtyFlag);

      this.SlabMaintainLoanForm.controls['InterestRate'].enable();

      this.SlabMaintainLoanForm.controls['SlabFlag'].disable();
      this.SlabMaintainLoanForm.controls['PensionRecord'].disable();
      this.SlabMaintainLoanForm.controls['PeriodMonth'].disable();
      this.SlabMaintainLoanForm.controls['BenefitAmount'].disable();
      this.SlabMaintainLoanForm.controls['PenalAmount'].disable();
      this.SlabMaintainLoanForm.controls['BonusAmount'].disable();
      this.SlabMaintainLoanForm.controls['MonthBelow'].disable();
      this.SlabMaintainLoanForm.controls['PensionInterestRate'].disable();
      this.btnUpdatePre = true;
    } else {
      console.log('This is AtyRecord>>>>>', data.AtyRecords);
      debugger
      this.SlabMaintainLoanForm.controls['SlabId'].setValue(data.Id);
      this.SlabMaintainLoanForm.controls['SlabFlag'].setValue(data.AtyFlag);
      this.SlabMaintainLoanForm.controls['PensionRecord'].setValue(
        data.AtyRecords
      );
      this.SlabMaintainLoanForm.controls['PeriodMonth'].setValue(
        data.AtyPeriod
      );
      this.SlabMaintainLoanForm.controls['BenefitAmount'].setValue(
        data.AtyMatureAmt
      );
      this.SlabMaintainLoanForm.controls['PenalAmount'].setValue(
        data.AtyPenalAmt
      );
      this.SlabMaintainLoanForm.controls['BonusAmount'].setValue(
        data.AtyBonusAmt
      );

      this.SlabMaintainLoanForm.controls['PensionInterestRate'].setValue(
        data.AtyIntRate
      );
      this.SlabMaintainLoanForm.controls['PensionInterestRate'].enable();

      this.SlabMaintainLoanForm.controls['SlabFlag'].enable();
      this.SlabMaintainLoanForm.controls['PensionRecord'].enable();
      this.SlabMaintainLoanForm.controls['PeriodMonth'].enable();
      this.SlabMaintainLoanForm.controls['BenefitAmount'].enable();
      this.SlabMaintainLoanForm.controls['PenalAmount'].disable();
      this.SlabMaintainLoanForm.controls['BonusAmount'].disable();
      this.SlabMaintainLoanForm.controls['MonthBelow'].disable();
      this.SlabMaintainLoanForm.controls['InterestRate'].disable();
      this.btnUpdate = true;
    }
  }

  deleteSlabData(value: any) {
    if (confirm('Are you you want to delete information?')) {
      var data = new SlabMaintainInsertDataModel();
      data.BenefitAmount = value.AtyMatureAmt;
      data.BonusAmount = value.AtyBonusAmt;
      data.PenalAmount = value.AtyPenalAmt;
      data.PensionInterestRate = value.AtyIntRate;
      data.PensionRecord = value.AtyRecords;
      data.PeriodMonth = value.AtyPeriod;
      data.SlabFlag = value.AtyFlag;
      data.TypeClass = this.slabService.data.TypeClass;
      data.TypeCode = this.slabService.data.TypeCode;
      this.houseKeepingService
        .DeleteSlabData(data)
        .pipe(first())
        .subscribe(
          (x: any) => {
            if (x == 1) {
              this.toastr.success('Data deleted successfully!', 'Success');
              this.loadData();
              this.initializeForm();
            } else {
              this.toastr.error("Error Data didn't deleted!", 'Error');
            }
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }

  setUpdateData52(data: any) {
    this.SlabMaintainLoanForm.controls['PensionInterestRate'].setValue(
      data.AtyIntRate
    );
    this.SlabMaintainLoanForm.controls['PeriodMonth'].setValue(data.AtyPeriod);
    this.SlabMaintainLoanForm.controls['SlabFlag'].setValue(data.AtyFlag);
    this.btnUpdate = true;
  }

  updateSlabData() {
    if (
      this.SlabMaintainLoanForm.value.SlabFlag == '' ||
      this.SlabMaintainLoanForm.value.SlabFlag == '0'
    ) {
      this.toastr.error('Please Select Member Type!', 'Error');
    } else {
      var data = new SlabMaintainInsertDataModel();
      data.BenefitAmount = this.SlabMaintainLoanForm.value.BenefitAmount;
      data.BonusAmount = this.SlabMaintainLoanForm.value.BonusAmount;
      data.PenalAmount = this.SlabMaintainLoanForm.value.PenalAmount;
      data.PensionInterestRate = this.SlabMaintainLoanForm.value.PensionInterestRate;
      data.PensionRecord = this.SlabMaintainLoanForm.value.PensionRecord;
      data.PeriodMonth = this.SlabMaintainLoanForm.value.PeriodMonth;
      data.SlabFlag = this.SlabMaintainLoanForm.value.SlabFlag;
      data.TypeClass = this.SlabMaintainLoanForm.value.TypeClass;
      data.TypeCode = this.SlabMaintainLoanForm.value.TypeCode;
      var selectedCode = this.dataList.find(
        (x) =>
          x.AtyFlag == data.SlabFlag &&
          x.AtyIntRate == data.PensionInterestRate &&
          x.AtyPeriod == data.PeriodMonth &&
          x.AtyRecords == data.PensionRecord &&
          x.AtyMatureAmt == data.BenefitAmount
      );
      if (selectedCode) {
        this.toastr.error('This data is already in the list!', 'Error');
      }else{
        if (confirm('Are you sure, you want to update the information?')) {
          var data = new SlabMaintainInsertDataModel();
          debugger
          data.Id = this.SlabMaintainLoanForm.value.SlabId;
          data.BenefitAmount = this.SlabMaintainLoanForm.value.BenefitAmount;
          data.BonusAmount = this.SlabMaintainLoanForm.value.BonusAmount;
          data.PenalAmount = this.SlabMaintainLoanForm.value.PenalAmount;
          data.PensionInterestRate = this.SlabMaintainLoanForm.value.PensionInterestRate;
          data.PensionRecord = this.SlabMaintainLoanForm.value.PensionRecord;
          data.PeriodMonth = this.SlabMaintainLoanForm.value.PeriodMonth;
          data.SlabFlag = this.SlabMaintainLoanForm.value.SlabFlag;
          data.TypeClass = this.SlabMaintainLoanForm.value.TypeClass;
          data.TypeCode = this.SlabMaintainLoanForm.value.TypeCode;
          this.houseKeepingService
            .UpdateSlabData(data)
            .pipe(first())
            .subscribe(
              (x: any) => {
                if (x == 1) {
                  this.toastr.success('Data updated successfully!', 'Success');
                  this.loadData();
                  this.initializeForm();
                  this.btnUpdate = false;
                  this.btnUpdatePre = false;
                } else {
                  this.toastr.error("Error Data didn't updated!", 'Error');
                }
              },
              (err) => {
                this.spinner.hide();
              }
            );
        }
      }
    }
  }

  submitPrematureData() {
    if (
      this.SlabMaintainLoanForm.value.SlabFlag == '' ||
      this.SlabMaintainLoanForm.value.SlabFlag == '0'
    ) {
      this.toastr.error('Please Select Member Type!', 'Error');
    } else {
      if (confirm('Are you you want to save information?')) {
        var data = new SlabMaintainPrematureInsertDataModel();
        data.InterestRate = this.SlabMaintainLoanForm.value.InterestRate;
        data.MonthBelow = this.SlabMaintainLoanForm.value.MonthBelow;
        data.SlabFlag = this.SlabMaintainLoanForm.value.SlabFlag;
        data.TypeCode = this.slabService.data.TypeCode;
        this.houseKeepingService
          .SubmitPrematureSlabData(data)
          .pipe(first())
          .subscribe(
            (x: any) => {
              if (x == 1) {
                this.toastr.success('Data submitted successfully!', 'Success');
                this.loadData();
                this.initializeForm();
              } else {
                this.toastr.error("Error Data didn't submit!", 'Error');
              }
            },
            (err) => {
              this.spinner.hide();
            }
          );
      }
    }
  }

  updatePrematureData() {
    if (
      this.SlabMaintainLoanForm.value.SlabFlag == '' ||
      this.SlabMaintainLoanForm.value.SlabFlag == '0'
    ) {
      this.toastr.error('Please Select Member Type!', 'Error');
    } else {
      if (confirm('Are you you want to save information?')) {
        var data = new SlabMaintainPrematureInsertDataModel();
        data.InterestRate = this.SlabMaintainLoanForm.value.InterestRate;
        data.MonthBelow = this.SlabMaintainLoanForm.value.MonthBelow;
        data.SlabFlag = this.SlabMaintainLoanForm.value.SlabFlag;
        data.TypeCode = this.slabService.data.TypeCode;
        this.houseKeepingService
          .UpdatePrematureSlabData(data)
          .pipe(first())
          .subscribe(
            (x: any) => {
              if (x == 1) {
                this.toastr.success('Data updated successfully!', 'Success');
                this.loadData();
                this.initializeForm();
                this.btnUpdate = false;
                this.btnUpdatePre = false;
              } else {
                this.toastr.error("Error Data didn't submit!", 'Error');
              }
            },
            (err) => {
              this.spinner.hide();
            }
          );
      }
    }
  }
}
