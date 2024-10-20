import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-transaction-limit-accessibility',
  templateUrl: './user-transaction-limit-accessibility.component.html',
  styleUrls: ['./user-transaction-limit-accessibility.component.css'],
})
export class UserTransactionLimitAccessibilityComponent implements OnInit {
  userlist = [];
  transactionControlForm: FormGroup;
  selectedCode: any = null;
  transaction: any = null;
  submitButtonText: string = 'Submit';
  submitButtonState: boolean = false;

  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.GetUserList();
    this.GetTransactionLimit(this.selectedCode);
    this.initializeForm();
  }
  private initializeForm() {
    this.submitButtonText = 'Submit';
    this.transactionControlForm = new FormGroup({
      IdsNo: new FormControl('', [Validators.required]),
      selectedOptionCode: new FormControl('0'),
      LIdsCashCredit: new FormControl(''),
      LIdsCashDebit: new FormControl(''),
      LIdsTrfCredit: new FormControl(''),
      LIdsTrfDebit: new FormControl(''),
    });
  }

  //enter key events
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
  onEnterLIdsTrfDebitHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`update`).focus();
  }

  // Get User Information List
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
  changeSelectValue = (e) => {
    if (e.target.value) {
      let selectedCode = this.userlist.find(
        (x) => x.IdsNo == this.transactionControlForm.get('IdsNo').value
      );
      if (selectedCode) {
        this.transactionControlForm.patchValue({
          selectedOptionCode: selectedCode.IdsNo,
        });
        this.selectedCode = selectedCode.IdsNo;
        this.submitButtonText = 'Update';
        this.GetTransactionLimit(this.selectedCode);
      } else {
        this.transactionControlForm.patchValue({
          selectedOptionCode: 0,
          IdsNo: '',
        });
        this.submitButtonText = 'Submit';
      }
      console.log(selectedCode);
    }
    document.getElementById(`LIdsCashCredit`).focus();
  };

  // Select Change Handler

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.userlist.find(
        (x) => x.IdsNo == ChangeSelectedOption
      );
      if (selectedCode) {
        this.transactionControlForm.patchValue({
          IdsNo: selectedCode.IdsNo,
        });
        this.selectedCode = selectedCode.IdsNo;
        this.submitButtonText = 'Update';
        this.GetTransactionLimit(this.selectedCode);
      } else {
        this.initializeForm();
        this.submitButtonText = 'Submit';
      }
    }
    console.log(this.selectedCode);
  }

  // Get Infromation by UserID

  GetTransactionLimit = (user) => {
    this.spinner.show();
    this.houseKeepingService
      .GetTransactionLimit(user)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          this.transactionControlForm.patchValue({
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
          this.spinner.hide();
        }
      );
  };

  // Update User Transaction Limit

  UpdateUserTransactionLimit = () => {
    if (this.transactionControlForm.value.IdsNo == 0) {
      alert('No User is selected !');
      return;
    }
    if (confirm('Are You Sure Want To Update Information?')) {
      // this.spinner.show();
      var formValue = this.transactionControlForm.value;
      this.houseKeepingService
        .UserInfoUpdate('TransactionLimit', formValue)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.initializeForm();
            this.spinner.hide();
            alert('Information Updated !');
          },
          (err) => {
            this.spinner.hide();
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

  onCashCreditChange(e){
    let value = Number(e.target.value);
    this.transactionControlForm.controls['LIdsCashCredit'].setValue(value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
    }));
  }
  onCashdeditChange(e){
    let value = Number(e.target.value);
    this.transactionControlForm.controls['LIdsCashDebit'].setValue(value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
    }));
  }
  onTrfCredit(e){
    let value = Number(e.target.value);
    this.transactionControlForm.controls['LIdsTrfCredit'].setValue(value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
    }));
  }
  onTrfDebit(e){
    let value = Number(e.target.value);
    this.transactionControlForm.controls['LIdsTrfDebit'].setValue(value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
    }));
  }
}
