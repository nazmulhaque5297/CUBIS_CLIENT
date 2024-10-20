import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { BankCodeModel } from 'src/app/modules/Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-bank-code-maintenance',
  templateUrl: './bank-code-maintenance.component.html',
  styleUrls: ['./bank-code-maintenance.component.css'],
})
export class BankCodeMaintenanceComponent implements OnInit {
  dataList: BankCodeModel[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  BankCodeForm: FormGroup;

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
    this.BankCodeForm = new FormGroup({
      BankCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      BankName: new FormControl('', [Validators.required]),
    });
  }

  // Professional Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('BankCode')
      .pipe(first())
      .subscribe(
        (x: BankCodeModel[]) => {
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
        (x) => x.BankCode == this.BankCodeForm.get('BankCode').value
      );
      if (selectedCode) {
        this.BankCodeForm.patchValue({
          selectedOptionCode: selectedCode.BankCode,
          BankName: selectedCode.BankName,
        });
        this.selectedCode = selectedCode.BankCode;
        this.submitButtonText = 'Update';
      } else {
        this.BankCodeForm.patchValue({
          selectedOptionCode: 0,
          BankCode: '',
          BankName: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`BankName`).focus();
  };

  // BankCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.BankCode == ChangeSelectedOption
      );
      this.BankCodeForm.patchValue({
        selectedOptionCode: selectedCode.BankCode,
        BankName: selectedCode.BankCode == 0 ? '' : selectedCode.BankName,
        BankCode: selectedCode.BankCode == 0 ? '' : selectedCode.BankCode,
      });
      this.selectedCode = selectedCode.BankCode;
      this.submitButtonText = selectedCode.BankCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`BankName`).focus();
  }

  saveOrUpdate = () => {
    if (this.BankCodeForm.value.BankName == '') {
      alert('You Must Fillup Description Field !');
    } else {
      this.spinner.show();
      var formValue = this.BankCodeForm.value;
      if (formValue.BankCode == '') formValue.BankCode = 0;
      this.houseKeepingService
        .InserBankData(formValue)
        .pipe(first())
        .subscribe(
          (x: BankCodeModel[]) => {
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
