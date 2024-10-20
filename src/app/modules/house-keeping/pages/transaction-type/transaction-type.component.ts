import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

//Model
import { TransactionType } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.component.html',
  styleUrls: ['./transaction-type.component.css'],
})
export class TransactionTypeComponent implements OnInit {
  dataList: TransactionType[] = [];
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  TransactionTypeForm: FormGroup;
  submitOk: boolean = true;
  updateOk: boolean = false;

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
    this.TransactionTypeForm = new FormGroup({
      TrnTypeCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      TrnTypeDescription: new FormControl('', [Validators.required]),
    });
  }

  // Transaction type Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('TransactionType')
      .pipe(first())
      .subscribe(
        (x: TransactionType[]) => {
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
          x.TrnTypeCode == this.TransactionTypeForm.get('TrnTypeCode').value
      );
      if (selectedCode) {
        this.TransactionTypeForm.patchValue({
          selectedOptionCode: selectedCode.TrnTypeCode,
          TrnTypeDescription: selectedCode.TrnTypeDescription,
        });
        this.selectedCode = selectedCode.TrnTypeCode;
        this.submitOk = false;
        this.updateOk = true;
      } else {
        this.TransactionTypeForm.patchValue({
          selectedOptionCode: 0,
          TrnTypeDescription: '',
        });
        this.submitOk = true;
        this.updateOk = false;
      }
      console.log(selectedCode);
    }
    document.getElementById(`TrnTypeDescription`).focus();
  };

  // TrnTypeCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.TrnTypeCode == ChangeSelectedOption
      );
      this.TransactionTypeForm.patchValue({
        selectedOptionCode: selectedCode.TrnTypeCode,
        TrnTypeDescription:
          selectedCode.TrnTypeCode == 0 ? '' : selectedCode.TrnTypeDescription,
        TrnTypeCode:
          selectedCode.TrnTypeCode == 0 ? '' : selectedCode.TrnTypeCode,
      });
      this.selectedCode = selectedCode.TrnTypeCode;
      if (selectedCode.TrnTypeCode == 0) {
        this.submitOk = true;
        this.updateOk = false;
      } else {
        this.submitOk = false;
        this.updateOk = true;
      }
      console.log(selectedCode);
    }
    document.getElementById(`TrnTypeDescription`).focus();
  }

  //Insert Update Transaction type data
  insertData = () => {
    if (confirm('You are sure to eant to save information?')) {
      if (this.TransactionTypeForm.invalid) {
        alert('You Must Fillup Required Field !');
      } else {
        this.spinner.show();
        var formValue = this.TransactionTypeForm.value;
        if (formValue.TrnTypeCode == '') formValue.TrnTypeCode = 0;
        this.houseKeepingService
          .insert('TransactionType', formValue)
          .pipe(first())
          .subscribe(
            (x: TransactionType[]) => {
              this.getDataList();
              alert('Data Saved Successfully');
              this.initializeForm();
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
            }
          );
      }
    }
  };

  updateData = () => {
    if (confirm('You are sure to wan to update informations?')) {
      if (this.TransactionTypeForm.value.TrnTypeDescription == '') {
        alert('You Must Fillup Description Field !');
      } else {
        this.spinner.show();
        var formValue = this.TransactionTypeForm.value;
        if (formValue.TrnTypeCode == '') formValue.TrnTypeCode = 0;
        this.houseKeepingService
          .update('TransactionType', formValue)
          .pipe(first())
          .subscribe(
            (x: TransactionType[]) => {
              this.getDataList();
              alert('Data Saved Successfully');
              this.initializeForm();
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
            }
          );
      }
    }
  };
}
