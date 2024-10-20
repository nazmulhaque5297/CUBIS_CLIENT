import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-district-code-maintenance',
  templateUrl: './district-code-maintenance.component.html',
  styleUrls: ['./district-code-maintenance.component.css'],
})
export class DistrictCodeMaintenanceComponent implements OnInit {
  module: string = '1';
  submitButtonText: string = 'Submit';
  displayTabularData: boolean = false;
  divisionList = [];
  districtList = [];
  viewTableData = [];
  selectedCode: any = null;
  DistrictCodeForm: FormGroup;
  constructor(
    private accountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getDivisionList();
    this.viewDetails();
    this.initializeForm();
  }

  private initializeForm() {
    this.submitButtonText = 'Submit';
    this.DistrictCodeForm = new FormGroup({
      DivisionCode: new FormControl(''),
      DistrictDescription: new FormControl('', [Validators.required]),
      DivisionDescription: new FormControl('0'),
      DistrictCode: new FormControl('0'),
      DistDescriptionBang: new FormControl(''),
      DivisionOrgCode: new FormControl(''),
      DistrictOrgCode: new FormControl(''),
    });
  }

  public getTableReportData() {
    console.log('This is table');
    this.displayTabularData = true;
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
          console.log("divi list",this.divisionList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  sentDiviCode = () => {
    this.spinner.show();
    this.accountingService
      .sentDiviCode(this.DistrictCodeForm.value.DivisionCode)
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
      return this.districtList;
  };

  changeSelectValue = (e) => {
    if (e.target.value) {
      let selectedCode = this.divisionList.find(
        (x) => x.DivisionCode == this.DistrictCodeForm.get('DivisionCode').value
      );
      if (selectedCode) {
        this.DistrictCodeForm.patchValue({
          DivisionDescription: selectedCode.DivisionCode,
          DistDescriptionBang :  selectedCode.DistDescriptionBang,
          DivisionOrgCode: selectedCode.DivisionOrgCode,
        });
        this.selectedCode = selectedCode.DivisionCode;
      } else {
        this.DistrictCodeForm.patchValue({
          DivisionDescription: 0,
          DivisionCode: '',
          DistDescriptionBang: ''
        });
      }
      console.log(selectedCode);
      this.sentDiviCode();
    }
  };

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.divisionList.find(
        (x) => x.DivisionCode == ChangeSelectedOption
      );
      this.DistrictCodeForm.patchValue({
        DivisionDescription: selectedCode.DivisionCode,
        DivisionCode:
          selectedCode.DivisionCode == 0 ? '' : selectedCode.DivisionCode,
        DistrictDescription: '',
        DivisionOrgCode: selectedCode.DivisionOrgCode,
       
      });
      this.selectedCode = selectedCode.DivisionCode;
      this.sentDiviCode();
    }
  }

  viewDescription() {
    let selectedCode = this.districtList.find(
      (x) => x.DistrictCode == this.DistrictCodeForm.get('DistrictCode').value
    );
    if (selectedCode) {
      console.log(selectedCode);
      this.DistrictCodeForm.patchValue({
        DistrictDescription: selectedCode.DestrictDiscription,
        DistDescriptionBang: selectedCode.DivisionCode == 0 ?'': selectedCode.DistDescriptionBang,
        DistrictOrgCode: selectedCode.DistrictOrgCode,
      });
      this.submitButtonText = 'Update';
    } else {
      this.DistrictCodeForm.patchValue({
        DistrictDescription: '',
        DistDescriptionBang: ''
      });
      this.submitButtonText = 'Submit';
    }
  }

  viewDetails() {
    console.log('This is details', this.districtList);
    this.viewTableData = this.districtList;
  }

  saveOrUpdate = () => {
    if (this.DistrictCodeForm.value.DistrictDescription == '') {
      this.toastr.warning('You Must Fillup Description Field !', 'Warning');
    } else {
      this.spinner.show();
      var formValue = this.DistrictCodeForm.value;
      console.log('This is district code', formValue);
      if (formValue.DistrictCode == '') formValue.DistrictCode = 0;
      this.accountingService
        .insertInfo(formValue)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.sentDiviCode();
            setTimeout(
              () => this.viewDetails(),
              100
            );
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
