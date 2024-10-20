import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

//Model
import { LoanVerifyCode } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loan-verify-note',
  templateUrl: './loan-verify-note.component.html',
  styleUrls: ['./loan-verify-note.component.css'],
})
export class LoanVerifyNoteComponent implements OnInit {
  dataList: LoanVerifyCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  VerifyCodeForm: FormGroup;

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
    this.VerifyCodeForm = new FormGroup({
      LVerifyCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      LVerifyDescription: new FormControl('', [Validators.required]),
    });
  }

  // Get Loan Verify Note Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('LoanVerifyCode')
      .pipe(first())
      .subscribe(
        (x: LoanVerifyCode[]) => {
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
        (x) => x.LVerifyCode == this.VerifyCodeForm.get('LVerifyCode').value
      );
      if (selectedCode) {
        this.VerifyCodeForm.patchValue({
          selectedOptionCode: selectedCode.LVerifyCode,
          LVerifyDescription: selectedCode.LVerifyDescription,
        });
        this.selectedCode = selectedCode.LVerifyCode;
        this.submitButtonText = 'Update';
      } else {
        this.VerifyCodeForm.patchValue({
          selectedOptionCode: 0,
          LVerifyCode: '',
          LVerifyDescription: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`LVerifyDescription`).focus();
  };

  // LVerifyCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.LVerifyCode == ChangeSelectedOption
      );
      this.VerifyCodeForm.patchValue({
        selectedOptionCode: selectedCode.LVerifyCode,
        LVerifyDescription:
          selectedCode.LVerifyCode == 0 ? '' : selectedCode.LVerifyDescription,
        LVerifyCode:
          selectedCode.LVerifyCode == 0 ? '' : selectedCode.LVerifyCode,
      });
      this.selectedCode = selectedCode.LVerifyCode;
      this.submitButtonText =
        selectedCode.LVerifyCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`LVerifyDescription`).focus();
  }

  //Insert and Update loan verfy note data
  saveOrUpdate = () => {
    if (this.VerifyCodeForm.value.LVerifyDescription == '') {
      alert('You Must Fillup Description Field !');
    } else {
      this.spinner.show();
      var formValue = this.VerifyCodeForm.value;
      if (formValue.LVerifyCode == '') formValue.LVerifyCode = 0;
      this.houseKeepingService
        .insert('LoanVerifyCode', formValue)
        .pipe(first())
        .subscribe(
          (x: LoanVerifyCode[]) => {
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
  };
}
