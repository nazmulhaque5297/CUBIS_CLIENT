import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

//Model
import { MemberRejectedCode } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-reject-note',
  templateUrl: './member-reject-note.component.html',
  styleUrls: ['./member-reject-note.component.css'],
})
export class MemberRejectNoteComponent implements OnInit {
  dataList: MemberRejectedCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  MemberRejectedCodeForm: FormGroup;

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
    this.MemberRejectedCodeForm = new FormGroup({
      MRejectCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      MRejectDescription: new FormControl('', [Validators.required]),
    });
  }

  // Get Member rejeted note Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('MemberRejectCode')
      .pipe(first())
      .subscribe(
        (x: MemberRejectedCode[]) => {
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
          x.MRejectCode == this.MemberRejectedCodeForm.get('MRejectCode').value
      );
      if (selectedCode) {
        this.MemberRejectedCodeForm.patchValue({
          selectedOptionCode: selectedCode.MRejectCode,
          MRejectDescription: selectedCode.MRejectDescription,
        });
        this.selectedCode = selectedCode.MRejectCode;
        this.submitButtonText = 'Update';
      } else {
        this.MemberRejectedCodeForm.patchValue({
          selectedOptionCode: 0,
          MRejectCode: '',
          MRejectDescription: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`MRejectDescription`).focus();
  };

  // MRejectCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.MRejectCode == ChangeSelectedOption
      );
      this.MemberRejectedCodeForm.patchValue({
        selectedOptionCode: selectedCode.MRejectCode,
        MRejectDescription:
          selectedCode.MRejectCode == 0 ? '' : selectedCode.MRejectDescription,
        MRejectCode:
          selectedCode.MRejectCode == 0 ? '' : selectedCode.MRejectCode,
      });
      this.selectedCode = selectedCode.MRejectCode;
      this.submitButtonText =
        selectedCode.MRejectCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`MRejectDescription`).focus();
  }

  // Insert and Update Member reject note data
  saveOrUpdate = () => {
    if (this.MemberRejectedCodeForm.value.MRejectDescription == '') {
      alert('You Must Fillup Description Field !');
    } else {
      this.spinner.show();
      var formValue = this.MemberRejectedCodeForm.value;
      if (formValue.MRejectCode == '') formValue.MRejectCode = 0;
      this.houseKeepingService
        .insert('MemberRejectCode', formValue)
        .pipe(first())
        .subscribe(
          (x: MemberRejectedCode[]) => {
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
