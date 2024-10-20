import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-edit-user-id',
  templateUrl: './edit-user-id.component.html',
  styleUrls: ['./edit-user-id.component.css'],
})
export class EditUserIdComponent implements OnInit {
  userlist = [];
  modulelist = [];
  dataList = [];
  glcashcodelist = [];
  EditUserForm: FormGroup;
  selectedCode: any = null;
  public loading: boolean = false;
  sodStatus: boolean = true;
  csVoucherStatus: boolean = true;
  glVoucherStatus: boolean = true;
  smsStatus: boolean = true;

  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.GetUserList();
    //this.GetUserInformationById(this.selectedCode);
    this.GetUserIdLevels();
    this.GetGLCashCodeList();
  }
  private initializeForm() {
    this.EditUserForm = new FormGroup({
      IdsNo: new FormControl('', [Validators.required]),
      IdsLevel: new FormControl('0', [Validators.required]),
      selectedOptionCode: new FormControl('0'),
      LIdsCashCredit: new FormControl(''),
      LIdsCashDebit: new FormControl(''),
      LIdsTrfCredit: new FormControl(''),
      LIdsTrfDebit: new FormControl(''),
      GLCashCode: new FormControl('', [Validators.required]),
      IdsName: new FormControl(''),
      SODflag: new FormControl(''),
      CSVPrintflag: new FormControl(''),
      GLVPrintflag: new FormControl(''),
      AutoVchflag: new FormControl(''),
      SMSflag: new FormControl(''),
      GLCashCodeDescription: new FormControl('0'),
      IdsMobileNo: new FormControl(''),
    });
  }

  // Get User Information List
  GetUserList = () => {
    this.houseKeepingService
      .GetUserList('UserMaintenance')
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.userlist = x;
          console.log('UserList:', this.userlist);
        },
        (err) => {
          alert('Something Went Wrong');
        }
      );
  };

  // Get User level

  GetUserIdLevels = () => {
    this.houseKeepingService
      .GetUserIdLevels('UserMaintenance')
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.dataList = x;
          console.log('DataList', this.dataList);
        },
        (err) => {
          alert('Something Went Wrong');
        }
      );
  };

  // GL Cash Code
  GetGLCashCodeList = () => {
    this.houseKeepingService
      .GetGLCashCodeList('UserMaintenance')
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.glcashcodelist = x;
          console.log('gLCashCode', this.glcashcodelist);
        },
        (err) => {
          alert('Something Went Wrong');
        }
      );
  };

  changeSelectValue = (e) => {
    if (e.target.value) {
      let selectedCode = this.userlist.find(
        (x) => x.IdsNo == this.EditUserForm.get('IdsNo').value
      );
      this.selectedCode = selectedCode.IdsNo;
      this.GetUserInformationById(this.selectedCode);
      this.GetTransactionLimit(this.selectedCode);
      // this.GetModulesByUserId(this.selectedCode);
      console.log('ChangeSelectValue:', this.selectedCode);
    }
    document.getElementById(`IdsName`).focus();
  };

  changeIdsLevel() {
    document.getElementById(`IdsName`).focus();
  }

  // Get Infromation by UserID
  GetUserInformationById = (user) => {
    this.houseKeepingService
      .GetUserInformationById(user)
      .pipe(first())
      .subscribe(
        (x: any) => {
          console.log('GetUserInfo', x);
          var IdLevel = x.IdsLevel;
          console.log('SelectionId', IdLevel);

          this.EditUserForm.patchValue({
            GLCashCode: x.GLCashCode,
            IdsName: x.IdsName,
            SODflag: x.SODflag,
            IdsLevel: x.IdsLevel == null ? '0' : x.IdsLevel,
            CSVPrintflag: x.CSVPrintflag,
            GLVPrintflag: x.GLVPrintflag,
            AutoVchflag: x.AutoVchflag,
            SMSflag: x.SMSflag,
            GLCashCodeDescription: x.GLCashCode,
            IdsMobileNo: x.IdsMobileNo,
          });
        },
        (err) => {
          alert('Something Went Wrong');
        }
      );
  };

  // Get module list by Id

  GetModulesByUserId = (user) => {
    this.houseKeepingService
      .GetModulesByUserId(user)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.modulelist = x;
          console.log('ModuleList:', this.modulelist);
        },
        (err) => {
          alert('Something Went Wrong!');
        }
      );
  };

  // AccType DropDownStart

  //  onChangeAccTypeCode() {
  //   let selectedCode = this.GetInputHelpData.AccountTypeDropDown.find(x=> x.Id == this.CashCollectionReportByAccForm.value.AccTypeCode);
  //   if(selectedCode){
  //     this.CashCollectionReportByAccForm.controls['AccType'].setValue( this.CashCollectionReportByAccForm.value.AccTypeCode);
  //     this.cashCollectionService.AccountClassReturn(this.CashCollectionReportByAccForm.value.AccTypeCode).pipe(first()).subscribe((data:any)=>{
  //       this.AccountClass=data;
  //     });

  //   }
  //   else{
  //     this.toastr.error('Acc type was not valid.')
  //     this.CashCollectionReportByAccForm.controls['AccType'].setValue(0);
  //     this.CashCollectionReportByAccForm.controls['AccTypeCode'].setValue('');
  //   }
  // }

  // onChangeAccType() {
  //   this.CashCollectionReportByAccForm.controls['AccTypeCode'].setValue( this.CashCollectionReportByAccForm.value.AccType);
  //   this.cashCollectionService.AccountClassReturn(this.CashCollectionReportByAccForm.value.AccType).pipe(first()).subscribe((data:any)=>{
  //   this.AccountClass=data;
  //   });

  // }

  moduleList() {
    if (this.EditUserForm.value.IdsNo == '') {
      alert('Please Input the Ids no first');
    } else {
      this.GetModulesByUserId(this.selectedCode);
    }
  }

  // Get Infromation by UserID

  GetTransactionLimit = (user) => {
    this.houseKeepingService
      .GetTransactionLimit(user)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.EditUserForm.patchValue({
            LIdsCashCredit: x.LIdsCashCredit.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            }),
            LIdsCashDebit: x.LIdsCashDebit.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            }),
            LIdsTrfCredit: x.LIdsTrfCredit.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            }),
            LIdsTrfDebit: x.LIdsTrfDebit.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            }),
          });
        },
        (err) => {
          alert('Something Went Wrong!');
        }
      );
  };

  //update User information

  UpdateUserInfo = () => {
    if (this.EditUserForm.value.IdsNo == '') {
      alert('Please Input the Ids no first');
    } else {
      var formValue = this.EditUserForm.value;
      this.houseKeepingService
        .UserInfoUpdate('UserMaintenance', formValue)
        .pipe(first())
        .subscribe(
          (x: any) => {
            if ((x.Success = true)) {
              this.initializeForm();

              alert('Information Updated Successfully');
            } else {
              // this.loading = true;
            }
          },
          (err) => {
            this.toastr.error('Something Went Wrong !', 'Error');
          }
        );
    }
  };
  keyPress(event: any) {
    const pattern = /[0-9\+\-\, ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  validation() {
    console.log(this.EditUserForm.controls.IdsMobileNo.value.length);
    if (this.EditUserForm.controls.IdsMobileNo.value.length < 11) {
      alert('Invalid Mobile Number');
      this.EditUserForm.controls['IdsMobileNo'].setValue('');
    }
  }
  // enter key events
  onEnterIdsNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`UserPhoneNo`).focus();
  }
  onEnterUserPhoneNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`glcashcode`).focus();
  }
  onEnterGLCashCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`LIdsCashCredit`).focus();
  }
  onEnterLIdsCashCreditHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`LIdsCashDebit`).focus();
  }
  onEnterLIdsCashDebitHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`LIdsTrfCredit`).focus();
  }
  onEnterLIdsTrfCreditHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`LIdsTrfDebit`).focus();
  }
}
