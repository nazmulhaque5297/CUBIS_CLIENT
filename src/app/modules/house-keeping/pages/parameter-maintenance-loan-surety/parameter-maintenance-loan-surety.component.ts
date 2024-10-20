import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import {
  AccountTypeClassModel,
  ParameterMaintenanceCustomerServiceDataTypeModel,
} from '../../../Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-parameter-maintenance-loan-surety',
  templateUrl: './parameter-maintenance-loan-surety.component.html',
  styleUrls: ['./parameter-maintenance-loan-surety.component.css'],
})
export class ParameterMaintenanceLoanSuretyComponent implements OnInit {
  LoanSuretyForm: FormGroup;
  rbtMethod = 1;
  suretyAccDataTypeList: ParameterMaintenanceCustomerServiceDataTypeModel[] = [];
  corrAccDataTypeList: ParameterMaintenanceCustomerServiceDataTypeModel[] = [];
  yesNoEnumList: AccountTypeClassModel[] = [];
  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeFrom();
  }
  loadHelpData() {
    console.log('coming here');
    this.houseKeepingService
      .LoanSuretyHelpData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          var value = '';
          if (x.rbtMethod1 == true) {
            value = '1';
          } else {
            value = '2';
          }
          this.suretyAccDataTypeList = x.AccTypeSuretrydropdown;
          this.corrAccDataTypeList = x.AccTypeCorrdropdown;
          this.yesNoEnumList = x.YesNoEnum;
          this.LoanSuretyForm.controls['rbtMethod1'].setValue(value);
          this.LoanSuretyForm.controls['InterestCalculation'].setValue(
            Number(x.InterestCalculation)
          );
          this.LoanSuretyForm.controls['Penalty'].setValue(Number(x.Penalty).toLocaleString('en-US', {
            minimumFractionDigits: 2,
          }));
          this.LoanSuretyForm.controls['InterestRate'].setValue(
            Number(x.InterestRate).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.LoanSuretyForm.controls['SuretyAccType'].setValue(
            Number(x.SuretyAccType)
          );
          this.LoanSuretyForm.controls['CorrAccType'].setValue(
            Number(x.CorrAccType)
          );
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  initializeFrom() {
    this.spinner.show();
    this.LoanSuretyForm = new FormGroup({
      rbtMethod1: new FormControl('1'),
      InterestCalculation: new FormControl('0'),
      InterestRate: new FormControl('0'),
      Penalty: new FormControl('0'),
      SuretyAccType: new FormControl('0'),
      CorrAccType: new FormControl('0'),
    });
    this.loadHelpData();
  }

  //enter key events
  onEnterInterestRateHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`Penalty`).focus();
  }

  updateData() {
    if (confirm('Are you sure you want to Update information?')) {
      this.LoanSuretyForm.controls['rbtMethod1'].setValue(
        Boolean(this.LoanSuretyForm.value.rbtMethod1)
      );
      this.LoanSuretyForm.controls['InterestCalculation'].setValue(
        Number(this.LoanSuretyForm.value.InterestCalculation)
      );
      this.LoanSuretyForm.controls['InterestRate'].setValue(
        Number(this.LoanSuretyForm.value.InterestRate).toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })
      );
      this.LoanSuretyForm.controls['Penalty'].setValue(
        Number(this.LoanSuretyForm.value.Penalty).toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })
      );
      this.LoanSuretyForm.controls['SuretyAccType'].setValue(
        Number(this.LoanSuretyForm.value.SuretyAccType)
      );
      this.LoanSuretyForm.controls['CorrAccType'].setValue(
        Number(this.LoanSuretyForm.value.CorrAccType)
      );
      this.houseKeepingService
        .LoanSuretyUpdateData(this.LoanSuretyForm.value)
        .pipe(first())
        .subscribe(
          (x: any) => {
            if (x == 1) {
              //this.router.navigate(['housekeeping/']);
              alert('Data Updated Successfully.!');

            } else {
              this.toastr.error("Error Data didn't updated!", 'Error');
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
