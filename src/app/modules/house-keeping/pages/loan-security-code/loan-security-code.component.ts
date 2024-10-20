import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

//Model
import { LoanSecurityCode } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loan-security-code',
  templateUrl: './loan-security-code.component.html',
  styleUrls: ['./loan-security-code.component.css'],
})
export class LoanSecurityCodeComponent implements OnInit {
  dataList: LoanSecurityCode[] = [];
  submitButtonTextUpdate: boolean = false;
  submitButtonTextSubmit: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  LoanSecurityCodeForm: FormGroup;

  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getDataList();
    this.initializeForm();
  }

  private initializeForm() {
    this.submitButtonTextSubmit = true;
    this.LoanSecurityCodeForm = new FormGroup({
      LSecurityCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      LSecurityDescription: new FormControl(''),
    });
  }

  // Loan Security Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('LoanSecurityCode')
      .pipe(first())
      .subscribe(
        (x: LoanSecurityCode[]) => {
          this.spinner.hide();
          this.dataList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  public getTableReportData() {
    this.displayTabularData = true;
  }

  changeSelectValue = (e) => {
    if (e.target.value) {
      let selectedCode = this.dataList.find(
        (x) =>
          x.LSecurityCode ==
          this.LoanSecurityCodeForm.get('LSecurityCode').value
      );
      if (selectedCode) {
        this.LoanSecurityCodeForm.patchValue({
          selectedOptionCode: selectedCode.LSecurityCode,
          LSecurityDescription: selectedCode.LSecurityDescription,
        });
        this.selectedCode = selectedCode.LSecurityCode;
        this.submitButtonTextSubmit = false;
        this.submitButtonTextUpdate = true;
      } else {
        this.LoanSecurityCodeForm.patchValue({
          selectedOptionCode: 0,
        });
        this.submitButtonTextSubmit = true;
        this.submitButtonTextUpdate = false;
      }
      console.log(selectedCode);
    }
    document.getElementById(`LSecurityDescription`).focus();
  };

  // LSecurityCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.LSecurityCode == ChangeSelectedOption
      );
      this.LoanSecurityCodeForm.patchValue({
        selectedOptionCode: selectedCode.LSecurityCode,
        LSecurityDescription:
          selectedCode.LSecurityCode == 0
            ? ''
            : selectedCode.LSecurityDescription,
        LSecurityCode:
          selectedCode.LSecurityCode == 0 ? '' : selectedCode.LSecurityCode,
      });
      this.selectedCode = selectedCode.LSecurityCode;
      if (selectedCode.LSecurityCode == 0) {
        this.submitButtonTextSubmit = true;
        this.submitButtonTextUpdate = false;
      } else {
        this.submitButtonTextSubmit = false;
        this.submitButtonTextUpdate = true;
      }
      console.log(selectedCode);
    }
    document.getElementById(`LSecurityDescription`).focus();
  }

  //Insert and Update Loan Security code data

  save = () => {
    this.spinner.show();
    var formValue = this.LoanSecurityCodeForm.value;
    this.houseKeepingService
      .insert('LoanSecurityCode', formValue)
      .pipe(first())
      .subscribe(
        (x: LoanSecurityCode[]) => {
          this.getDataList();
          alert('Data Saved Successfully');
          this.initializeForm();
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  update = () => {
    if (confirm('You are sure to want to update information?')) {
      this.spinner.show();
      var formValue = this.LoanSecurityCodeForm.value;
      this.houseKeepingService
        .updateAccStatus('LoanSecurityCode', formValue)
        .pipe(first())
        .subscribe(
          (x: LoanSecurityCode[]) => {
            this.getDataList();
            alert('Data Updated Successfully');
            this.initializeForm();
            this.submitButtonTextSubmit = true;
            this.submitButtonTextUpdate = false;
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  };
}
