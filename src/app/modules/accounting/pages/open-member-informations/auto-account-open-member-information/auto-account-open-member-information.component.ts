import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import { AccountOpenService } from 'src/app/services/account-open.service';
import { MemberApplicationService } from 'src/app/services/member-application.service';
import { OpenMemberInformationService } from 'src/app/services/open-member-information.service';
import {
  AccountOpeningModel,
  GenerateNewAccountModel,
  IVillageDetails,
  MemberApplicationInputHelp,
  MemberInfoForAccountOpeningModel,
} from '../../../models/member-application.model';
import { ApproveMemberApplicationService } from '../../../services/approve-member-application.service';
import { AddNomineeComponent } from '../../approve-member-application/auto-new-account-openning/add-nominee/add-nominee.component';

@Component({
  selector: 'app-auto-account-open-member-information',
  templateUrl: './auto-account-open-member-information.component.html',
  styleUrls: ['./auto-account-open-member-information.component.css'],
})
export class AutoAccountOpenMemberInformationComponent implements OnInit {
  module: string = '1';
  public inputHelpData: MemberApplicationInputHelp =
    new MemberApplicationInputHelp();
  updateCLick: boolean = false;
  showUpdateBtn: boolean = false;
  autoAccForm: FormGroup;
  applicationNo: any;
  applicationList = [];
  approveMemberInfo: any;
  accTypeMemberInfo = [];
  nomineeList = [];
  accTypeNonMemberInfo: GenerateNewAccountModel[] = [];
  newAccTypeMemberInfo: GenerateNewAccountModel[] = [];
  generateAccNo = [];
  intCalculationInfo: IdDescription[] = [];
  smsServiceInfo = [];
  getMemInfo: any;
  newAccType: any;
  nomineeForm: FormGroup;
  accTypeDataList: AccountOpeningModel[] = [];
  sentInfoData: MemberInfoForAccountOpeningModel =
    new MemberInfoForAccountOpeningModel();
  private destroy$: Subject<void> = new Subject<void>();
  public nomineeVillage: IVillageDetails;
  updateButtonState: boolean = false;
  submitButtonState: boolean = true;
  currentAccNoForNominee: any;
  getMemNo: any;
  getMemType: any;

  constructor(
    private route: ActivatedRoute,
    private approveMemberApplicationService: ApproveMemberApplicationService,
    private pService: AccountOpenService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
    private applicationService: MemberApplicationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private openMemberInformationService: OpenMemberInformationService
  ) {
    this.nomineeVillage = { VillageCode: 0 };
  }

