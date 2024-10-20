import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import {
  ThanaDataRecModel,
  UpizilaDataRecModel,
} from '../../models/member-application.model';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-thana-code-maintenance',
  templateUrl: './thana-code-maintenance.component.html',
  styleUrls: ['./thana-code-maintenance.component.css'],
})
export class ThanaCodeMaintenanceComponent implements OnInit {
  divisionList = [];
  districtList = [];
  upzilaList = [];
  thanaList = [];
  viewTableData = [];
  submitButtonText: string = 'Submit';
  ThanaCodeForm: FormGroup;
  selectedCode: any = null;

  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getDivisionList();
  }

  private initializeForm() {
    this.ThanaCodeForm = new FormGroup({
      DivisionCode: new FormControl(''),
      DivisionDescription: new FormControl('0'),
      DistrictCode: new FormControl(''),
      DistDescription: new FormControl('0'),
      UpzilaCode: new FormControl(''),
      UpzilaDist: new FormControl('0'),
      ThanaCode: new FormControl('0'),
      ThanaDescription: new FormControl(''),
      ThanaDescriptionBang: new FormControl(''),
      DivisionOrgCode: new FormControl(''),
      DistrictOrgCode: new FormControl(''),
      UpzilaOrgCode: new FormControl(''),
      ThanaOrgCode: new FormControl(''),
    });
  }
  // Get All Division  Code Data
  getDivisionList = () => {
    this.spinner.show();
    this.accountingService
      .getDivisionCodeInfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.divisionList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  changeSelectValue = (e) => {
    this.sentDiviCode(e.target.value);
    if (e.target.value) {
      let selectedCode = this.divisionList.find(
        (x) => x.DivisionCode == this.ThanaCodeForm.get('DivisionCode').value
      );
      if (selectedCode) {
        this.ThanaCodeForm.patchValue({
          DivisionDescription: selectedCode.DivisionCode,
          DivisionOrgCode: selectedCode.DivisionOrgCode,
        });
        this.selectedCode = selectedCode.DivisionCode;
      } else {
        this.ThanaCodeForm.patchValue({
          DivisionDescription: 0,
          DivisionCode: '',
        });
      }
      console.log(selectedCode);
    }
    document.getElementById(`DistrictCode`).focus();
  };

  selectChangeHandler(event: any) {
    this.sentDiviCode(event.target.value);
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.divisionList.find(
        (x) => x.DivisionCode == ChangeSelectedOption
      );
      this.ThanaCodeForm.patchValue({
        DivisionDescription: selectedCode.DivisionCode,
        DivisionCode:
          selectedCode.DivisionCode == 0 ? '' : selectedCode.DivisionCode,
        DivisionOrgCode: selectedCode.DivisionOrgCode,
      });
      this.selectedCode = selectedCode.DivisionCode;
      console.log(selectedCode);
    }
    document.getElementById(`DistrictCode`).focus();
  }

  sentDiviCode = (value: any) => {
    console.log(
      'This is form data',
      this.ThanaCodeForm.value.DivisionDescription
    );
    this.spinner.show();
    this.accountingService
      .sentDiviCode(value)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.districtList = x;
          console.log('This is response', this.districtList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  distChangeHandler(event: any) {
    this.getUpizila(event.target.value);
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.districtList.find(
        (x) => x.DistrictCode == ChangeSelectedOption
      );
      this.ThanaCodeForm.patchValue({
        DistDescription: selectedCode.DistrictCode,
        DistrictCode:
          selectedCode.DistrictCode == 0 ? '' : selectedCode.DistrictCode,
        UpzilaDescription: '',
        DistrictOrgCode: selectedCode.DistrictOrgCode,
      });
      this.selectedCode = selectedCode.DistrictCode;
      console.log(selectedCode);
    }
    document.getElementById(`UpzilaCode`).focus();
  }

  changedistValue = (e) => {
    this.getUpizila(e.target.value);
    if (e.target.value) {
      let selectedCode = this.districtList.find(
        (x) => x.DistrictCode == this.ThanaCodeForm.get('DistrictCode').value
      );
      if (selectedCode) {
        this.ThanaCodeForm.patchValue({
          DistDescription: selectedCode.DistrictCode,
          DistrictOrgCode: selectedCode.DistrictOrgCode,
        });
        this.selectedCode = selectedCode.DistrictCode;
      } else {
        this.ThanaCodeForm.patchValue({
          DistDescription: 0,
          DistrictCode: '',
        });
      }
      console.log(selectedCode);
    }
    document.getElementById(`UpzilaCode`).focus();
  };
  getUpizila(value: any) {
    var n = new UpizilaDataRecModel();
    n.Divicode = this.ThanaCodeForm.value.DivisionDescription;
    n.Distcode = value;
    this.accountingService
      .getUpizila(n)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.upzilaList = x;
          console.log('This is upizilla response', this.upzilaList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  changeUpizilaValue = (e) => {
    this.getThana(e.target.value);
    if (e.target.value) {
      let selectedCode = this.upzilaList.find(
        (x) => x.UpzilaCode == this.ThanaCodeForm.get('UpzilaCode').value
      );
      if (selectedCode) {
        this.ThanaCodeForm.patchValue({
          UpzilaDist: selectedCode.UpzilaCode,
          UpzilaOrgCode: selectedCode.UpzilaOrgCode,
          ThanaOrgCode: selectedCode.ThanaOrgCode,
        });
        this.selectedCode = selectedCode.UpzilaCode;
      } else {
        this.ThanaCodeForm.patchValue({
          UpzilaDist: 0,
          UpzilaCode: '',
        });
      }
      console.log(selectedCode);
    }
    document.getElementById(`ThanaCode`).focus();
  };
  upizilaChangeHandler(event: any) {
    this.getThana(event.target.value);
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.upzilaList.find(
        (x) => x.UpzilaCode == ChangeSelectedOption
      );
      this.ThanaCodeForm.patchValue({
        UpzilaDist: selectedCode.UpzilaCode,
        UpzilaCode: selectedCode.UpzilaCode == 0 ? '' : selectedCode.UpzilaCode,
        UpzilaOrgCode: selectedCode.UpzilaOrgCode,
        ThanaOrgCode: selectedCode.ThanaOrgCode,
      });
      this.selectedCode = selectedCode.UpzilaCode;
      console.log(selectedCode);
    }
    document.getElementById(`ThanaCode`).focus();
  }

  getThana(value: any) {
    var n = new ThanaDataRecModel();
    n.DivisionCode = this.ThanaCodeForm.value.DivisionDescription;
    n.DistrictCode = this.ThanaCodeForm.value.DistDescription;
    n.UpzilaCode = value;
    this.accountingService
      .getThana(n)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.thanaList = x;
          console.log('This is Thana  response', this.thanaList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  viewDescription() {
    console.log('viewDescription Clicked');
    let selectedCode = this.thanaList.find(
      (x) => x.ThanaCode == this.ThanaCodeForm.get('ThanaCode').value
    );
    if (selectedCode) {
      console.log('If condition');
      this.ThanaCodeForm.patchValue({
        ThanaDescription: selectedCode.ThanaDescription,
        ThanaDescriptionBang: selectedCode.ThanaDescriptionBang,
        ThanaOrgCode: selectedCode.ThanaOrgCode,
      });
      this.submitButtonText = 'Update';
    } else {
      console.log('else condition');
      this.ThanaCodeForm.patchValue({
        ThanaDescription: '',
        ThanaDescriptionBang: '',
      });
      this.submitButtonText = 'Submit';
    }
  }

  saveOrUpdate = () => {
    this.spinner.show();
    var formValue = this.ThanaCodeForm.value;
    console.log('This is district code', formValue);
    if (formValue.ThanaCode == '') formValue.ThanaCode = 0;
    this.accountingService
      .insertThanaInfo(formValue)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          console.log('Successfull');
          this.getThana(formValue.UpzilaCode);
          setTimeout(
            () => this.viewTabularData(),
            100
          );
          this.initializeForm();
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          console.log('Error');
        }
      );
  };

  viewTabularData() {
    this.viewTableData = this.thanaList;
  }
}
