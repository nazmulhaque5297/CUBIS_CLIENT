import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-parameter-control-maintenance',
  templateUrl: './parameter-control-maintenance.component.html',
  styleUrls: ['./parameter-control-maintenance.component.css'],
})
export class ParameterControlMaintenanceComponent implements OnInit {
  PerameterControlForm: FormGroup;
  dataList = [];
  infoList = [];
  selectedCode: any = [];
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.GetDropDownData();
    this.GetallParameterCtrl();
    this.initializeForm();
  }

  private initializeForm() {
    this.PerameterControlForm = new FormGroup({
      AccountTypeClass: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
    });
  }

  // Get dropdown value

  GetDropDownData = () => {
    this.spinner.show();
    this.houseKeepingService
      .getparameterdropdownvalue()
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

  //Get all information Parameter type Control

  GetallParameterCtrl = () => {
    this.spinner.show();
    this.houseKeepingService
      .ParameterCtrlgetAllinfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.infoList = x;
          console.log(this.infoList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  changeSelectValue = (e) => {
    if (this.PerameterControlForm.value) {
      let selectedCode = this.dataList.find(
        (x) =>
          x.AccountTypeClass ==
          this.PerameterControlForm.get('AccountTypeClass').value
      );
      if (selectedCode) {
        this.PerameterControlForm.patchValue({
          selectedOptionCode: selectedCode.AccountTypeClass,
        });
        this.spinner.show();
        this.houseKeepingService
          .getAllAssignedSelectedinfo(Number(selectedCode.AccountTypeClass))
          .pipe(first())
          .subscribe(
            (x: any) => {
              this.spinner.hide();
              let data = [];
              this.infoList?.map((info: any) => {
                x.map((item: any) => {
                  if (info?.RecordCode == item?.RecordCode) {
                    item?.RecordFlag == 1
                      ? (info['RecordFlag'] = true)
                      : (info['RecordFlag'] = false);
                    item?.FuncFlag == 1
                      ? (info['FuncFlag'] = true)
                      : (info['FuncFlag'] = false);
                  }
                });
                data.push(info);
              });
              this.infoList = data;
            },
            (err) => {
              this.spinner.hide();
            }
          );
        this.selectedCode = selectedCode.AccountTypeClass;
        this.submitButtonText = 'Update';
      } else {
        this.PerameterControlForm.patchValue({
          selectedOptionCode: 0,
          AccountTypeClass: '',
        });
        this.submitButtonText = 'Submit';
      }
    }
  };

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = this.PerameterControlForm.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.AccountTypeClass == ChangeSelectedOption?.selectedOptionCode
      );
      this.PerameterControlForm.patchValue({
        selectedOptionCode: selectedCode.AccountTypeClass,
        AccountTypeClass:
          selectedCode.AccountTypeClass == 0
            ? ''
            : selectedCode.AccountTypeClass,
      });
      this.spinner.show();
      this.houseKeepingService
        .getAllAssignedSelectedinfo(Number(selectedCode.AccountTypeClass))
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            let data = [];
            this.infoList?.map((info: any) => {
              x.map((item: any) => {
                if (info?.RecordCode == item?.RecordCode) {
                  item?.RecordFlag == 1
                    ? (info['RecordFlag'] = true)
                    : (info['RecordFlag'] = false);
                  item?.FuncFlag == 1
                    ? (info['FuncFlag'] = true)
                    : (info['FuncFlag'] = false);
                }
              });
              data.push(info);
            });
            this.infoList = data;
          },
          (err) => {
            this.spinner.hide();
          }
        );
      console.log(
        'selectedCode.AccountTypeClass',
        selectedCode.AccountTypeClass
      );

      this.selectedCode = selectedCode.AccountTypeClass;
      this.submitButtonText = 'Update';
    }
  }

  RecordFlagCheckHandler = (value) => {
    let list = this.infoList;
    let toBeUpdated = [];
    list.map((x) => {
      if (x.RecordCode == value.RecordCode) {
        x.RecordFlag = !x.RecordFlag;
      }
      toBeUpdated.push(x);
    });
    this.infoList = toBeUpdated;
  };

  FuncFlagCheckHandler = (value) => {
    let list = this.infoList;
    let toBeUpdated = [];
    list.map((x) => {
      if (x.RecordCode == value.RecordCode) {
        x.FuncFlag = !x.FuncFlag;
      }
      toBeUpdated.push(x);
    });
    this.infoList = toBeUpdated;
  };

  updateHandler = () => {
    if (!this.selectedCode) {
      alert('No Account is selected !');
      return;
    }
    if (confirm('Are you sure you want to Update information?')) {
      let list = this.infoList;
      let data:any = [];
      list.map((x) => {
        x?.RecordFlag == true ? (x['RecordFlag'] = 1) : (x['RecordFlag'] = 0);
        x?.FuncFlag == true ? (x['FuncFlag'] = 1) : (x['FuncFlag'] = 0);
        x.ControlCode = 2;
        x.ProductCode = this.selectedCode;
        data.push(x);
      });
      this.spinner.show();
      this.houseKeepingService
        .UpdateSelectedList(data, this.selectedCode)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.toastr.success('Information Updated !', 'Success');
          },
          (err) => {
            this.spinner.hide();
          }
        );
      console.log('this.infoList====', data);
    }
  };
}
