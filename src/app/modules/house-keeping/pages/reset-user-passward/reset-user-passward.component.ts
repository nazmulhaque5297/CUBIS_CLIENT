import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';
import { ToastrService } from 'ngx-toastr';
import { JsonResponseModel } from 'src/app/Models/user-manager.model';

@Component({
  selector: 'app-reset-user-passward',
  templateUrl: './reset-user-passward.component.html',
  styleUrls: ['./reset-user-passward.component.css'],
})
export class ResetUserPasswardComponent implements OnInit {
  userlist = [];
  password = [];
  ResetPasswordControlForm: FormGroup;
  selectedCode: any = null;

  constructor(
    private houseKeepingService: HouseKeepingService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.GetUserList();
    this.initializeForm();
  }

  private initializeForm() {
    this.ResetPasswordControlForm = new FormGroup({
      IdsNo: new FormControl('', [Validators.required]),
      selectedOptionCode: new FormControl('0'),
    });
  }

  //Get user data
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

  //Reset password
  GetUserPassword = (user) => {
    this.spinner.show();
    this.houseKeepingService
      .GetUserPassword(user)
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log("Request Success...", x);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  changeSelectValue = (e) => {
    if (e.target.value) {
      let selectedCode = this.userlist.find(
        (x) => x.IdsNo == this.ResetPasswordControlForm.get('IdsNo').value
      );
      if (selectedCode) {
        this.ResetPasswordControlForm.patchValue({
          selectedOptionCode: selectedCode.IdsNo,
        });
        this.selectedCode = selectedCode.IdsNo;
      } else {
        this.ResetPasswordControlForm.patchValue({
          selectedOptionCode: 0,
          IdsNo: '',
        });
      }
      console.log(selectedCode);
    }
  };

  // Select Change Handler

  selectChangeHandler(event: any) {
    let ChangeSelectedOption = event.target.value;
    if (ChangeSelectedOption) {
      let selectedCode = this.userlist.find(
        (x) => x.IdsNo == ChangeSelectedOption
      );
      this.ResetPasswordControlForm.patchValue({
        selectedOptionCode: selectedCode.IdsNo,
        IdsNo: selectedCode.IdsNo == 0 ? '' : selectedCode.IdsNo,
      });
      this.selectedCode = selectedCode.IdsNo;
    }
  }

  resetPassword = () => {
    if (confirm("Are you sure you want Reset User Password??")) {
      this.spinner.show();
      this.houseKeepingService.ResetPassword(this.ResetPasswordControlForm.value.IdsNo).pipe(first()).subscribe((x: JsonResponseModel) => {
          this.spinner.hide();
         if(x.Success){
           alert("Password reset successfully.New password "+x.Message);
         }
        });
    }

  };
}
