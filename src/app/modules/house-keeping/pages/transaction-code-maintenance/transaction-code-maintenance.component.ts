import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
//Model
import { TransactionCode, AccType } from '../../../Models/HoseKeepingModel';

@Component({
  selector: 'app-transaction-code-maintenance',
  templateUrl: './transaction-code-maintenance.component.html',
  styleUrls: ['./transaction-code-maintenance.component.css'],
})
export class TransactionCodeMaintenanceComponent implements OnInit {
  dataList: TransactionCode[] = [];
  dataListAccTypeMode: AccType[] = [];
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  TransactionCodeForm: FormGroup;
  AccTypeModeForm: FormGroup;
  submitOk: boolean = true;
  updateOk: boolean = false;

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
    this.TransactionCodeForm = new FormGroup({
      TrnCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      TrnDescription: new FormControl('', [Validators.required]),
      AccType: new FormControl(''),
      AccTypeMode: new FormControl(''),
    });
    this.AccTypeModeForm = new FormGroup({
      AccTypeCode: new FormControl(''),
      AccTypeMode: new FormControl(''),
    });
  }

  // Transaction type Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('TransactionCode')
      .pipe(first())
      .subscribe(
        (x: TransactionCode[]) => {
          this.spinner.hide();
          this.dataList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
    this.houseKeepingService
      .getAccType('TransactionCode')
      .pipe(first())
      .subscribe(
        (x: AccType[]) => {
          this.spinner.hide();
          this.dataListAccTypeMode = x;
          console.log(this.dataListAccTypeMode);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  public getTableReportData() {
    this.displayTabularData = true;
  }

  // enter key events
  onEnterTrnDescriptionHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`AccType`).focus();
  }

  changeSelectValue = (e) => {
    if (e.target.value) {
      let selectedCode = this.dataList.find(
        (x) => x.TrnCode == this.TransactionCodeForm.get('TrnCode').value
      );
      let selectAcc = this.dataListAccTypeMode.find(
        (x) => x.AccTypeCode == selectedCode.AccType
      );
      if (selectedCode) {
        this.TransactionCodeForm.patchValue({
          selectedOptionCode: selectedCode.TrnCode,
          TrnDescription: selectedCode.TrnDescription,
          AccType: selectedCode.AccType,
          AccTypeMode: selectAcc.AccTypeMode,
        });
        this.selectedCode = selectedCode.TrnCode;
        this.submitOk = false;
        this.updateOk = true;
      } else {
        this.TransactionCodeForm.patchValue({
          selectedOptionCode: 0,
          TrnDescription: '',
          AccType: '',
        });
        this.submitOk = true;
        this.updateOk = false;
      }
    }
    document.getElementById(`TrnDescription`).focus();
  };

  // TrnCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption != 0) {
      let selectedCode = this.dataList.find(
        (x) => x.TrnCode == ChangeSelectedOption
      );
      let selectAcc = this.dataListAccTypeMode.find(
        (x) => x.AccTypeCode == selectedCode.AccType
      );
      this.TransactionCodeForm.patchValue({
        selectedOptionCode: selectedCode.TrnCode,
        TrnDescription:
          selectedCode.TrnCode == 0 ? '' : selectedCode.TrnDescription,
        TrnCode: selectedCode.TrnCode == 0 ? '' : selectedCode.TrnCode,
        AccType: selectedCode.TrnCode == 0 ? '' : selectedCode.AccType,
        AccTypeMode: selectAcc.AccTypeMode,
      });
      this.selectedCode = selectedCode.TrnCode;

      if (selectedCode.TrnCode == 0) {
        this.submitOk = true;
        this.updateOk = false;
      } else {
        this.submitOk = false;
        this.updateOk = true;
      }
    } else {
      this.TransactionCodeForm.patchValue({
        TrnDescription: '',
        TrnCode: '',
        AccType: '',
      });
      this.submitOk = true;
      this.updateOk = false;
    }
    document.getElementById(`TrnDescription`).focus();
  }

  //Insert Update Transaction type data
  insertData = () => {
    if (this.TransactionCodeForm.value.TrnDescription == '') {
      this.toastr.warning('You Must Fillup Description Field !', 'Warning');
    } else {
      this.spinner.show();
      var formValue = this.TransactionCodeForm.value;
      let selectAcc = this.dataListAccTypeMode.find(
        (x) => x.AccTypeCode == formValue.AccType
      );
      if (selectAcc) {
        formValue.AccTypeMode = selectAcc.AccTypeMode;
        this.houseKeepingService
          .insert('TransactionCode', formValue)
          .pipe(first())
          .subscribe(
            (x: TransactionCode[]) => {
              this.getDataList();
              this.initializeForm();
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
            }
          );
      } else {
        this.TransactionCodeForm.patchValue({
          AccType: '',
        });
        this.spinner.hide();
        this.toastr.error('Invalid Account Type!', 'Error');
      }
    }
  };

  updateData = () => {
    if (this.TransactionCodeForm.value.TrnDescription == '') {
      this.toastr.warning('You Must Fillup Description Field !', 'Warning');
    } else {
      this.spinner.show();
      var formValue = this.TransactionCodeForm.value;
      let selectAcc = this.dataListAccTypeMode.find(
        (x) => x.AccTypeCode == formValue.AccType
      );
      if (selectAcc) {
        this.houseKeepingService
          .update('TransactionCode', formValue)
          .pipe(first())
          .subscribe(
            (x: TransactionCode[]) => {
              this.getDataList();
              this.initializeForm();
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
            }
          );
      } else {
        this.TransactionCodeForm.patchValue({
          AccType: '',
        });
        this.spinner.hide();
        this.toastr.error('Invalid Account Type!', 'Error');
      }
    }
  };
}
