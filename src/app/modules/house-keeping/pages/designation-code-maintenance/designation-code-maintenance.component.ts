import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { DesignationCode } from 'src/app/modules/Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-designation-code-maintenance',
  templateUrl: './designation-code-maintenance.component.html',
  styleUrls: ['./designation-code-maintenance.component.css'],
})
export class DesignationCodeMaintenanceComponent implements OnInit {
  dataList: DesignationCode[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  DesignationCodeForm: FormGroup;

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
    this.DesignationCodeForm = new FormGroup({
      DesignationCode: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      DesignationDescription: new FormControl('', [Validators.required]),
    });
  }

  // Professional Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDesignationCode()
      .pipe(first())
      .subscribe(
        (x: DesignationCode[]) => {
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
          x.DesignationCode ==
          this.DesignationCodeForm.get('DesignationCode').value
      );
      if (selectedCode) {
        this.DesignationCodeForm.patchValue({
          selectedOptionCode: selectedCode.DesignationCode,
          DesignationDescription: selectedCode.DesignationDescription,
        });
        this.selectedCode = selectedCode.DesignationCode;
        this.submitButtonText = 'Update';
      } else {
        this.DesignationCodeForm.patchValue({
          selectedOptionCode: 0,
          DesignationCode: '',
          DesignationDescription: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`DesignationDescription`).focus();
  };

  // ProfessionCode

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.DesignationCode == ChangeSelectedOption
      );
      this.DesignationCodeForm.patchValue({
        selectedOptionCode: selectedCode.DesignationCode,
        DesignationDescription:
          selectedCode.DesignationCode == 0
            ? ''
            : selectedCode.DesignationDescription,
        DesignationCode:
          selectedCode.DesignationCode == 0 ? '' : selectedCode.DesignationCode,
      });
      this.selectedCode = selectedCode.DesignationCode;
      this.submitButtonText =
        selectedCode.DesignationCode == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`DesignationDescription`).focus();
  }

  saveOrUpdate = () => {
    if (this.DesignationCodeForm.value.DesignationDescription == '') {
      alert('You Must Fillup Description Field !');
    } else {
      this.spinner.show();
      var formValue = this.DesignationCodeForm.value;
      if (formValue.DesignationCode == '') formValue.DesignationCode = 0;
      this.houseKeepingService
        .InserDesignationData(formValue)
        .pipe(first())
        .subscribe(
          (x: DesignationCode[]) => {
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
