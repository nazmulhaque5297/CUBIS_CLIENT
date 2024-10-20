import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { SMSControlGridModel } from '../../../Models/HoseKeepingModel';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-parameter-maintenance-sms-control',
  templateUrl: './parameter-maintenance-sms-control.component.html',
  styleUrls: ['./parameter-maintenance-sms-control.component.css'],
})
export class ParameterMaintenanceSmsControlComponent implements OnInit {
  dataList: SMSControlGridModel[] = [];
  smsPortNo: string;
  SMSControlForm: FormGroup;
  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHelpData();
    this.initializeForm();
  }
  loadHelpData() {
    this.spinner.show();
    this.houseKeepingService
      .SMSControlHelpData()
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log(x);
          this.dataList = x.SMSControlGrid;
          this.smsPortNo = x.SMSPortNo;
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  initializeForm() {
    var data = this.dataList;
    this.SMSControlForm = new FormGroup({
      SMSPortNo: new FormControl(''),
      SMSControlGrid: new FormControl(),
    });
  }
  changeCheck(num: any) {
    if (this.dataList[num].CheckBox == true) {
      this.dataList[num].CheckBox = false;
    } else {
      this.dataList[num].CheckBox = true;
    }
  }
  exitPage() {
    this.router.navigate(['housekeeping/']);
  }
  allMark() {
    for (var i = 0; i < this.dataList.length; i++) {
      this.dataList[i].CheckBox = true;
    }
  }
  allUnMark() {
    for (var i = 0; i < this.dataList.length; i++) {
      this.dataList[i].CheckBox = false;
    }
  }
  insertData() {
    if (confirm('Are you sure you want to Update information?')) {
      let data = {
        SMSPortNo: this.smsPortNo,
        SMSControlGrid: this.dataList,
      };
      this.spinner.show();
      this.houseKeepingService
        .SMSControlSubmitData(data)
        .pipe(first())
        .subscribe(
          (x: any) => {
            if (x == 1) {
              this.ngOnInit();
              alert('Data Submitted Successfully.!');
            } else {
              this.toastr.error("Error Data didn't submitted!", 'Error');
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
