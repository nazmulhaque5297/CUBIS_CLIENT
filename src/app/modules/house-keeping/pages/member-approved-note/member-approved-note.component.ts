import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { MemberApprovedCode } from '../../../Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-member-approved-note',
  templateUrl: './member-approved-note.component.html',
  styleUrls: ['./member-approved-note.component.css'],
})
export class MemberApprovedNoteComponent implements OnInit {
  dataList: MemberApprovedCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  MemberApprovedCodeForm: FormGroup;

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
    this.MemberApprovedCodeForm = new FormGroup({
      MApproveCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      MApproveDescription: new FormControl('', [Validators.required]),
    });
  }

  //Member Approved note Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('MemberApproveCode')
      .pipe(first())
      .subscribe(
        (x: MemberApprovedCode[]) => {
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
          x.MApproveCode ==
          this.MemberApprovedCodeForm.get('MApproveCode').value
      );
      if (selectedCode) {
        this.MemberApprovedCodeForm.patchValue({
          selectedOptionCode: selectedCode.MApproveCode,
          MApproveDescription: selectedCode.MApproveDescription,
        });
        this.selectedCode = selectedCode.MApproveCode;
        this.submitButtonText = 'Update';
      } else {
        this.MemberApprovedCodeForm.patchValue({
          selectedOptionCode: 0,
          MApproveCode: '',
          MApproveDescription: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`MApproveDescription`).focus();
  };

  // MApproveCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.MApproveCode == ChangeSelectedOption
      );
      this.MemberApprovedCodeForm.patchValue({
        selectedOptionCode: selectedCode.MApproveCode,
        MApproveDescription:
          selectedCode.MApproveCode == 0
            ? ''
            : selectedCode.MApproveDescription,
        MApproveCode:
          selectedCode.MApproveCode == 0 ? '' : selectedCode.MApproveCode,
      });
      this.selectedCode = selectedCode.MApproveCode;
      this.submitButtonText =
        selectedCode.MApproveCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`MApproveDescription`).focus();
  }

  saveOrUpdate = () => {
    if (this.MemberApprovedCodeForm.value.MApproveDescription == '') {
      alert('You Must Fillup Description Field !');
    } else {
      this.spinner.show();
      var formValue = this.MemberApprovedCodeForm.value;
      if (formValue.MApproveCode == '') formValue.MApproveCode = 0;
      this.houseKeepingService
        .insert('MemberApproveCode', formValue)
        .pipe(first())
        .subscribe(
          (x: MemberApprovedCode[]) => {
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
