import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

// Model
import { LoanPurposeCode } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loan-purpose',
  templateUrl: './loan-purpose.component.html',
  styleUrls: ['./loan-purpose.component.css'],
})
export class LoanPurposeComponent implements OnInit {
  dataList: LoanPurposeCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  LoanPurposeCodeForm: FormGroup;

  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.submitButtonState = true;
    this.getDataList();
    this.initializeForm();
  }

  private initializeForm() {
    this.submitButtonText = 'Submit';
    this.LoanPurposeCodeForm = new FormGroup({
      LPurposeCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      LPurposeDescription: new FormControl(''),
    });
  }

  // Get Loan Purpose Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('LoanPurpose')
      .pipe(first())
      .subscribe(
        (x: LoanPurposeCode[]) => {
          this.spinner.hide();
          this.dataList = x;
          console.log(this.dataList);
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
          x.LPurposeCode == this.LoanPurposeCodeForm.get('LPurposeCode').value
      );
      if (selectedCode) {
        this.LoanPurposeCodeForm.patchValue({
          selectedOptionCode: selectedCode.LPurposeCode,
          LPurposeDescription: selectedCode.LPurposeDescription,
        });
        this.selectedCode = selectedCode.LPurposeCode;
        this.submitButtonText = 'Update';
      } else {
        this.LoanPurposeCodeForm.patchValue({
          selectedOptionCode: 0,
          LPurposeCode: '',
          LPurposeDescription: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`LPurposeDescription`).focus();
  };

  // LPurposeCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.LPurposeCode == ChangeSelectedOption
      );
      this.LoanPurposeCodeForm.patchValue({
        selectedOptionCode: selectedCode.LPurposeCode,
        LPurposeDescription:
          selectedCode.LPurposeCode == 0
            ? ''
            : selectedCode.LPurposeDescription,
        LPurposeCode:
          selectedCode.LPurposeCode == 0 ? '' : selectedCode.LPurposeCode,
      });
      this.selectedCode = selectedCode.LPurposeCode;
      this.submitButtonText =
        selectedCode.LPurposeCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`LPurposeDescription`).focus();
  }
  //Insert and Update Loan Purpose code maintenance
  saveOrUpdate = () => {
    this.spinner.show();
    var formValue = this.LoanPurposeCodeForm.value;
    if (formValue.LPurposeCode == '') formValue.LPurposeCode = 0;
    this.houseKeepingService
      .insert('LoanPurpose', formValue)
      .pipe(first())
      .subscribe(
        (x: LoanPurposeCode[]) => {
          this.getDataList();
          alert('Data Saved Succesfully');
          this.initializeForm();
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
}
