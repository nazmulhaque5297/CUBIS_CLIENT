import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

//Model
import { LoanApproveCode } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loan-approved-note',
  templateUrl: './loan-approved-note.component.html',
  styleUrls: ['./loan-approved-note.component.css'],
})
export class LoanApprovedNoteComponent implements OnInit {
  dataList: LoanApproveCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  ApproveCodeForm: FormGroup;

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
    this.ApproveCodeForm = new FormGroup({
      LApproveCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      LApproveDescription: new FormControl('', [Validators.required]),
    });
  }

  // Get Load Approve Note  Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('LoanApprovedCode')
      .pipe(first())
      .subscribe(
        (x: LoanApproveCode[]) => {
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
        (x) => x.LApproveCode == this.ApproveCodeForm.get('LApproveCode').value
      );
      if (selectedCode) {
        this.ApproveCodeForm.patchValue({
          selectedOptionCode: selectedCode.LApproveCode,
          LApproveDescription: selectedCode.LApproveDescription,
        });
        this.selectedCode = selectedCode.LApproveCode;
        this.submitButtonText = 'Update';
      } else {
        this.ApproveCodeForm.patchValue({
          selectedOptionCode: 0,
          LApproveCode: '',
          LApproveDescription: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`LApproveDescription`).focus();
  };

  // LApproveCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.LApproveCode == ChangeSelectedOption
      );
      this.ApproveCodeForm.patchValue({
        selectedOptionCode: selectedCode.LApproveCode,
        LApproveDescription:
          selectedCode.LApproveCode == 0
            ? ''
            : selectedCode.LApproveDescription,
        LApproveCode:
          selectedCode.LApproveCode == 0 ? '' : selectedCode.LApproveCode,
      });
      this.selectedCode = selectedCode.LApproveCode;
      this.submitButtonText =
        selectedCode.LApproveCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`LApproveDescription`).focus();
  }

  saveOrUpdate = () => {
    if (this.ApproveCodeForm.value.LApproveDescription == '') {
      alert('You Must Fillup Description Field !');
    } else {
      this.spinner.show();
      var formValue = this.ApproveCodeForm.value;
      if (formValue.LApproveCode == '') formValue.LApproveCode = 0;
      this.houseKeepingService
        .insert('LoanApprovedCode', formValue)
        .pipe(first())
        .subscribe(
          (x: LoanApproveCode[]) => {
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
