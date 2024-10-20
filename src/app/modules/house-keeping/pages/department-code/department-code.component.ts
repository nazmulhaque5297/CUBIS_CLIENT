import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { DepartmentCode } from '../../../Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-department-code',
  templateUrl: './department-code.component.html',
  styleUrls: ['./department-code.component.css'],
})
export class DepartmentCodeComponent implements OnInit {
  dataList: DepartmentCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  DepartmentCodeForm: FormGroup;

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
    this.DepartmentCodeForm = new FormGroup({
      DepartmentCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      DepartmentName: new FormControl('', [Validators.required]),
    });
  }

  // Department Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('DepartmentCode')
      .pipe(first())
      .subscribe(
        (x: DepartmentCode[]) => {
          this.spinner.hide();
          this.dataList = x;
          console.log(this.getDataList);
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
          x.DepartmentCode ==
          this.DepartmentCodeForm.get('DepartmentCode').value
      );
      if (selectedCode) {
        this.DepartmentCodeForm.patchValue({
          selectedOptionCode: selectedCode.DepartmentCode,
          DepartmentName: selectedCode.DepartmentName,
        });
        this.selectedCode = selectedCode.DepartmentCode;
        this.submitButtonText = 'Update';
      } else {
        this.DepartmentCodeForm.patchValue({
          selectedOptionCode: 0,
          DepartmentCode: '',
          DepartmentName: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`DepartmentName`).focus();
  };

  // DepartmentCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.DepartmentCode == ChangeSelectedOption
      );
      this.DepartmentCodeForm.patchValue({
        selectedOptionCode: selectedCode.DepartmentCode,
        DepartmentName:
          selectedCode.DepartmentCode == 0 ? '' : selectedCode.DepartmentName,
        DepartmentCode:
          selectedCode.DepartmentCode == 0 ? '' : selectedCode.DepartmentCode,
      });
      this.selectedCode = selectedCode.DepartmentCode;
      this.submitButtonText =
        selectedCode.DepartmentCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`DepartmentName`).focus();
  }

  saveOrUpdate = () => {
    if (this.DepartmentCodeForm.value.DepartmentName == '') {
      this.toastr.warning('You Must Fillup Description Field !', 'Warning');
    } else {
      this.spinner.show();
      var formValue = this.DepartmentCodeForm.value;
      if (formValue.DepartmentCode == '') formValue.DepartmentCode = 0;
      this.houseKeepingService
        .insert('DepartmentCode', formValue)
        .pipe(first())
        .subscribe(
          (x: DepartmentCode[]) => {
            this.getDataList();
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
