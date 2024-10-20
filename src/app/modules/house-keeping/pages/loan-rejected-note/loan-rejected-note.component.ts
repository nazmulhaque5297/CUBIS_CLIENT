import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

//Model
import { LoanRejectedCode } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-loan-rejected-note',
  templateUrl: './loan-rejected-note.component.html',
  styleUrls: ['./loan-rejected-note.component.css'],
})
export class LoanRejectedNoteComponent implements OnInit {
  dataList: LoanRejectedCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  RejectedCodeForm: FormGroup;

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
    this.RejectedCodeForm = new FormGroup({
      LRejectCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      LRejectDescription: new FormControl('', [Validators.required]),
    });
  }

  // Get Loan Rejected Note Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('RejectCode')
      .pipe(first())
      .subscribe(
        (x: LoanRejectedCode[]) => {
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
        (x) => x.LRejectCode == this.RejectedCodeForm.get('LRejectCode').value
      );
      if (selectedCode) {
        this.RejectedCodeForm.patchValue({
          selectedOptionCode: selectedCode.LRejectCode,
          LRejectDescription: selectedCode.LRejectDescription,
        });
        this.selectedCode = selectedCode.LRejectCode;
        this.submitButtonText = 'Update';
      } else {
        this.RejectedCodeForm.patchValue({
          selectedOptionCode: 0,
          LRejectCode: '',
          LRejectDescription: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`LRejectDescription`).focus();
  };

  // LRejectCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.LRejectCode == ChangeSelectedOption
      );
      this.RejectedCodeForm.patchValue({
        selectedOptionCode: selectedCode.LRejectCode,
        LRejectDescription:
          selectedCode.LRejectCode == 0 ? '' : selectedCode.LRejectDescription,
        LRejectCode:
          selectedCode.LRejectCode == 0 ? '' : selectedCode.LRejectCode,
      });
      this.selectedCode = selectedCode.LRejectCode;
      this.submitButtonText =
        selectedCode.LRejectCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`LRejectDescription`).focus();
  }

  // Loan Rejected Note data Insert and Update
  saveOrUpdate = () => {
    if (this.RejectedCodeForm.value.LRejectDescription == '') {
      alert('You Must Fillup Description Field !');
    } else {
      this.spinner.show();
      var formValue = this.RejectedCodeForm.value;
      if (formValue.LRejectCode == '') formValue.LRejectCode = 0;
      this.houseKeepingService
        .insert('RejectCode', formValue)
        .pipe(first())
        .subscribe(
          (x: LoanRejectedCode[]) => {
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
