import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { AccountTypeClassModel } from './../../../Models/HoseKeepingModel';
import { AccountingService } from './../../services/accounting.service';
import { IApplicationCommonModel, UserInfo } from 'src/app/Models/Common.model';
import { Store, select } from '@ngrx/store';
import { getCommonData, getUserInfo } from 'src/app/selector/user.selectors';

@Component({
  selector: 'app-account-status-change',
  templateUrl: './account-status-change.component.html',
  styleUrls: ['./account-status-change.component.css'],
})
export class AccountStatusChangeComponent implements OnInit {
  AccountStatusChangeForm: FormGroup;
  updateButtonText: string = 'Update';
  MemNo: string = '';
  MemType: string = '';
  AccType: string = '';
  AccountNo: string = '';
  AccountNos: string[] = [];
  Id: string = '';
  MemInfoList = [];
  accTypeList = [];
  accStatusList = [];
  AccInfo: any = {};
  commonData: IApplicationCommonModel;
  constructor(
    private AccountingService: AccountingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAccountTypeList();
    this.getAccountStatusList();
    this.store
      .pipe(select(getCommonData))
      .subscribe((commonData: IApplicationCommonModel) => {
        this.commonData = commonData;
        this.AccountStatusChangeForm.controls['StatusDate'].setValue(
          this.commonData?.ProcessDate
        );
      });
  }

  private initializeForm() {
    this.AccountStatusChangeForm = new FormGroup({
      MemberNo: new FormControl(''),
      AccountTypeId: new FormControl(''),
      SelectedAccountType: new FormControl('0'),
      AccountNo: new FormControl(''),
      AccountNoSelectedSelectedChangeStatus: new FormControl('0'),
      CurrentStatus: new FormControl(''),
      Since: new FormControl(''),
      CurrentReference: new FormControl(''),
      Balance: new FormControl(''),
      TotalLienAmount: new FormControl(''),
      LienAmount: new FormControl(''),
      SelectedChangeStatus: new FormControl('0'),
      StatusDate: new FormControl(this.commonData?.ProcessDate),
      Reference: new FormControl(''),
    });
  }

