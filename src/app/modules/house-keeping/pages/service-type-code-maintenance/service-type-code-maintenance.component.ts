import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-service-type-code-maintenance',
  templateUrl: './service-type-code-maintenance.component.html',
  styleUrls: ['./service-type-code-maintenance.component.css'],
})
export class ServiceTypeCodeMaintenanceComponent implements OnInit {
  dataList: any[] = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  displayTabularData: boolean = false;
  selectedCode: any = null;
  ServiceTypeCodeForm: FormGroup;

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
    this.ServiceTypeCodeForm = new FormGroup({
      ServiceType: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
      ServiceName: new FormControl('', [Validators.required]),
    });
  }

  // Service Type Code Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .getDataList('ServiceType')
      .pipe(first())
      .subscribe(
        (x: any[]) => {
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
          x.ServiceType == this.ServiceTypeCodeForm.get('ServiceType').value
      );
      if (selectedCode) {
        this.ServiceTypeCodeForm.patchValue({
          selectedOptionCode: selectedCode.ServiceType,
          ServiceName: selectedCode.ServiceName,
        });
        this.selectedCode = selectedCode.ServiceType;
        this.submitButtonText = 'Update';
      } else {
        this.ServiceTypeCodeForm.patchValue({
          selectedOptionCode: 0,
          ServiceType: '',
          ServiceName: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`ServiceName`).focus();
  };

  // ServiceType

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.ServiceType == ChangeSelectedOption
      );
      this.ServiceTypeCodeForm.patchValue({
        selectedOptionCode: selectedCode.ServiceType,
        ServiceName:
          selectedCode.ServiceType == 0 ? '' : selectedCode.ServiceName,
        ServiceType:
          selectedCode.ServiceType == 0 ? '' : selectedCode.ServiceType,
      });
      this.selectedCode = selectedCode.ServiceType;
      this.submitButtonText =
        selectedCode.ServiceType == 0 ? 'Submit' : 'Update';
      console.log(selectedCode);
    }
    document.getElementById(`ServiceName`).focus();
  }

  saveOrUpdate = () => {
    if (this.ServiceTypeCodeForm.value.ServiceName == '') {
      this.toastr.warning('You Must Fillup Description Field !', 'Warning');
    } else {
      this.spinner.show();
      var formValue = this.ServiceTypeCodeForm.value;
      if (formValue.ServiceType == '') formValue.ServiceType = 0;
      this.houseKeepingService
        .insert('ServiceType', formValue)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.getDataList();
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