  ngOnInit(): void {
    this.pService.checkTemp = false;
    // this.test();
    this.getMemNo = this.openMemberInformationService.MemNo;
    this.getMemType = this.openMemberInformationService.MemType;
    this.initializeForm();
    this.applicationService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log('this is value of line 63', data);
      });
    this.getIntCalculationDes();
    this.applicationNo = this.route.snapshot.paramMap.get('source');
    this.getApprovedMemberApplication();
    this.findMemberType();
  }

  private initializeForm() {
    this.autoAccForm = new FormGroup({
      oldAcc: new FormControl(''),
      intFlag: new FormControl('1'),
      smsFlag: new FormControl('0'),
    });
  }
  // Prevent for reload and close screen
  // @HostListener("window:beforeunload", ["$event"])
  // beforeUnloadHander(event) {
  //     this.codeINeedToRun();

  //     //failed attempts to prevent popup =>
  //     event.preventDefault();
  //     event.returnValue = null;
  //     window.onbeforeunload = function () {
  //         return null;
  //     };
  //     event.stopPropagation();
  // }
  // codeINeedToRun(){
  //   console.log("Hello");
  // }

  // Get Member Approve Application information
  getApprovedMemberApplication = () => {
    this.spinner.show();
    this.approveMemberApplicationService
      .getApprovedMemberApplication()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.applicationList = x;
          console.log('This is applcation list', this.applicationList);
          this.findMemberType();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  findMemberType = () => {
    console.log('this is memtype', this.getMemType);
    if (this.getMemType == '1') {
      this.getAccTypeMemberInfo();
    } else {
      this.getAccTypeNonMemberInfo();
    }
    console.log('This is approve member info---->', this.approveMemberInfo);
  };

  getAccTypeMemberInfo = () => {
    this.spinner.show();
    this.approveMemberApplicationService
      .getAccTypeMemApplication()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          console.log('This is get value', x);
          this.accTypeMemberInfo = x;
          this.newAccTypeMemberInfo = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  getAccTypeNonMemberInfo = () => {
    this.spinner.show();
    this.approveMemberApplicationService
      .getAccTypeNonMemApplication()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.accTypeNonMemberInfo = x;
          //this.newAccTypeMemberInfo = x;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Get Int Calculation Description
  getIntCalculationDes = () => {
    this.spinner.show();
    this.approveMemberApplicationService
      .getIntCalculationDes()
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          this.spinner.hide();
          this.intCalculationInfo = x;
          console.log('This is value of line 85', x);
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  // Sent Acctype data

  postAcctype(data: any) {
    this.showUpdateBtn = true;
    this.newAccType = data;
    let selectedCode = this.accTypeDataList.find(
      (x) => x.AccType == data.AccType
    );
    let value = {
      AccType: Number(data.AccType),
      AccTitle: data.Description,
      InterestCalculation: Number(this.autoAccForm.value.intFlag),
      SMSService: Number(this.autoAccForm.value.smsFlag),
      OldAccNo: Number(this.autoAccForm.value.oldAcc),
    };
    if (!selectedCode) {
      this.accTypeDataList.push(value);
    } else {
      this.accTypeDataList = this.accTypeDataList.filter(
        (item) => item.AccType != data.AccType
      );
    }
    console.log('This is checked value', this.accTypeDataList);
  }

  // Sent Data to backend

  postAllMeminfo() {
    this.sentInfoData.OldAccNo = this.autoAccForm.value.oldAcc;
    this.sentInfoData.IntFlag = this.autoAccForm.value.intFlag;
    this.sentInfoData.SmsFlag = this.autoAccForm.value.smsFlag;
    this.updateCLick = true;
    this.getMemInfo = this.approveMemberApplicationService.getInformation();
    this.SaveData();
    //this.newAccountNumberGenerate();
  }

  newAccountNumberGenerate() {
    console.log('this is value of line no 118', this.getMemInfo);
    for (let i = 0; i < this.accTypeDataList.length; i++) {
      this.sentInfoData.AccType = this.accTypeDataList[i].AccType;
      this.sentInfoData.MemNo = this.getMemInfo.MemNo;
      this.sentInfoData.MemType = this.getMemInfo.MemType;
      console.log('Sent info Data', this.sentInfoData);

      this.approveMemberApplicationService
        .postMemInfo(this.sentInfoData)
        .pipe(first())
        .subscribe(
          (x: any) => {
            console.log('This is value of line number 130', x);
            for (let j = 0; j < this.newAccTypeMemberInfo.length; j++) {
              if (
                this.newAccTypeMemberInfo[j].AccType ==
                  this.accTypeDataList[i].AccType &&
                (this.newAccTypeMemberInfo[j].NewAccNo == null ||
                  this.newAccTypeMemberInfo[j].NewAccNo == 0)
              ) {
                this.newAccTypeMemberInfo[j].NewAccNo = Number(x);
              } else if (this.newAccTypeMemberInfo[j].NewAccNo != null) {
              } else {
                this.newAccTypeMemberInfo[j].NewAccNo = 0;
              }
            }
            console.log('This is Account no', this.newAccTypeMemberInfo);
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }

  SaveData = () => {
    console.log('This is accountlist', this.accTypeDataList);
    console.log('This is getinfo', this.getMemInfo);
    this.spinner.show();
    let sentData = {
      NewMemNo: this.openMemberInformationService.MemNo,
      MemType: this.openMemberInformationService.MemType,
      AccList: this.accTypeDataList,
    };
    this.openMemberInformationService
      .saveAccData(sentData)
      .pipe(first())
      .subscribe(
        (x: any[]) => {
          console.log(x);
          if (this.newAccTypeMemberInfo.length > 0) {
            for (var j = 0; j < x.length; j++) {
              for (var i = 0; i < this.accTypeMemberInfo.length; i++) {
                if (this.accTypeMemberInfo[i].AccType == x[j].AccType) {
                  this.accTypeMemberInfo[i].NewAccNo = x[j].NewAccNo;
                  this.newAccTypeMemberInfo = this.accTypeMemberInfo;
                }
              }
            }
            for (var i = 0; i < this.newAccTypeMemberInfo.length; i++) {
              if (this.newAccTypeMemberInfo[i].NewAccNo > 0) {
              } else {
                this.newAccTypeMemberInfo[i].NewAccNo = 0;
              }
            }
            console.log('this is sir', this.newAccTypeMemberInfo);
          } else {
            for (var j = 0; j < x.length; j++) {
              for (var i = 0; i < this.accTypeNonMemberInfo.length; i++) {
                if (this.accTypeNonMemberInfo[i].AccType == x[j].AccType) {
                  this.accTypeNonMemberInfo[i].NewAccNo = x[j].NewAccNo;
                  this.newAccTypeMemberInfo = this.accTypeNonMemberInfo;
                }
              }
            }
            for (var i = 0; i < this.newAccTypeMemberInfo.length; i++) {
              if (this.newAccTypeMemberInfo[i].NewAccNo > 0) {
              } else {
                this.newAccTypeMemberInfo[i].NewAccNo = 0;
              }
            }
            console.log('this is sir', this.newAccTypeMemberInfo);
          }
          this.spinner.hide();
          debugger;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  };

  callNomineeModal(event: any) {
    console.log('this is nomiee', event);
    this.approveMemberApplicationService.nomineeAccNo = event.NewAccNo;
    this.approveMemberApplicationService.AccType = event.AccType;
    this.pService.MemNo = this.openMemberInformationService.MemNo;
    this.pService.AccType = event.AccType;
    this.pService.AccNo = event.NewAccNo;
    this.pService.MemType = this.openMemberInformationService.MemType;
    this.approveMemberApplicationService.nomineeAccNo = event.nomineeAccNo;
    this.pService.checkTemp = false;

    const modalRef = this.modalService.open(AddNomineeComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'my-modal',
    });
  }
}
