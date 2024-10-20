import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { updateDescriptionBody } from './viewmodel/IprofessioncodeDescription';

//Model
import { ProfessionalCode } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-professional-code',
  templateUrl: './professional-code.component.html',
  styleUrls: ['./professional-code.component.css'],
})
export class ProfessionalCodeComponent implements OnInit {
  dataList: ProfessionalCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  ProfessionCodeForm: FormGroup;
  professionCodeFormBody: updateDescriptionBody;

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
    this.ProfessionCodeForm = new FormGroup({
      ProfessionCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      ProfessionDescription: new FormControl('', [Validators.required]),
    });
  }

  // Professional Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('ProfessionCode')
      .pipe(first())
      .subscribe(
        (x: ProfessionalCode[]) => {
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
          x.ProfessionCode ==
          this.ProfessionCodeForm.get('ProfessionCode').value
      );
      if (selectedCode) {
        this.ProfessionCodeForm.patchValue({
          selectedOptionCode: selectedCode.ProfessionCode,
          ProfessionDescription: selectedCode.ProfessionDescription,
        });
        this.selectedCode = selectedCode.ProfessionCode;
        this.submitButtonText = 'Update';
      } else {
        this.ProfessionCodeForm.patchValue({
          selectedOptionCode: 0,
          ProfessionCode: '',
          ProfessionDescription: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`ProfessionDescription`).focus();
  };

  // ProfessionCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.ProfessionCode == ChangeSelectedOption
      );
      this.ProfessionCodeForm.patchValue({
        selectedOptionCode: selectedCode.ProfessionCode,
        ProfessionDescription:
          selectedCode.ProfessionCode == 0
            ? ''
            : selectedCode.ProfessionDescription,
        ProfessionCode:
          selectedCode.ProfessionCode == 0 ? '' : selectedCode.ProfessionCode,
      });
      this.selectedCode = selectedCode.ProfessionCode;
      this.submitButtonText =
        selectedCode.ProfessionCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`ProfessionDescription`).focus();
  }

  saveOrUpdate = () => {
    if (this.ProfessionCodeForm.value.ProfessionDescription == '') {
      alert('You Must Fillup Description Field !');
    } else {
      this.spinner.show();
      var formValue = this.ProfessionCodeForm.value;
      if (formValue.ProfessionCode == '') formValue.ProfessionCode = 0;
      this.houseKeepingService
        .insert('ProfessionCode', formValue)
        .pipe(first())
        .subscribe(
          (x: ProfessionalCode[]) => {
            this.getDataList();
            alert('Data Saved SUccessfully');
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
