import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountLedgerBalanceReport } from '../../models/ledger-balance-report.model';
import { MobileSmsService } from '../../services/mobile-sms.service';

@Component({
  selector: 'app-account-ledger-balance-sms-service',
  templateUrl: './account-ledger-balance-sms-service.component.html',
  styleUrls: ['./account-ledger-balance-sms-service.component.css'],
})
export class AccountLedgerBalanceSmsServiceComponent implements OnInit {
  accTypeList: any;
  collectorCodeList: any;
  groupNameList: any;
  processDate: any;
  accLedgerBalanceSMSForm: FormGroup;
  isDisableCollector: boolean = true;
  isDisableGroup: boolean = true;
  selectedAccTypeList: any[] = [];
  showGenerateList: boolean = false;
  generateList: any[] = [];
  selectedAccList: any[] = [];

  constructor(
    private mobileSmsService: MobileSmsService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.isDisableCollector = true;
    this.isDisableGroup = true;
    this.selectedAccTypeList = [];
    this.showGenerateList = false;
    this.generateList = [];
    this.selectedAccList = [];
  }

  initializeForm() {
    this.accLedgerBalanceSMSForm = new FormGroup({
      CollectorCode: new FormControl('0'),
      GroupName: new FormControl('0'),
    });
    this.accLedgerBalanceSMSForm.controls['CollectorCode'].disable();
    this.accLedgerBalanceSMSForm.controls['GroupName'].disable();
    this.pageLoad();
  }

  pageLoad() {
    this.spinner.show();
    this.mobileSmsService
      .SMSMemberBalanceLedgerPageLoad()
      .pipe(first())
      .subscribe((x: any) => {
        console.log(x);
        this.accTypeList = x.AccTypeList;
        this.collectorCodeList = x.CollectorCodeList;
        this.groupNameList = x.GroupNameList;
        this.processDate = x.ProcessDate;
        this.spinner.hide();
      });
  }
  changeCheckGroup() {
    if (this.isDisableGroup == true) {
      this.isDisableGroup = false;
      this.accLedgerBalanceSMSForm.controls['GroupName'].enable();
    } else {
      this.isDisableGroup = true;
      this.accLedgerBalanceSMSForm.controls['GroupName'].disable();
    }
  }

  changeCheckCollector() {
    if (this.isDisableCollector == true) {
      this.isDisableCollector = false;
      this.accLedgerBalanceSMSForm.controls['CollectorCode'].enable();
    } else {
      this.isDisableCollector = true;
      this.accLedgerBalanceSMSForm.controls['CollectorCode'].disable();
    }
  }

  collectorCodeChange() {
    let selectedCode = this.collectorCodeList.find(
      (x) => x.Id == this.accLedgerBalanceSMSForm.value.CollectorCode
    );
    if (selectedCode) {
      this.accLedgerBalanceSMSForm.controls['CollectorCode'].setValue(
        this.accLedgerBalanceSMSForm.value.CollectorCode
      );
      this.mobileSmsService
        .accLedBalCollectorCodeChangeData(
          this.accLedgerBalanceSMSForm.value.CollectorCode
        )
        .pipe(first())
        .subscribe((x: any) => {
          this.groupNameList = x;
        });
    } else {
      alert('Please input a valid collector code');
      this.accLedgerBalanceSMSForm.controls['CollectorCode'].setValue('0');
    }
  }

  groupCodeChange() {
    let selectedCode = this.groupNameList.find(
      (x) => x.Id == this.accLedgerBalanceSMSForm.value.GroupName
    );
    if (selectedCode) {
      this.accLedgerBalanceSMSForm.controls['GroupName'].setValue(
        this.accLedgerBalanceSMSForm.value.GroupName
      );
    } else {
      alert('Please input a valid Group Name');
      this.accLedgerBalanceSMSForm.controls['GroupName'].setValue('0');
    }
  }

  changeAccTypeCheck(item: any) {
    if (this.selectedAccTypeList.find((x) => x.Id == item.Id)) {
      this.selectedAccTypeList = this.selectedAccTypeList.filter(
        (x) => x.Id != item.Id
      );
    } else {
      this.selectedAccTypeList.push(item);
    }
  }

  btnGenerateClick() {
    if (this.selectedAccTypeList.length == 0) {
      alert('Please select an account type first!');
    } else if (this.selectedAccTypeList.length > 4) {
      alert('More Then Four A/c Type Select');
    } else {
      let data = {
        ProcessDate: this.processDate,
        SelectedAccList: this.selectedAccTypeList,
        CollectorCodeCheck: this.isDisableCollector,
        GroupNameCheck: this.isDisableGroup,
        CollectorCode: this.accLedgerBalanceSMSForm.value.CollectorCode,
        GroupNameCode: this.accLedgerBalanceSMSForm.value.GroupNameCode,
      };
      this.spinner.show();
      this.mobileSmsService
        .AccLedBalSMSGenerate(data)
        .pipe(first())
        .subscribe((x: any) => {
          console.log(x);
          if (x.Success) {
            this.showGenerateList = true;
            console.log('this is generate list ===>>', this.showGenerateList);
            this.generateList = x.AccBalanceAccountList;
          } else {
            alert(x.Message);
          }
          this.spinner.hide();
        });
    }
  }

  changeAccCheck(item: any) {
    if (this.selectedAccList.find((x) => x == item)) {
      this.selectedAccList = this.selectedAccList.filter((x) => x != item);
    } else {
      this.selectedAccList.push(item);
    }
    console.log('this is check list', this.selectedAccList);
  }

  selectAllAcc() {
    for (var i = 0; i < this.generateList.length; i++) {
      this.generateList[i].SelectFlag = true;
      this.selectedAccList.push(this.generateList[i].Id);
    }
  }
  unselectAllAcc() {
    for (var i = 0; i < this.generateList.length; i++) {
      this.generateList[i].SelectFlag = false;
    }
    this.selectedAccList = [];
  }

  backBtnClick() {
    this.showGenerateList = false;
    this.selectedAccTypeList = [];
    this.selectedAccList = [];
  }

  exitPage() {
    this.router.navigate(['accounting/']);
  }

  sendSMSClick() {
    if (this.selectedAccList.length == 0) {
      alert('No select member no.');
    } else {
      var data = [];
      for (var i = 0; i < this.selectedAccList.length; i++) {
        let SMSSendModel = {
          mobileNo: this.selectedAccList[i].MemPreMobile,
          balance: this.selectedAccList[i].ClosingA,
        }
        data.push(SMSSendModel);
      }
      console.log('this is selected list', data);

      this.mobileSmsService
        .SendMsg(data)
        .pipe(first())
        .subscribe((x: any) => {
          console.log('this is response', x);
        });
      // this.mobileSmsService
      //   .AccLedBalSMSSend(this.selectedAccList)
      //   .pipe(first())
      //   .subscribe((x: any) => {
      //     if (x.Success) {
      //       alert(x.Message);
      //       this.ngOnInit();
      //     } else {
      //       alert(x.Message);
      //     }
      //   });
    }
  }
}
