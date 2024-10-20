import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-profit-and-loss-appropriation',
  templateUrl: './profit-and-loss-appropriation.component.html',
  styleUrls: ['./profit-and-loss-appropriation.component.css'],
})
export class ProfitAndLossAppropriationComponent implements OnInit {
  ProvAndLossForm: FormGroup;
  selectedCode: any = null;
  glProvCodeList: any = [];
  glExpCodeList: any = [];
  AllData: any = [];
  updateBtn: boolean = false;
  submitBtn: boolean = false;

  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.GetGlProvCode();
    this.GetGlExpCode();
    this.GetStoredData();
  }

  private initializeForm() {
    this.ProvAndLossForm = new FormGroup({
      Id: new FormControl(''),
      ProvCode: new FormControl(''),
      ProvCodeSelect: new FormControl('0'),
      ProvCodeDesc: new FormControl(''),
      ExpCode: new FormControl(''),
      ExpCodeSelect: new FormControl('0'),
      ExpCodeDesc: new FormControl(''),
      Rate: new FormControl(''),
    });
    this.submitBtn = true;
    this.updateBtn = false;
  }

  // enter key events

  onEnterProvCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`ExpCode`).focus();
  }

  onEnterExpCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`rate`).focus();
  }

  GetGlProvCode = () => {
    this.spinner.show();
    this.accountingService
      .GetGlProvCode()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.glProvCodeList = x;
          console.log('This is profit value ', this.glProvCodeList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  changeSelectValue = (e: any) => {
    let ChangeSelectedOption = e.target.value;
    if (e.target.value.length === 6) {
      var selectedValue = this.glProvCodeList.find(
        (x) => x.GLAccNo.toString().slice(2, 8) == ChangeSelectedOption
      );
      this.ProvAndLossForm.patchValue({
        ProvCodeSelect: selectedValue.GLAccNo,
        ProvCodeDesc: selectedValue.Description,
        ProvCode: selectedValue.GLAccNo == 0 ? '' : selectedValue.GLAccNo,
      });
    } else if (e.target.value.length === 8) {
      var selectedValue = this.glProvCodeList.find(
        (x) => x.GLAccNo == ChangeSelectedOption
      );
      this.ProvAndLossForm.patchValue({
        ProvCodeSelect: selectedValue.GLAccNo,
        ProvCodeDesc: selectedValue.Description,
        ProvCode: selectedValue.GLAccNo == 0 ? '' : selectedValue.GLAccNo,
      });
    } else {
      if (!e.target.value) return;
      this.toastr.warning('Invalid GL Code !', 'Warning');
      this.ProvAndLossForm.controls['ProvCode'].setValue('');
    }
  };

  selectChangeHandler(event: any) {
    console.log(event.target.value);
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      var selectedValue = this.glProvCodeList.find(
        (x) => x.GLAccNo == ChangeSelectedOption
      );
      this.ProvAndLossForm.patchValue({
        ProvCodeSelect: selectedValue.GLAccNo,
        ProvCodeDesc: selectedValue.Description,
        ProvCode: selectedValue.GLAccNo == 0 ? '' : selectedValue.GLAccNo,
      });
    }
    document.getElementById(`ExpCode`).focus();
  }
  GetGlExpCode = () => {
    this.spinner.show();
    this.accountingService
      .GetGlExpCode()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.glExpCodeList = x;
          console.log('This is expensive List', this.glExpCodeList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  expenseCodeChangeHandler = (e: any) => {
    let ChangeSelectedOption = e.target.value;
    if (e.target.value.length === 6) {
      var selectedValue = this.glExpCodeList.find(
        (x) => x.GLAccNo.toString().slice(2, 8) == ChangeSelectedOption
      );
      this.ProvAndLossForm.patchValue({
        ExpCodeSelect: selectedValue.GLAccNo,
        ExpCodeDesc: selectedValue.Description,
        ExpCode: selectedValue.GLAccNo == 0 ? '' : selectedValue.GLAccNo,
      });
    } else if (e.target.value.length === 8) {
      var selectedValue = this.glExpCodeList.find(
        (x) => x.GLAccNo == ChangeSelectedOption
      );
      this.ProvAndLossForm.patchValue({
        ExpCodeSelect: selectedValue.GLAccNo,
        ExpCodeDesc: selectedValue.Description,
        ExpCode: selectedValue.GLAccNo == 0 ? '' : selectedValue.GLAccNo,
      });
    } else {
      if (!e.target.value) return;
      this.toastr.warning('Invalid GL Code !', 'Warning');
      this.ProvAndLossForm.controls['ExpCode'].setValue('');
    }
  };
  // Select handler Exp code
  selectExpChangeHandler(event: any) {
    console.log(event.target.value);
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let val = this.glExpCodeList.find(
        (x) => x.GLAccNo == ChangeSelectedOption
      );
      this.ProvAndLossForm.patchValue({
        ExpCodeSelect: val.GLAccNo,
        ExpCodeDesc: val.Description,
        ExpCode: val.GLAccNo == 0 ? '' : val.GLAccNo,
      });
    }
    document.getElementById(`rate`).focus();
  }

  Saveinfo = () => {
    if (this.ProvAndLossForm.value.ProvCode == '') {
      alert('Select Prov Code');
      return;
    } else if (this.ProvAndLossForm.value.ExpCode == '') {
      alert('Select ExpCode Code');
    } else if (this.ProvAndLossForm.value.Rate == '') {
      alert('Please Enter Rate');
    } else {
      this.spinner.show();
      var formValue = this.ProvAndLossForm.value;
      this.accountingService
        .SaveInfo(formValue)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            console.log(x);
            this.GetStoredData();
            this.initializeForm();
            alert('Data Save Successfully');
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            alert('Something Went Wrong');
          }
        );
    }
  };

  GetStoredData = () => {
    this.spinner.show();
    this.accountingService
      .GetStoredData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.AllData = x;
          console.log('This is AllData List', this.AllData);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  DeleteData = (item: any) => {
    if (confirm('Are you sure to want to delete the data?')) {
      this.spinner.show();
      this.accountingService
        .Delete(item.Id)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.GetStoredData();
            alert('Data Deleted');
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  };
  patchValue(item: any) {
    let val = this.AllData.find((x) => x.Id == item.Id);
    if (val) {
      this.ProvAndLossForm.controls['ProvCode'].setValue(val.ProvCode);
      this.ProvAndLossForm.controls['ProvCodeSelect'].setValue(val.ProvCode);
      this.ProvAndLossForm.controls['ProvCodeDesc'].setValue(val.ProvCodeDesc);
      this.ProvAndLossForm.controls['ExpCode'].setValue(val.ExpCode);
      this.ProvAndLossForm.controls['ExpCodeSelect'].setValue(val.ExpCode);
      this.ProvAndLossForm.controls['ExpCodeDesc'].setValue(val.ExpCodeDesc);
      this.ProvAndLossForm.controls['Rate'].setValue(val.Rate);
      this.ProvAndLossForm.controls['Id'].setValue(val.Id);
      this.updateBtn = true;
      this.submitBtn = false;
    }
  }

  Updateinfo = () => {
    this.spinner.show();
    var formValue = this.ProvAndLossForm.value;
    this.accountingService
      .UpdateInfo(formValue)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          console.log(x);
          this.initializeForm();
          this.GetStoredData();
          alert('Data Update Successfully');
          this.submitBtn = true;
          this.updateBtn = false;
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          alert('Something Went Wrong');
        }
      );
  };
}
