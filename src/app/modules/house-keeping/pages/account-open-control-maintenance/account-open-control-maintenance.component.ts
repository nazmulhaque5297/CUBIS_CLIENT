import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-account-open-control-maintenance',
  templateUrl: './account-open-control-maintenance.component.html',
  styleUrls: ['./account-open-control-maintenance.component.css'],
})
export class AccountOpenControlMaintenanceComponent implements OnInit {
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;
  AccountOpenControlForm: FormGroup;
  dataList = [];
  infoList = [];
  selectedCode: any = null;
  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.GetDropDownData();
    this.GetallAcctypeCtrl();
    this.initializeForm();
  }

  private initializeForm() {
    this.AccountOpenControlForm = new FormGroup({
      AccountTypeClass: new FormControl(''),
      selectedOptionCode: new FormControl('0'),
    });
  }

  // Get dropdown value

  GetDropDownData = () => {
    this.spinner.show();
    this.houseKeepingService
      .getdropdownvalue()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.dataList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  //Get all information Account type Control

  GetallAcctypeCtrl = () => {
    this.spinner.show();
    this.houseKeepingService
      .getAllinfo()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.infoList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  changeSelectValue = (e) => {
    if (this.AccountOpenControlForm.value) {
      let selectedCode = this.dataList.find(
        (x) =>
          x.AccountTypeClass ==
          this.AccountOpenControlForm.get('AccountTypeClass').value
      );
      if (selectedCode) {
        this.AccountOpenControlForm.patchValue({
          selectedOptionCode: selectedCode.AccountTypeClass,
        });
        this.spinner.show();
        this.houseKeepingService
          .getAllAssignedSelectedAndReadonlyinfo(
            Number(selectedCode.AccountTypeClass)
          )
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
        this.AccountOpenControlForm.patchValue({
          selectedOptionCode: 0,
          AccountTypeClass: '',
        });
        this.submitButtonText = 'Submit';
      }
    }
  };

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = this.AccountOpenControlForm.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.dataList.find(
        (x) => x.AccountTypeClass == ChangeSelectedOption?.selectedOptionCode
      );
      this.AccountOpenControlForm.patchValue({
        selectedOptionCode: selectedCode.AccountTypeClass,
        AccountTypeClass:
          selectedCode.AccountTypeClass == 0
            ? ''
            : selectedCode.AccountTypeClass,
      });
      this.spinner.show();
      this.houseKeepingService
        .getAllAssignedSelectedAndReadonlyinfo(
          Number(selectedCode.AccountTypeClass)
        )
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
    if (confirm('Are You Sure Want To Update Information?')) {
      let list = this.infoList;
      let data = [];
      list.map((x) => {
        x?.RecordFlag == true ? (x['RecordFlag'] = 1) : (x['RecordFlag'] = 0);
        x?.FuncFlag == true ? (x['FuncFlag'] = 1) : (x['FuncFlag'] = 0);
        x.ControlCode = 1;
        x.ProductCode = this.selectedCode;
        data.push(x);
      });
      this.spinner.show();
      this.houseKeepingService
        .UpdateSelectedAndReadOnlyList(data)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            alert('Information Updated !');
          },
          (err) => {
            this.spinner.hide();
          }
        );
      console.log('this.infoList====', data);
    }
  };
}
