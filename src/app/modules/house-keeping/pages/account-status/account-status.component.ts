import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

//Model
import { AccountStatusCode } from '../../../Models/HoseKeepingModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-status',
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.css'],
})
export class AccountStatusComponent implements OnInit {
  dataList: AccountStatusCode[] = [];
  submitButtonTextUpdate: boolean = false;
  submitButtonTextSubmit: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  AccountStatusCodeForm: FormGroup;

  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.submitButtonTextSubmit = true;
    this.getDataList();
    this.initializeForm();
  }

  private initializeForm() {
    this.AccountStatusCodeForm = new FormGroup({
      AccStatusCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      AccStatusDescription: new FormControl('', [Validators.required]),
    });
  }

  // Account Status Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('AccountStatusCode')
      .pipe(first())
      .subscribe(
        (x: AccountStatusCode[]) => {
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
          x.AccStatusCode ==
          this.AccountStatusCodeForm.get('AccStatusCode').value
      );
      if (selectedCode) {
        this.AccountStatusCodeForm.patchValue({
          selectedOptionCode: selectedCode.AccStatusCode,
          AccStatusDescription: selectedCode.AccStatusDescription,
        });
        this.selectedCode = selectedCode.AccStatusCode;
        this.submitButtonTextSubmit = false;
        this.submitButtonTextUpdate = true;
      } else {
        this.AccountStatusCodeForm.patchValue({
          selectedOptionCode: 0,
        });
        this.submitButtonTextSubmit = true;
        this.submitButtonTextUpdate = false;
      }
      console.log(selectedCode);
    }
  };

  // AccStatusCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.AccStatusCode == ChangeSelectedOption
      );
      this.AccountStatusCodeForm.patchValue({
        selectedOptionCode: selectedCode.AccStatusCode,
        AccStatusDescription:
          selectedCode.AccStatusCode == 0
            ? ''
            : selectedCode.AccStatusDescription,
        AccStatusCode:
          selectedCode.AccStatusCode == 0 ? '' : selectedCode.AccStatusCode,
      });
      this.selectedCode = selectedCode.AccStatusCode;
      if (selectedCode.AccStatusCode == 0) {
        this.submitButtonTextSubmit = true;
        this.submitButtonTextUpdate = false;
      } else {
        this.submitButtonTextSubmit = false;
        this.submitButtonTextUpdate = true;
      }
      console.log(selectedCode);
    }
  }

  //Insert and Update data

  save = () => {
    if (confirm('You are sure to want to save information?')) {
      if (this.AccountStatusCodeForm.invalid) {
        alert('You Must Fillup Required Field !');
      } else {
        this.spinner.show();
        var formValue = this.AccountStatusCodeForm.value;
        this.houseKeepingService
          .insert('AccountStatusCode', formValue)
          .pipe(first())
          .subscribe(
            (x: AccountStatusCode[]) => {
              this.getDataList();
              this.initializeForm();
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
            }
          );
      }
    }
  };

  update = () => {
    if (confirm('You are sure to want to update information?')) {
      if (this.AccountStatusCodeForm.invalid) {
        alert('You Must Fillup Required Field !');
      } else {
        this.spinner.show();
        var formValue = this.AccountStatusCodeForm.value;
        this.houseKeepingService
          .updateAccStatus('AccountStatusCode', formValue)
          .pipe(first())
          .subscribe(
            (x: AccountStatusCode[]) => {
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
      }
    }
  };
}
