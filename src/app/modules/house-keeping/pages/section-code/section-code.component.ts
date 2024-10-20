import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { SectionCode } from '../../../Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-section-code',
  templateUrl: './section-code.component.html',
  styleUrls: ['./section-code.component.css'],
})
export class SectionCodeComponent implements OnInit {
  dataList: SectionCode[] = [];
  submitButtonTextUpdate: boolean = false;
  submitButtonTextSubmit: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  SectionCodeForm: FormGroup;

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
    this.SectionCodeForm = new FormGroup({
      SectionCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      SectionName: new FormControl(''),
    });
  }

  // Section Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('SectionCode')
      .pipe(first())
      .subscribe(
        (x: SectionCode[]) => {
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
        (x) => x.SectionCode == this.SectionCodeForm.get('SectionCode').value
      );
      if (selectedCode) {
        this.SectionCodeForm.patchValue({
          selectedOptionCode: selectedCode.SectionCode,
          SectionName: selectedCode.SectionName,
        });
        this.selectedCode = selectedCode.SectionCode;
        this.submitButtonTextSubmit = false;
        this.submitButtonTextUpdate = true;
      } else {
        this.SectionCodeForm.patchValue({
          selectedOptionCode: 0,
        });
        this.submitButtonTextSubmit = true;
        this.submitButtonTextUpdate = false;
      }
      console.log(selectedCode);
    }
    document.getElementById(`SectionName`).focus();
  };

  // SectionCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.SectionCode == ChangeSelectedOption
      );
      this.SectionCodeForm.patchValue({
        selectedOptionCode: selectedCode.SectionCode,
        SectionName:
          selectedCode.SectionCode == 0 ? '' : selectedCode.SectionName,
        SectionCode:
          selectedCode.SectionCode == 0 ? '' : selectedCode.SectionCode,
      });
      this.selectedCode = selectedCode.SectionCode;
      if (selectedCode.SectionCode == 0) {
        this.submitButtonTextSubmit = true;
        this.submitButtonTextUpdate = false;
      } else {
        this.submitButtonTextSubmit = false;
        this.submitButtonTextUpdate = true;
      }
      console.log(selectedCode);
    }
    document.getElementById(`SectionName`).focus();
  }

  save = () => {
    this.spinner.show();
    var formValue = this.SectionCodeForm.value;
    this.houseKeepingService
      .insert('SectionCode', formValue)
      .pipe(first())
      .subscribe(
        (x: SectionCode[]) => {
          this.getDataList();
          this.initializeForm();
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  update = () => {
    this.spinner.show();
    var formValue = this.SectionCodeForm.value;
    this.houseKeepingService
      .updateSection('SectionCode', formValue)
      .pipe(first())
      .subscribe(
        (x: SectionCode[]) => {
          this.getDataList();
          this.initializeForm();
          this.submitButtonTextSubmit = true;
          this.submitButtonTextUpdate = false;
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
}
