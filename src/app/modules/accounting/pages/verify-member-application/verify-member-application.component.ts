import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { HouseKeepingService } from 'src/app/modules/house-keeping/house-keeping.service';
import { MemberRejectedCode, MemberVerifyCode } from 'src/app/modules/Models/HoseKeepingModel';
import { VerifyMemberApplicationService } from '../../services/verify-member-application.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportCommonModel, ReportKeyValue } from 'src/app/Models/report-common.model';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verify-member-application',
  templateUrl: './verify-member-application.component.html',
  styleUrls: ['./verify-member-application.component.css']
})
export class VerifyMemberApplicationComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel=new ReportCommonModel();
  memberVerifyForm: FormGroup;
  memberAlldataForm: FormGroup;
  dataList: MemberVerifyCode[] = [];
  RdataList: MemberRejectedCode[] = [];
  applicationList = [];
  displayVerifyData: boolean = false;
  displayRejectData: boolean = false;
  ApplicationNoVerify: any;
  ApplicationNoReject: any;
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  constructor(private houseKeepingService: HouseKeepingService,
     private verifyMemberApplicationService: VerifyMemberApplicationService,
     private spinner: NgxSpinnerService,
     private toastr: ToastrService,
     private sanitizer: DomSanitizer,
    private aService:ReportCommonService) {
      this.reportModel.ReportName="rptCsMemberApplicationRegister";
      this.reportModel.Values=[];
    }


  ngOnInit(): void {
    this.getVerifyDataList();
    this.getRejectDataList();
    this.getMemberApplicationData();
    this.initializeForm();
  }
  private initializeForm() {
    this.memberVerifyForm = new FormGroup({
      selectedVerifyCode: new FormControl("0"),
      selectedRejectCode: new FormControl("0")
    });
  }

  // Get Member Application information

  getMemberApplicationData = () => {
    this.spinner.show();
    this.verifyMemberApplicationService.getMemberApplicationInfo().pipe(first()).subscribe((x: any[]) => {
      this.spinner.hide();
      this.applicationList = x;
      console.log("Load Data Is:",this.applicationList)
      if(this.applicationList.length==0){
        // alert("There is no application to verify!!")
      }
      console.log(this.applicationList);
    }, err => {
      this.spinner.hide();
    })
  }

  // Get Member verify note  Data
  getVerifyDataList = () => {
    this.spinner.show();
    this.houseKeepingService.getDataList('MemberVerifyCode').pipe(first()).subscribe((x: MemberVerifyCode[]) => {
      this.spinner.hide();
      this.dataList = x;
      console.log("VrifyDataList:",this.dataList)
    }, err => {
      this.spinner.hide();
    })
  }

  // Show Verify Application Screen
  displayVerifyOption(event: any) {
    this.ApplicationNoVerify = event.target.value;
    console.log(this.ApplicationNoVerify)
    this.initializeForm();
    this.displayVerifyData = true;
    this.displayRejectData = false;
  }

  // Close Verify Application Screen
  closeVerifyOption() {
    this.displayVerifyData = false;
  }
  // Member Verify data pass
  verifyInfo() {
    this.memberAlldataForm = new FormGroup({
      ApplicationNoVerify: new FormControl(""),
      MVerifyCode: new FormControl(""),
      MVerifyDescription: new FormControl("")
    });
    let dataCheck = this.memberAlldataForm.value;
    let verifyData = this.memberVerifyForm.value;
    let selectedCode = this.dataList.find((x) => x.MVerifyCode == verifyData.selectedVerifyCode);
    if (verifyData.selectedVerifyCode != '0') {
      dataCheck.ApplicationNoVerify = this.ApplicationNoVerify;
      dataCheck.MVerifyCode = verifyData.selectedVerifyCode;
      dataCheck.MVerifyDescription = selectedCode.MVerifyDescription;
      if (confirm("Do you want to Verify Application??")) {
        this.verifyMemberApplication(dataCheck);
      }

    }
    this.displayVerifyData = false;
    console.log(dataCheck);
  }

  // Member Verify API Calling
  verifyMemberApplication(data) {
    this.spinner.show();
    this.verifyMemberApplicationService.verifyMember(data).pipe(first()).subscribe((x: any[]) => {
      this.getMemberApplicationData();
      this.initializeForm();
      this.spinner.hide();
      alert("Verifiyed Application No " + this.ApplicationNoVerify)
    }, err => {
      this.spinner.hide();
    })
  }

  // Get Member rejeted note Data
  getRejectDataList = () => {
    this.spinner.show();
    this.houseKeepingService.getDataList('MemberRejectCode').pipe(first()).subscribe((x: MemberRejectedCode[]) => {
      this.spinner.hide();
      this.RdataList = x;
      console.log(this.RdataList);
    }, err => {
      this.spinner.hide();
    })
  }

  // Show Reject Application Screen
  displayRejectOption(event: any) {
    this.ApplicationNoReject = event.target.value;
    console.log(this.ApplicationNoReject)
    this.initializeForm();
    this.displayRejectData = true;
    this.displayVerifyData = false;
  }
  // Close Reject Application Screen
  closeRejectOption() {
    this.displayRejectData = false;
  }

  // Member Reject data pass
  rejectInfo() {
    this.memberAlldataForm = new FormGroup({
      ApplicationNoReject: new FormControl(""),
      MRejectCode: new FormControl(""),
      MRejectDescription: new FormControl("")
    });
    let dataCheck = this.memberAlldataForm.value;
    let rejectData = this.memberVerifyForm.value;
    let selectedCode = this.RdataList.find((x) => x.MRejectCode == rejectData.selectedRejectCode);
    if (rejectData.selectedRejectCode != '0') {
      dataCheck.ApplicationNoReject = this.ApplicationNoReject;
      dataCheck.MRejectCode = rejectData.selectedRejectCode;
      dataCheck.MRejectDescription = selectedCode.MRejectDescription;
      if (confirm("Do you want to Reject Member Application??")) {
        this.rejectMemberApplication(dataCheck);
      }
    }
    this.displayRejectData = false;
    console.log(dataCheck);
  }

  // Member Reject API Calling

  rejectMemberApplication(data) {
    this.spinner.show();
    this.verifyMemberApplicationService.rejectMember(data).pipe(first()).subscribe((x: any[]) => {
      this.getMemberApplicationData();
      this.initializeForm();
      this.spinner.hide();
      alert("Reject Application No " + this.ApplicationNoReject);
    }, err => {
      this.spinner.hide();
    })
  }


  public getReportToken = (item:any) => {
    console.log("Item",item)
    this.spinner.show();
    this.setParameter(item);
    this.displayIFrame = true;
    console.log(this.reportModel);
    this.aService
      .getReportToken(this.reportModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (x) => {
          this.setIframe(x);
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
    // }
  };
  private setParameter(Item:any): void {
    var fValue = this.memberVerifyForm.value;
    this.reportModel.Values = [];
    console.log("PushedVaalue:",Item.MemApplicationNo)
    this.reportModel.Values.push(
      new ReportKeyValue('MemberNo',Item.MemApplicationNo ),

    );

  }

    private setIframe=(x:any)=>{

      var iFramePath =environment.reportUrl + 'id=' + x.id +'&token=' + x.token;
      window.open(iFramePath,"_blank");
    }

}
