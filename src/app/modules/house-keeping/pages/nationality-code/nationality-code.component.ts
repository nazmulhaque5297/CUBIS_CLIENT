import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

//Model
import { NationalityCode } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-nationality-code',
  templateUrl: './nationality-code.component.html',
  styleUrls: ['./nationality-code.component.css'],
})
export class NationalityCodeComponent implements OnInit {
  dataList: NationalityCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  NationalityCodeForm: FormGroup;

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
    this.NationalityCodeForm = new FormGroup({
      NationalityCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      NationalityDescription: new FormControl('', [Validators.required]),
    });
  }

  // Nationality Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('NationalityCode')
      .pipe(first())
      .subscribe(
        (x: NationalityCode[]) => {
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
          x.NationalityCode ==
          this.NationalityCodeForm.get('NationalityCode').value
      );
      if (selectedCode) {
        this.NationalityCodeForm.patchValue({
          selectedOptionCode: selectedCode.NationalityCode,
          NationalityDescription: selectedCode.NationalityDescription,
        });
        this.selectedCode = selectedCode.NationalityCode;
        this.submitButtonText = 'Update';
      } else {
        this.NationalityCodeForm.patchValue({
          selectedOptionCode: 0,
          NationalityCode: '',
          NationalityDescription: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`NationalityDescription`).focus();
  };

  // NationalityCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.NationalityCode == ChangeSelectedOption
      );
      this.NationalityCodeForm.patchValue({
        selectedOptionCode: selectedCode.NationalityCode,
        NationalityDescription:
          selectedCode.NationalityCode == 0
            ? ''
            : selectedCode.NationalityDescription,
        NationalityCode:
          selectedCode.NationalityCode == 0 ? '' : selectedCode.NationalityCode,
      });
      this.selectedCode = selectedCode.NationalityCode;
      this.submitButtonText =
        selectedCode.NationalityCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`NationalityDescription`).focus();
  }

  //Insert and Update Nationality code
  saveOrUpdate = () => {
    if (this.NationalityCodeForm.value.NationalityDescription == '') {
      alert('You Must Fillup Description Field !');
    } else {
      this.spinner.show();
      var formValue = this.NationalityCodeForm.value;
      if (formValue.NationalityCode == '') formValue.NationalityCode = 0;
      this.houseKeepingService
        .insert('NationalityCode', formValue)
        .pipe(first())
        .subscribe(
          (x: NationalityCode[]) => {
            this.getDataList();
            alert('Data Saved Succesfully');
            this.initializeForm();
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  };
}
