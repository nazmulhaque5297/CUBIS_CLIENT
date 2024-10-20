import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ParameterMaintenanceCustomerServiceDataTypeModel } from '../../../Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-parameter-maintenance-mutual-aid-service',
  templateUrl: './parameter-maintenance-mutual-aid-service.component.html',
  styleUrls: ['./parameter-maintenance-mutual-aid-service.component.css'],
})
export class ParameterMaintenanceMutualAidServiceComponent implements OnInit {
  MutualAidServiceForm: FormGroup;
  dataList: ParameterMaintenanceCustomerServiceDataTypeModel[] = [];
  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeFrom();
  }
  initializeFrom() {
    this.spinner.show();
    this.MutualAidServiceForm = new FormGroup({
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
      MutualAidMinBalance: new FormControl(''),
      MutualAidMaxBalance: new FormControl(''),
      MutualAidFixBalance: new FormControl(''),
    });
    this.loadHelpData();
  }
  loadHelpData() {
    this.houseKeepingService
      .MutualAidServiceHelpData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log(x);
          this.dataList = x;
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  insertData() {
    if (confirm('Are you sure you want to Submit information?')) {
      if (this.MutualAidServiceForm.value.AccTypeCode == '') {
        alert('Enter Account Type!');
      } else {
        let data = {
          MutualAidMinBalance: Number(
            this.MutualAidServiceForm.value.MutualAidMinBalance
          ),
          MutualAidMaxBalance: 
            this.MutualAidServiceForm.value.MutualAidMaxBalance,
          MutualAidFixBalance: Number(
            this.MutualAidServiceForm.value.MutualAidFixBalance
          ),
          AccType: Number(this.MutualAidServiceForm.value.AccType),
        };
        this.houseKeepingService
          .MutualAidServiceSubmitData(data)
          .pipe(first())
          .subscribe(
            (x: any) => {
              if (x == 1) {
                this.ngOnInit();
                alert('Data Submitted Successfully.!');
              } else {
                alert("Error Data didn't submitted!");
              }
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
            }
          );
      }
    }
  }
  selectChangeHandler(event: any) {
    console.log('value', event.target.value);
    this.houseKeepingService
      .MutualAidServiceAccTypeChange(event.target.value)
      .pipe(first())
      .subscribe(
        (x: any) => {
            this.MutualAidServiceForm.controls['AccTypeCode'].setValue(
              event.target.value
            );
            this.MutualAidServiceForm.controls['AccType'].setValue(
              event.target.value
            );
            this.MutualAidServiceForm.controls['MutualAidMinBalance'].setValue(
              x.MutualAidMinBalance.toLocaleString('en-US',{
                minimumFractionDigits:2
              })
            );
            this.MutualAidServiceForm.controls['MutualAidMaxBalance'].setValue(
              x.MutualAidMaxBalance.toLocaleString('en-US',{
                minimumFractionDigits:2
              })
            );
            this.MutualAidServiceForm.controls['MutualAidFixBalance'].setValue(
              x.MutualAidFixBalance.toLocaleString('en-US',{
                minimumFractionDigits:2
              })
            );
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  exitPage() {
    this.router.navigate(['housekeeping/']);
  }
}
