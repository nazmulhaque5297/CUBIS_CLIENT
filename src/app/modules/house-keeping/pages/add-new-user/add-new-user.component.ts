import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css'],
})
export class AddNewUserComponent implements OnInit {
  dataList = [];
  glcashcodelist = [];
  userlist = [];
  AddNewUserForm: FormGroup;
  selectedCode: any = null;
  tabularData: boolean = false;

  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.GetUserIdLevels();
    this.GetGLCashCodeList();
    this.initializeForm();
    this.GetUserList();
  }

  private initializeForm() {
    this.AddNewUserForm = new FormGroup({
      IdsNo: new FormControl('', [Validators.required]),
      IdsLevel: new FormControl('10', [Validators.required]),
      selectedOptionCode: new FormControl('0'),
      IdsName: new FormControl(''),
      IdsMobileNo: new FormControl(''),
      GLCashCode: new FormControl('', [Validators.required]),
      SODflag: new FormControl(''),
      CSVPrintflag: new FormControl(''),
      GLVPrintflag: new FormControl(''),
      AutoVchflag: new FormControl(''),
      SMSflag: new FormControl(''),
      LIdsCashCredit: new FormControl('', [Validators.required]),
      LIdsCashDebit: new FormControl('', [Validators.required]),
      LIdsTrfCredit: new FormControl('', [Validators.required]),
      LIdsTrfDebit: new FormControl('', [Validators.required]),
    });
  }

  GetUserIdLevels = () => {
    this.spinner.show();
    this.houseKeepingService
      .GetUserIdLevels('UserMaintenance')
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.dataList = x;
          console.log(this.dataList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  GetGLCashCodeList = () => {
    this.spinner.show();
    this.houseKeepingService
      .GetGLCashCodeList('UserMaintenance')
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.glcashcodelist = x;
          console.log(this.glcashcodelist);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };
  ShowData() {
    this.tabularData = true;
    this.GetUserList();
  }
  GetUserList = () => {
    this.spinner.show();
    this.houseKeepingService
      .GetUserList('UserMaintenance')
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.userlist = x;
          console.log(this.userlist);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  InsertUserInfo = () => {
    this.spinner.show();
    var formValue = this.AddNewUserForm.value;
    console.log(formValue);
    this.houseKeepingService
      .InsertUserInfo('UserMaintenance', formValue)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.initializeForm();
          this.GetUserList();
          alert('User Added Succesfully');
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error('Something Went Wrong !', 'Error');
        }
      );
  };

  changeSelectValue = (e) => {
    if (e.target.value) {
      let selectedCode = this.glcashcodelist.find(
        (x) => x.Id == this.AddNewUserForm.get('GLCashCode').value
      );
      if (selectedCode) {
        this.AddNewUserForm.patchValue({
          selectedOptionCode: selectedCode.Id,
        });
        this.selectedCode = selectedCode.Id;
      } else {
        this.AddNewUserForm.patchValue({
          selectedOptionCode: 0,
          GLCashCode: '',
        });
      }
      console.log(selectedCode);
    }
    document.getElementById(`transactionamount`).focus();
  };

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.glcashcodelist.find(
        (x) => x.Id == ChangeSelectedOption
      );
      this.AddNewUserForm.patchValue({
        selectedOptionCode: selectedCode.Id,
        GLCashCode: selectedCode.Id == 0 ? '' : selectedCode.Id,
      });
      this.selectedCode = selectedCode.Id;
      document.getElementById(`transactionamount`).focus();
      console.log(selectedCode);
    }
  }
  Idcheck() {
    if (this.userlist.find((x) => x.IdsNo == this.AddNewUserForm.value.IdsNo)) {
      alert('Id Already Used');
      this.AddNewUserForm.controls['IdsNo'].setValue('');
    }
  }

  validation() {
    console.log(this.AddNewUserForm.controls.IdsMobileNo.value.length);
    if (this.AddNewUserForm.controls.IdsMobileNo.value.length < 11) {
      alert('Invalid Mobile Number');
      this.AddNewUserForm.controls['IdsMobileNo'].setValue('');
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\, ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Enter Event

  focusChange() {
    document.getElementById(`idno`).focus();
  }

  onEnterIDNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`username`).focus();
  }
  onEnterUsrNameHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`UserPhoneNo`).focus();
  }
  onEnterTrnAmtHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`Dtransactionamount`).focus();
  }
  onEnterDTrnAmtHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`Ctransactionamount`).focus();
  }
  onEnterCTrnAmtHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`Detransactionamount`).focus();
  }
  onEnterUserPhoneNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`glcashcode`).focus();
  }
}
