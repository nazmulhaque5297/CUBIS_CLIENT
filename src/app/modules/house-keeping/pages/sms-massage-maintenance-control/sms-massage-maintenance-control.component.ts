import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import {
  SmsMessageMaintenancePageLoadModel,
  SmsMessageMaintenanceTextDataModel,
} from 'src/app/modules/accounting/models/sms-message-meintenance.model';
import {
  Module,
  ModuleListByUser,
} from 'src/app/modules/Models/HoseKeepingModel';
import { SmsMessageMaintenanceService } from 'src/app/services/sms-message-maintenance-control.service';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-sms-massage-maintenance-control',
  templateUrl: './sms-massage-maintenance-control.component.html',
  styleUrls: ['./sms-massage-maintenance-control.component.css'],
})
export class SmsMassageMaintenanceControlComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  dataList = [];
  SmsDdlForm: FormGroup;
  GetInputHelpData: SmsMessageMaintenancePageLoadModel = new SmsMessageMaintenancePageLoadModel();
  GetTextBoxData: SmsMessageMaintenanceTextDataModel = new SmsMessageMaintenanceTextDataModel();
  selectedCode: any = null;
  allModuleList: Module[] = [];
  smsData: any;
  getFunId: any;
  text1Status: any;
  Message1: any;
  textBStatus: any;
  text2Status: any;
  text3Status: boolean = true;
  WriteFlag: any = 0;
  IsBangla: boolean = true;

  constructor(
    // private houseKeepingService: HouseKeepingService,
    private smsMessageMaintenanceService: SmsMessageMaintenanceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelpData();
  }
  private initializeForm() {
    this.text1Status = true;
    this.SmsDdlForm = new FormGroup({
      SelectedOptionCode: new FormControl('0'),
      TextMessage1: new FormControl('',Validators.maxLength(51)),
      TextMessage2: new FormControl('',Validators.maxLength(51)),
      TextMessage3: new FormControl('',Validators.maxLength(51)),
      TextMessage4: new FormControl(''),
      TextMessage5: new FormControl(''),
      Bangla: new FormControl(''),
    });
  }


  public getInputHelpData() {
    this.smsMessageMaintenanceService
      .SmsMessageMaintenancePageLoad()
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data);
        console.log("CheckLang",data.LanguageFlag)
        this.GetInputHelpData = data;
        if (this.GetInputHelpData.LanguageFlag == 1) {
          this.IsBangla = true;
          this.SmsDdlForm.controls['Bangla'].setValue(1);
        } else {
          this.IsBangla = false;
          this.SmsDdlForm.controls['Bangla'].setValue(0);
        }
      });
  }

  onChangeFunctionName() {
    let funIdList = [];
    var x = this.SmsDdlForm.value.SelectedOptionCode;
    console.log(x);
    if (x == 0) {
      this.initializeForm();
      return;
    }
    this.smsMessageMaintenanceService
      .SmsMessageMaintenanceTextData(x)
      .pipe(first())
      .subscribe((data: any) => {
        console.log('All Data:', data);

        if (data.SMSData.MessageFlag == 1 && x != 3) {
          this.SmsDdlForm.controls['TextMessage1'].setValue(
            data.SMSData.TextMessage1B
          );
          this.SmsDdlForm.controls['TextMessage2'].setValue(data.Message1);
          this.SmsDdlForm.controls['TextMessage3'].setValue(data.Message2);
          this.SmsDdlForm.controls['TextMessage5'].setValue(
            data.SMSData.TextMessage3B
          );
          this.SmsDdlForm.controls['TextMessage4'].setValue(
            data.SMSData.TextMessage2B
          );
          this.text3Status = true;
        } else if (data.SMSData.MessageFlag == 1 && x == 3) {
          this.SmsDdlForm.controls['TextMessage1'].setValue(
            data.SMSData.TextMessage1B
          );
          this.SmsDdlForm.controls['TextMessage2'].setValue(data.Message1);
          this.SmsDdlForm.controls['TextMessage3'].setValue(data.Message2);
          this.SmsDdlForm.controls['TextMessage4'].setValue(
            data.SMSData.TextMessage2B
          );
          this.text3Status = false;
        } else if (data.SMSData.MessageFlag != 1 && x != 3) {
          this.SmsDdlForm.controls['TextMessage1'].setValue(
            data.SMSData.TextMessage1
          );
          this.SmsDdlForm.controls['TextMessage2'].setValue(data.Message1);
          this.SmsDdlForm.controls['TextMessage3'].setValue(data.Message2);
          this.SmsDdlForm.controls['TextMessage4'].setValue(
            data.SMSData.TextMessage2
          );
          this.SmsDdlForm.controls['TextMessage5'].setValue(
            data.SMSData.TextMessage3
          );
          this.text3Status = true;
        } else if (data.SMSData.MessageFlag != 1 && x == 3) {
          this.SmsDdlForm.controls['TextMessage1'].setValue(
            data.SMSData.TextMessage1
          );
          this.SmsDdlForm.controls['TextMessage2'].setValue(data.Message1);
          this.SmsDdlForm.controls['TextMessage3'].setValue(data.Message2);
          this.SmsDdlForm.controls['TextMessage4'].setValue(
            data.SMSData.TextMessage2
          );
          this.text3Status = false;
        }
      });
    document.getElementById(`textMessage1`).focus();
  }


  updateData() {
    if (this.SmsDdlForm.value.SelectedOptionCode == 0) {
      alert('Please Select Function Option');
      return;
    }
    if (this.SmsDdlForm.invalid) {
      alert('Please Fillup the Required Field ');
      return;
    }
    if (confirm('Are You Sure Want To Update Information?')) {
      var writeFlag = this.WriteFlag;
      var fValue = this.SmsDdlForm.value;
      fValue.WriteFlag = this.WriteFlag;
      console.log(fValue);
      this.spinner.show();
      this.smsMessageMaintenanceService
        .UpdateAllInformation(fValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.spinner.hide();
          if (data != 0) {
            alert('Data updated successfully');
            location.reload();
            this.initializeForm();
          } else {
            alert("Data didn't updated.");
          }
        });
    }
  }
  //enter key events
  onEntertextMessage1Handler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`TextMessage4`).focus();
  }
  onEnterTextMessage2Handler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`TextMessage5`).focus();
  }
}
