import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { GreetingSMSInfoService } from 'src/app/services/greetings-sms.service';
import { GreetingsSMSPageLoadModel } from '../../models/greetings-sms.model';
import { MobileSmsService } from '../../services/mobile-sms.service';

@Component({
  selector: 'app-member-greeting-sms-service',
  templateUrl: './member-greeting-sms-service.component.html',
  styleUrls: ['./member-greeting-sms-service.component.css'],
})
export class MemberGreetingSmsServiceComponent implements OnInit {
  accTypeList: any;
  collectorCodeList: any;
  groupNameList: any;
  processDate: any;
  greetingSMSForm: FormGroup;
  isDisableCollector: boolean = true;
  isDisableGroup: boolean = true;
  SHowGrid: boolean = false;
  GridData: any[] = [];
  count: number = 0;
  PhoneNumArr: any[] = [];

  AllNumber: string = '';
  modelDataSMS: any = {};

  public pageLoadData: GreetingsSMSPageLoadModel = new GreetingsSMSPageLoadModel();

  constructor(
    private mobileSmsService: MobileSmsService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: Router,
    private greetingSMSInfoService: GreetingSMSInfoService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.greetingSMSForm = new FormGroup({
      CollectorCode: new FormControl(''),
      CollectorCodeDDL: new FormControl('0'),
      GroupName: new FormControl(''),
      GroupNameDDL: new FormControl('0'),
      GreetingSMS: new FormControl(''),
      GreetingsRb: new FormControl('0'),
    });
    this.greetingSMSForm.controls['CollectorCode'].disable();
    this.greetingSMSForm.controls['GroupName'].disable();
    this.greetingSMSForm.controls['CollectorCodeDDL'].disable();
    this.greetingSMSForm.controls['GroupNameDDL'].disable();
    this.pageLoad();
  }

  pageLoad() {
    this.spinner.show();
    this.greetingSMSInfoService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((x: any) => {
        console.log('Alll Data--->', x);
        this.pageLoadData = x;
        this.spinner.hide();
      });
  }

  changeCheckGroup() {
    if (this.isDisableGroup == true) {
      this.isDisableGroup = false;
      this.greetingSMSForm.controls['GroupName'].enable();
      this.greetingSMSForm.controls['GroupNameDDL'].enable();
    } else {
      this.isDisableGroup = true;
      this.greetingSMSForm.controls['GroupName'].disable();
      this.greetingSMSForm.controls['GroupNameDDL'].disable();
      this.greetingSMSForm.controls['GroupName'].setValue('');
      this.greetingSMSForm.controls['GroupNameDDL'].setValue('0');
    }
  }

  changeCheckCollector() {
    if (this.isDisableCollector == true) {
      this.isDisableCollector = false;
      this.greetingSMSForm.controls['CollectorCode'].enable();
      this.greetingSMSForm.controls['CollectorCodeDDL'].enable();
    } else {
      this.isDisableCollector = true;
      this.greetingSMSForm.controls['CollectorCode'].disable();
      this.greetingSMSForm.controls['CollectorCodeDDL'].disable();
      this.greetingSMSForm.controls['CollectorCode'].setValue('');
      this.greetingSMSForm.controls['CollectorCodeDDL'].setValue('0');
    }
  }

  CollectorCodeChange() {
    this.greetingSMSForm.controls['CollectorCodeDDL'].setValue(
      this.greetingSMSForm.value.CollectorCode
    );
  }

  CollectorCodeDDLChange() {
    this.greetingSMSForm.controls['CollectorCode'].setValue(
      this.greetingSMSForm.value.CollectorCodeDDL
    );
  }

  GroupCodeChange() {
    this.greetingSMSForm.controls['GroupNameDDL'].setValue(
      this.greetingSMSForm.value.GroupName
    );
  }

  GroupCodeDDLChange() {
    this.greetingSMSForm.controls['GroupName'].setValue(
      this.greetingSMSForm.value.GroupNameDDL
    );
  }

  GenerateSms() {
    this.spinner.show();

    let modelData: any = {};
    if (this.isDisableCollector) {
      modelData.colCode = 0;
    } else {
      modelData.colCode = this.greetingSMSForm.value.CollectorCode;
    }

    if (this.isDisableGroup) {
      modelData.groupCode = 0;
    } else {
      modelData.groupCode = this.greetingSMSForm.value.GroupName;
    }

    modelData.rbValue = this.greetingSMSForm.value.GreetingsRb;
    modelData.ChbCol = this.isDisableCollector;
    modelData.ChbGrp = this.isDisableGroup;

    this.greetingSMSInfoService
      .GenerateSMSData(modelData)
      .pipe(first())
      .subscribe((data: any) => {
        console.log('GenerateData', data);
        if (data.count == 0) {
          alert('There Is No Member To Wish Today!!!');
          this.spinner.hide();
          location.reload();
          return;
        }
        this.spinner.hide();
        this.GridData = data.SMSGenerateData;
      });
  }

  public CheckMethod(data: any) {
    //new start
    this.AllNumber = '';

    if (data.TrackFlag == 0) {
      data.TrackFlag = 1;
      this.PhoneNumArr.push(data.MobileNo);
    } else {
      data.TrackFlag = 0;
      this.PhoneNumArr = this.PhoneNumArr.filter((x) => x != data.MobileNo);
    }

    console.log('data------', data);
    console.log('PhoneNumber------', this.PhoneNumArr);
  }

  public SaveSMS() {
    console.log('Hello!!');
    this.greetingSMSInfoService
      .SaveGreetingSMS(this.GridData)
      .pipe(first())
      .subscribe((data: any) => {
        this.GridData = data.SMSGenerateData;
        console.log('After2ndModification---->', this.GridData);
      });
  }

  public SendSMS() {
    this.spinner.show();
    this.AllNumber = '';
    //new start
    for (let i = 0; i < this.PhoneNumArr.length; i++) {
      this.AllNumber += this.PhoneNumArr[i] + ',';
    }
    //new end

    console.log('String Number::->', this.AllNumber);
    var fValue = this.greetingSMSForm.value.GreetingSMS;
    var message;
    if (fValue == '') {
      message = '';
    } else {
      message = fValue;
    }

    this.modelDataSMS = {};
    this.modelDataSMS.Message = message;
    this.modelDataSMS.AllNumber = this.AllNumber;
    console.log('This is data =>>', this.modelDataSMS);

    this.greetingSMSInfoService
      .SendGreetingSMS(this.modelDataSMS)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.Success) {
          this.spinner.hide();
          this.AllNumber = '';
          this.modelDataSMS.AllNumber = '';
          console.log(data.SuccessMessage);
          alert(data.SuccessMessage);
        } else {
          this.spinner.hide();
          this.AllNumber = '';
          this.modelDataSMS.AllNumber = '';
          console.log(data.SuccessMessage);
          alert(data.SuccessMessage);
        }
      });
  }
}
