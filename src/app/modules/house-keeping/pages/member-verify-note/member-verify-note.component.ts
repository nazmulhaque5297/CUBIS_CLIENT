import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

//Model
import { MemberVerifyCode } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-verify-note',
  templateUrl: './member-verify-note.component.html',
  styleUrls: ['./member-verify-note.component.css'],
})
export class MemberVerifyNoteComponent implements OnInit {
  dataList: MemberVerifyCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  MemberVerifyCodeForm: FormGroup;

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
    this.MemberVerifyCodeForm = new FormGroup({
      MVerifyCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      MVerifyDescription: new FormControl('', [Validators.required]),
    });
  }

  // Get Member verify note  Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('MemberVerifyCode')
      .pipe(first())
      .subscribe(
        (x: MemberVerifyCode[]) => {
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
          x.MVerifyCode == this.MemberVerifyCodeForm.get('MVerifyCode').value
      );
      if (selectedCode) {
        this.MemberVerifyCodeForm.patchValue({
          selectedOptionCode: selectedCode.MVerifyCode,
          MVerifyDescription: selectedCode.MVerifyDescription,
        });
        this.selectedCode = selectedCode.MVerifyCode;
        this.submitButtonText = 'Update';
      } else {
        this.MemberVerifyCodeForm.patchValue({
          selectedOptionCode: 0,
          MVerifyCode: '',
          MVerifyDescription: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`MVerifyDescription`).focus();
  };

  // MVerifyCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.MVerifyCode == ChangeSelectedOption
      );
      this.MemberVerifyCodeForm.patchValue({
        selectedOptionCode: selectedCode.MVerifyCode,
        MVerifyDescription:
          selectedCode.MVerifyCode == 0 ? '' : selectedCode.MVerifyDescription,
        MVerifyCode:
          selectedCode.MVerifyCode == 0 ? '' : selectedCode.MVerifyCode,
      });
      this.selectedCode = selectedCode.MVerifyCode;
      this.submitButtonText =
        selectedCode.MVerifyCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`MVerifyDescription`).focus();
  }

  saveOrUpdate = () => {
    if (this.MemberVerifyCodeForm.value.MVerifyDescription == '') {
      alert('You Must Fillup Description Field !');
    } else {
      this.spinner.show();
      var formValue = this.MemberVerifyCodeForm.value;
      if (formValue.MVerifyCode == '') formValue.MVerifyCode = 0;
      this.houseKeepingService
        .insert('MemberVerifyCode', formValue)
        .pipe(first())
        .subscribe(
          (x: MemberVerifyCode[]) => {
            this.getDataList();
            alert('Data Successfully Saved');
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
