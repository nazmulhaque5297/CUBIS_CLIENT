import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

//Model
import { NatureCode } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nature-code',
  templateUrl: './nature-code.component.html',
  styleUrls: ['./nature-code.component.css'],
})
export class NatureCodeComponent implements OnInit {
  dataList: NatureCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  NatureCodeForm: FormGroup;

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
    this.NatureCodeForm = new FormGroup({
      NatureCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      NatureDescription: new FormControl('', [Validators.required]),
    });
  }

  // Get Nature Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('NatureCode')
      .pipe(first())
      .subscribe(
        (x: NatureCode[]) => {
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
        (x) => x.NatureCode == this.NatureCodeForm.get('NatureCode').value
      );
      if (selectedCode) {
        this.NatureCodeForm.patchValue({
          selectedOptionCode: selectedCode.NatureCode,
          NatureDescription: selectedCode.NatureDescription,
        });
        this.selectedCode = selectedCode.NatureCode;
        this.submitButtonText = 'Update';
      } else {
        this.NatureCodeForm.patchValue({
          selectedOptionCode: 0,
          NatureCode: '',
          NatureDescription: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`NatureDescription`).focus();
  };

  // NatureCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.NatureCode == ChangeSelectedOption
      );
      this.NatureCodeForm.patchValue({
        selectedOptionCode: selectedCode.NatureCode,
        NatureDescription:
          selectedCode.NatureCode == 0 ? '' : selectedCode.NatureDescription,
        NatureCode: selectedCode.NatureCode == 0 ? '' : selectedCode.NatureCode,
      });
      this.selectedCode = selectedCode.NatureCode;
      this.submitButtonText =
        selectedCode.NatureCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`NatureDescription`).focus();
  }

  //Insert and Update Nature code data

  saveOrUpdate = () => {
    if (this.NatureCodeForm.value.NatureDescription == '') {
      alert('You Must Fillup Description Field !');
    } else {
      this.spinner.show();
      var formValue = this.NatureCodeForm.value;
      if (formValue.NatureCode == '') formValue.NatureCode = 0;
      this.houseKeepingService
        .insert('NatureCode', formValue)
        .pipe(first())
        .subscribe(
          (x: NatureCode[]) => {
            this.getDataList();
            alert('Data saved successfully');
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
