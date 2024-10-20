import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { cashCollection } from '../../models/holiday-setup-model';

@Component({
  selector: 'app-personnal-ledger-report-control',
  templateUrl: './personnal-ledger-report-control.component.html',
  styleUrls: ['./personnal-ledger-report-control.component.css'],
})
export class PersonnalLedgerReportControlComponent implements OnInit {
  dataList = [];
  info = [];
  checkedList = [];
  PersonnalLedgerReportControlForm: FormGroup;
  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.GetPayType();
  }
  private initializeForm() {
    this.PersonnalLedgerReportControlForm = new FormGroup({
      columns: new FormControl('0'),
      columnsName: new FormControl(''),
    });
  }

  GetPayType = () => {
    this.spinner.show();
    this.houseKeepingService
      .PayTypeList()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.dataList = x;
          console.log(this.dataList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  GetExistingList = (e) => {
    let data = e.target.value;
    this.spinner.show();
    this.houseKeepingService
      .ExistingListPR(data)
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log(x);
          for (var i = 0; i < x.length; i++) {
            let value = {
              Check: false,
              Enable: false,
              PayType: x[i].PayType,
              PayTypeDes: x[i].PayTypeDes,
              RepColumns: this.PersonnalLedgerReportControlForm.value.columns,
              RepColumnsName:
                this.PersonnalLedgerReportControlForm.value.columnsName,
            };
            this.checkedList.push(value);
          }
          if (x[0] != null) {
            this.PersonnalLedgerReportControlForm.controls[
              'columnsName'
            ].setValue(x[0].RepColumnsName);
          } else {
            this.PersonnalLedgerReportControlForm.controls[
              'columnsName'
            ].setValue('');
          }
          console.log(x);
          if (x.length > 0) {
            for (var i = 0; i < this.dataList.length; i++) {
              let selected = this.dataList.find(
                (p) => p.PayType == x[i].PayType
              );
              if (selected) {
                this.dataList[i].permission = true;
                this.dataList[i].Check = true;
              } else {
                this.dataList[i].permission = false;
                this.dataList[i].Check = false;
              }
            }
          } else {
            for (var i = 0; i < this.dataList.length; i++) {
              this.dataList[i].permission = false;
              this.dataList[i].Check = false;
            }
          }
          console.log(this.dataList);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  postAcctype(data: any) {
    console.log(data);
    let selectedCode = this.checkedList.find((x) => x.PayType == data.PayType);
    let value = {
      Check: false,
      Enable: false,
      PayType: data.PayType,
      PayTypeDes: data.PayTypeDes,
      RepColumns: this.PersonnalLedgerReportControlForm.value.columns,
      RepColumnsName: this.PersonnalLedgerReportControlForm.value.columnsName,
    };
    console.log(selectedCode);
    if (!selectedCode) {
      value.Check = true;
      this.checkedList.push(value);
    } else {
      this.checkedList = this.checkedList.filter(
        (item) => item.PayType != data.PayType
      );
    }
    console.log('This is checked value', this.checkedList);
  }

  submit() {
    this.spinner.show();
    console.log('this is value');
    var value = new cashCollection();
    value.RepColumnName =
      this.PersonnalLedgerReportControlForm.value.columnsName;
    value.RepColumns = this.PersonnalLedgerReportControlForm.value.columns;
    value.CheckedValue = this.checkedList;
    console.log('this is sumit cal', value);

    this.houseKeepingService
      .SubmitPR(value)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          location.reload();
          alert('Data Updated');
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
}
