import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-sms-configuration',
  templateUrl: './sms-configuration.component.html',
  styleUrls: ['./sms-configuration.component.css'],
})
export class SmsConfigurationComponent implements OnInit {
  SMSConfigurationForm: FormGroup;
  buttontextsubmit: boolean = true;
  buttontextupdate: boolean = false;
  dataList = [];
  constructor(
    private spinner: NgxSpinnerService,
    private houseKeepingService: HouseKeepingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getDataList();
  }

  private initializeForm() {
    this.SMSConfigurationForm = new FormGroup({
      gatewayURL: new FormControl('', [Validators.required]),
      senderID: new FormControl('', [Validators.required]),
      apiKey: new FormControl('', [Validators.required]),
      secretKey: new FormControl('', [Validators.required]),
    });
  }

  // enter key events
  onEntergatewayURLHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`senderID`).focus();
  }
  onEntersenderIDHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`apiKey`).focus();
  }
  onEnterapiKeyIDHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`secretKey`).focus();
  }

  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService
      .GetExisting()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.dataList = x;
          if (this.dataList.length == 0) {
            this.buttontextsubmit = true;
            this.buttontextupdate = false;
          } else {
            this.buttontextsubmit = false;
            this.buttontextupdate = true;
          }
          this.SMSConfigurationForm.controls['gatewayURL'].setValue(
            this.dataList[0].URL
          );
          this.SMSConfigurationForm.controls['senderID'].setValue(
            this.dataList[0].Senderid
          );
          this.SMSConfigurationForm.controls['apiKey'].setValue(
            this.dataList[0].Apikey
          );
          this.SMSConfigurationForm.controls['secretKey'].setValue(
            this.dataList[0].Secretkey
          );
          console.log('this is page load data', this.dataList);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  save = () => {
    if (this.SMSConfigurationForm.invalid) {
      alert('You Must Fillup Description Fields !');
    } else {
      this.spinner.show();

      let formValue = {
        URL: this.SMSConfigurationForm.value.gatewayURL,
        Senderid: this.SMSConfigurationForm.value.senderID,
        Apikey: this.SMSConfigurationForm.value.apiKey,
        Secretkey: this.SMSConfigurationForm.value.secretKey,
      };

      this.houseKeepingService
        .InsertSMSInfo(formValue)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.getDataList();
            alert('Data Saved SUccessfully');
            this.initializeForm();
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  };

  update = () => {
    if (this.SMSConfigurationForm.invalid) {
      alert('You Must Fillup Description Fields !');
    } else {
      this.spinner.show();

      let formValue = {
        URL: this.SMSConfigurationForm.value.gatewayURL,
        Senderid: this.SMSConfigurationForm.value.senderID,
        Apikey: this.SMSConfigurationForm.value.apiKey,
        Secretkey: this.SMSConfigurationForm.value.secretKey,
      };

      this.houseKeepingService
        .UpdateSMSInfo(formValue)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.getDataList();
            alert('Data Saved Successfully');
            this.initializeForm();
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  };
}
