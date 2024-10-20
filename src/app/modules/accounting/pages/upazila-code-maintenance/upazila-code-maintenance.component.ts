import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { UpizilaDataRecModel } from '../../models/member-application.model';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-upazila-code-maintenance',
  templateUrl: './upazila-code-maintenance.component.html',
  styleUrls: ['./upazila-code-maintenance.component.css'],
})
export class UpazilaCodeMaintenanceComponent implements OnInit {
  submitButtonText: string = 'Submit';
  divisionList = [];
  districtList = [];
  upzilaList = [];
  viewTableData = [];
  selectedCode: any = null;
  UpzilaCodeForm: FormGroup;

  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getDivisionList();
  }

  private initializeForm() {
    this.submitButtonText = 'Submit';
    this.UpzilaCodeForm = new FormGroup({
      DistrictCode: new FormControl(''),
      DivisionCode: new FormControl(''),
      UpzilaDescription: new FormControl(''),
      UpzilaDescriptionBang: new FormControl(''),
      DistDescription: new FormControl('0'),
      DivisionDescription: new FormControl('0'),
      UpzilaCode: new FormControl('0'),
      DivisionOrgCode: new FormControl(''),
      DistrictOrgCode: new FormControl(''),
      UpzilaOrgCode: new FormControl(''),
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
          console.log('this is division list');
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  sentDiviCode = (value: any) => {
    console.log(
      'This is form data',
      this.UpzilaCodeForm.value.DivisionDescription
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

  selectChangeHandler(event: any) {
    this.sentDiviCode(event.target.value);
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.divisionList.find(
        (x) => x.DivisionCode == ChangeSelectedOption
      );
      this.UpzilaCodeForm.patchValue({
        DivisionDescription: selectedCode.DivisionCode,
        DivisionCode:
          selectedCode.DivisionCode == 0 ? '' : selectedCode.DivisionCode,
        DistrictCode: '',
        UpzilaCode: '0',
        UpzilaDescription: '',
        DivisionOrgCode: selectedCode.DivisionOrgCode,
      });
      this.selectedCode = selectedCode.DivisionCode;
      console.log(selectedCode);
    }
    document.getElementById(`DistrictCode`).focus();
  }

  changeSelectValue = (e) => {
    this.sentDiviCode(e.target.value);

    if (e.target.value) {
      let selectedCode = this.divisionList.find(
        (x) => x.DivisionCode == this.UpzilaCodeForm.get('DivisionCode').value
      );

      if (selectedCode) {
        this.UpzilaCodeForm.patchValue({
          DivisionDescription: selectedCode.DivisionCode,
          DivisionOrgCode: selectedCode.DivisionOrgCode,
        });
        this.selectedCode = selectedCode.DivisionCode;
      } else {
        this.UpzilaCodeForm.patchValue({
          DivisionDescription: 0,
          DivisionCode: '',
        });
      }
      console.log(selectedCode);
    }
    document.getElementById(`DistrictCode`).focus();
  };

  distChangeHandler(event: any) {
    this.getUpizila(event.target.value);
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.districtList.find(
        (x) => x.DistrictCode == ChangeSelectedOption
      );
      this.UpzilaCodeForm.patchValue({
        DistDescription: selectedCode.DistrictCode,
        DistrictCode:
          selectedCode.DistrictCode == 0 ? '' : selectedCode.DistrictCode,
        UpzilaDescription: '',
        DistrictOrgCode: selectedCode.DistrictOrgCode,
        UpzilaOrgCode: selectedCode.UpzilaOrgCode,
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
        (x) => x.DistrictCode == this.UpzilaCodeForm.get('DistrictCode').value
      );
      if (selectedCode) {
        this.UpzilaCodeForm.patchValue({
          DistDescription: selectedCode.DistrictCode,
          DistrictOrgCode: selectedCode.DistrictOrgCode,
          UpzilaOrgCode: selectedCode.UpzilaOrgCode,
        });
        this.selectedCode = selectedCode.DistrictCode;
      } else {
        this.UpzilaCodeForm.patchValue({
          DistDescription: 0,
          DistrictCode: '',
        });
      }
      console.log(selectedCode);
    }
    document.getElementById(`UpzilaCode`).focus();
  };

  getUpizila(value:any) {
    var n = new UpizilaDataRecModel();
    n.Divicode = this.UpzilaCodeForm.value.DivisionDescription;
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

  viewTabularData() {
    this.viewTableData = this.upzilaList;
    console.log("this is data", this.viewTableData);
  }
  viewDescription() {
    console.log('viewDescription Clicked');
    let selectedCode = this.upzilaList.find(
      (x) => x.UpzilaCode == this.UpzilaCodeForm.get('UpzilaCode').value
    );
    if (selectedCode) {
      console.log('If condition');
      this.UpzilaCodeForm.patchValue({
        UpzilaDescription: selectedCode.UpzilaDescription,
        UpzilaDescriptionBang: selectedCode.UpzilaDescriptionBang,
        UpzilaOrgCode: selectedCode.UpzilaOrgCode,
      });
      this.submitButtonText = 'Update';
    } else {
      console.log('else condition');
      this.UpzilaCodeForm.patchValue({
        UpzilaDescription: '',
        UpzilaDescriptionBang: '',
      });
      this.submitButtonText = 'Submit';
    }
  }
  saveOrUpdate = () => {
    this.spinner.show();
    var formValue = this.UpzilaCodeForm.value;
    console.log('This is district code', formValue);
    if (formValue.UpzilaCode == '') formValue.UpzilaCode = 0;
    this.accountingService
      .insertUpzilizaInfo(formValue)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.getUpizila(formValue.DistrictCode);
          setTimeout(
            () => this.viewTabularData(),
            100
          );
          this.initializeForm();
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
}