  // enter key events
  onEnterMemberNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`accountType`).focus();
  }

  onEnterAccountTypeIdHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    this.selectAccountTypeChangeHandler(e);
    document.getElementById(`SelectedChangeStatus`).focus();
  }

  onChangeSelectedChangeStatus() {
    document.getElementById(`Reference`).focus();
  }

  getAccountTypeList = () => {
    this.spinner.show();
    this.AccountingService.getAccountTypeListInfo()
      .pipe(first())
      .subscribe(
        (x: AccountTypeClassModel[]) => {
          this.spinner.hide();
          this.accTypeList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  getAccountStatusList = () => {
    this.spinner.show();
    this.AccountingService.getAccountStatusListInfo()
      .pipe(first())
      .subscribe(
        (x: AccountTypeClassModel[]) => {
          this.spinner.hide();
          this.accStatusList = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  changeMemberInfoHandler = (e) => {
    if(e.target.value==''){
      return;
    }
    this.MemNo = e.target.value;
    this.spinner.show();
    this.AccountingService.GetMemberInformation(Number(this.MemNo))
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.MemInfoList = x;
          this.MemType = x.MemType;
          console.log('AllMemberData::::-->', x);
          if (x.MemberNo == '') {
            alert('Member No. Is Not Vallid!!!');
            location.reload();
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  selectAccountTypeChangeHandler = (e) => {
    this.spinner.show();
    if (!this.MemNo) {
      alert('Please Insert Member No!');
      return;
    }
    this.AccType = e.target.value;
    this.AccountingService.GetAccountNumbers(
      Number(this.MemType),
      Number(this.MemNo),
      Number(this.AccType)
    )
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log("OKOKOK",x)
          if (Object.keys(x).length==0  ) {
            alert('Account Not In File!');
            location.reload();
            return;
          } else {
            this.AccountNo = x[0].AccountNo;
            this.AccountNos = x;
            this.spinner.show();
            this.AccountingService.GetAccountInfo(Number(this.AccountNo))
              .pipe(first())
              .subscribe(
                (x: any) => {
                  this.spinner.hide();
                  this.AccInfo = x;
                  this.Id = x.Id;
                  let status = this.accStatusList.find(
                    (i) => i.Id == x.AccStatus
                  );
                  
                  console.log("this is value",x)
                  this.AccountStatusChangeForm.patchValue({
                    AccountTypeId: this.AccType,
                    AccountNo: this.AccountNo,
                    AccountNoSelectedSelectedChangeStatus: this.AccountNo,
                    Balance: (x.AccBalance).toLocaleString('en-US', { minimumFractionDigits: 2 }),
                    TotalLienAmount: x.AccLienAmt.toLocaleString('en-US', { minimumFractionDigits: 2 }),
                    CurrentReference: x.AccStatusNote,
                    CurrentStatus: status.Description,
                    Since: new Date(x.AccStatusDate).toLocaleDateString(
                      'en-GB'
                    ),
                  });
                },
                (err) => {
                  this.spinner.hide();
                }
              );
          }
        },
        (err) => {
          this.spinner.hide();
        }
      );
    this.AccountStatusChangeForm.controls['SelectedAccountType'].setValue(
      this.AccType
    );
    document.getElementById(`SelectedChangeStatus`).focus();
  };

  onAccountNoSelectedChangeStatus(e){
    this.spinner.show();
    let FormData = this.AccountStatusChangeForm.value;
    console.log( FormData.AccountNoSelectedSelectedChangeStatus );
    this.AccountingService.GetAccountInfo(Number( e.target.value ))
              .pipe(first())
              .subscribe(
                (x: any) => {
                  this.spinner.hide();
                  this.AccInfo = x;
                  this.Id = x.Id;
                  let status = this.accStatusList.find(
                    (i) => i.Id == x.AccStatus
                  );
                  
                  console.log("this is value", x)
                  this.AccountStatusChangeForm.patchValue({
                    AccountTypeId: this.AccType,
                    AccountNo: this.AccountNo,
                    Balance: (x.AccBalance).toLocaleString('en-US', { minimumFractionDigits: 2 }),
                    TotalLienAmount: x.AccLienAmt.toLocaleString('en-US', { minimumFractionDigits: 2 }),
                    CurrentReference: x.AccStatusNote,
                    CurrentStatus: status.Description,
                    Since: new Date(x.AccStatusDate).toLocaleDateString(
                      'en-GB'
                    ),
                  });
                },
                (err) => {
                  this.spinner.hide();
                }
              );
              this.spinner.hide();
  }

  convertDateToString(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }
  convertDatebaseFormat(str) {
    var day = str[0] + str[1];
    var month = str[3] + str[4];
    var year = str[6] + str[7] + str[8] + str[9];
    return [year, month, day].join('-');
  }
  UpdateAccountStatus = () => {
    if (!this.MemNo) {
      alert('Member Id Not Found!');
      return;
    }

    let FormData = this.AccountStatusChangeForm.value;
    let StatusFormData = {
      Id: this.Id,
      AccStatus: FormData.SelectedChangeStatus,
      AccStatusDate:
        typeof this.AccountStatusChangeForm.value.StatusDate == 'string'
          ? this.convertDatebaseFormat(
              this.AccountStatusChangeForm.value.StatusDate
            )
          : this.convertDateToString(
              this.AccountStatusChangeForm.value.StatusDate
            ),
      AccStatusNote: FormData.Reference,
      AccLienAmt: FormData.LienAmount == '' ? 0 : FormData.LienAmount,
    };
    if (this.AccInfo.AccStatus == 50 && StatusFormData.AccStatus == '99') {
      alert('Lien Account, Can Not A/C Close!');
      return;
    }
    if (StatusFormData.AccStatus == '99' && this.AccInfo.AccBalance != 0) {
      alert('Balance Available, Can Not A/C Close!');
      return;
    }
    this.spinner.show();
    this.AccountingService.UpdateAccountStatus(StatusFormData)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.initializeForm();
          this.MemInfoList = [];
          this.spinner.hide();
          alert('Status Updated!');
        },
        (err) => {
          this.spinner.hide();
          alert(err);
        }
      );
  };
}
