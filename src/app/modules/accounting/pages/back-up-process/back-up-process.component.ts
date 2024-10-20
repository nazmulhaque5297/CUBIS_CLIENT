import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { IApplicationCommonModel } from 'src/app/Models/Common.model';
import { BackupProcessService } from '../../services/backup-process.service';
import { Store, select } from '@ngrx/store';
import * as UserActions from '../../../../actions/user.actions';
import * as UserSelectors from '../../../../selector/user.selectors';
import { ApplicationCommonService } from 'src/app/services/application-common.service';

@Component({
  selector: 'app-back-up-process',
  templateUrl: './back-up-process.component.html',
  styleUrls: ['./back-up-process.component.css'],
})
export class BackUpProcessComponent implements OnInit {
  BackUpProcessForm: FormGroup;
  toAddress: string;
  commonData: IApplicationCommonModel;
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private backupProcess: BackupProcessService,
    private store: Store,
    private applicationCommonService: ApplicationCommonService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  async commondata() {
    this.store
      .pipe(select(UserSelectors.getCommonData))
      .subscribe((cData: IApplicationCommonModel) => {
        if (cData) {
          this.commonData = cData;
          var days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ];
          var d = new Date(this.commonData.FormatProcessDate);
          var dayName = days[d.getDay()];
          console.log('this is data', dayName);
          if (dayName == 'Sunday') {
            this.BackUpProcessForm.controls['radioButton'].setValue('1');
            this.BackUpProcessForm.value.radioButton = '1'
          } else if (dayName == 'Monday') {
            this.BackUpProcessForm.controls['radioButton'].setValue('2');
            this.BackUpProcessForm.value.radioButton = '2'
          } else if (dayName == 'Tuesday') {
            this.BackUpProcessForm.controls['radioButton'].setValue('3');
            this.BackUpProcessForm.value.radioButton = '3'
          } else if (dayName == 'Wednesday') {
            this.BackUpProcessForm.controls['radioButton'].setValue('4');
            this.BackUpProcessForm.value.radioButton = '4'
          } else if (dayName == 'Thursday') {
            this.BackUpProcessForm.controls['radioButton'].setValue('5');
            this.BackUpProcessForm.value.radioButton = '5'
          } else if (dayName == 'Friday') {
            this.BackUpProcessForm.controls['radioButton'].setValue('6');
            this.BackUpProcessForm.value.radioButton = '6'
          } else if (dayName == 'Saturday') {
            this.BackUpProcessForm.controls['radioButton'].setValue('7');
            this.BackUpProcessForm.value.radioButton = '7'
          }
          setTimeout(() => {
            this.radioBtnChange();
          }, 100);
        } else {
          //this.setCommonData();
        }
      });
  }

  async initializeForm() {
    this.BackUpProcessForm = new FormGroup({
      radioButton: new FormControl('0'),
      ToAddress: new FormControl(''),
      FromAddress: new FormControl(''),
    });
    await this.inputLoadData();
    await this.commondata();
  }
  async inputLoadData() {
    this.spinner.show();
    this.backupProcess
      .getBackupProcessPageLoad()
      .pipe(first())
      .subscribe(
        (x: any) => {
          this.spinner.hide();
          console.log("this is x",x);
          this.BackUpProcessForm.controls['ToAddress'].setValue(x.ToText);
          this.toAddress = x.ToText;
          // this.BackUpProcessForm.controls['radioButton'].setValue(
          //   x.RadioButtonValue
          // );
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  radioBtnChange() {
    console.log('button value', this.BackUpProcessForm.value.radioButton);
    if (this.BackUpProcessForm.value.radioButton == 1) {
      var address = this.toAddress.toString().trim()+ 'Sun\\';
      this.BackUpProcessForm.controls['ToAddress'].setValue(address);
    } else if (this.BackUpProcessForm.value.radioButton == 2) {
      var address = this.toAddress.toString().trim() + 'Mon\\';
      this.BackUpProcessForm.controls['ToAddress'].setValue(address);
    } else if (this.BackUpProcessForm.value.radioButton == 3) {
      var address = this.toAddress.toString().trim() + 'Tue\\';
      this.BackUpProcessForm.controls['ToAddress'].setValue(address);
    } else if (this.BackUpProcessForm.value.radioButton == 4) {
      var address = this.toAddress.toString().trim() + 'Wed\\';
      this.BackUpProcessForm.controls['ToAddress'].setValue(address);
    } else if (this.BackUpProcessForm.value.radioButton == 5) {
      var address = this.toAddress.toString().trim() + 'Thu\\';
      this.BackUpProcessForm.controls['ToAddress'].setValue(address);
    } else if (this.BackUpProcessForm.value.radioButton == 6) {
      var address = this.toAddress.toString().trim() + 'Fri\\';
      this.BackUpProcessForm.controls['ToAddress'].setValue(address);
    } else {
      var address = this.toAddress.toString().trim() + 'Sat\\';
      this.BackUpProcessForm.controls['ToAddress'].setValue(address);
    }
  }

  backupBtnClick() {
    let value = this.BackUpProcessForm.value.ToAddress.toString();
    let test = value[value.length-4] + value[value.length-3] + value[value.length-2];
    console.log(test);
    if(test!='Sun' && test!='Mon' && test!='Tue' && test!='Wed' && test!='Thu' && test!='Fri' && test!='Sat'){
      this.toastr.warning('Day name short form is incorrect!!!');
      return;
    }
    if (this.BackUpProcessForm.value.radioButton == '0' ) {
      this.toastr.warning('Please select the day.!');
      return;
    }
    this.spinner.show();
    this.backupProcess
      .setBackupProcess(this.BackUpProcessForm.value.ToAddress)
      .pipe(first())
      .subscribe((x: any) => {
        this.spinner.hide();
        if (x == 1) {
          alert('Database Backup Sucessfully Done');
          this.initializeForm();
        } else {
          alert('Something went wrong!');
        }
      });
  }

  exitPage() {
    this.router.navigate(['accounting/']);
  }

  setCommonData = () => {
    this.applicationCommonService
      .getApplicationCommonData()
      .pipe(first())
      .subscribe(
        (x: IApplicationCommonModel) => {
          this.commonData = x;
          this.store.dispatch(new UserActions.LoadCommonData());
        },
        (err) => {
          console.log(err);
        }
      );
  };
}
