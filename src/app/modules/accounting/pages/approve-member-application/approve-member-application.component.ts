import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router'
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { HouseKeepingService } from 'src/app/modules/house-keeping/house-keeping.service';
import { MemberApprovedCode, MemberRejectedCode } from 'src/app/modules/Models/HoseKeepingModel';
import { ApproveMemberApplicationService } from '../../services/approve-member-application.service';
import { AccountOpenService } from 'src/app/services/account-open.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { Subject } from 'rxjs';
import { ReportCommonModel, ReportKeyValue } from 'src/app/Models/report-common.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approve-member-application',
  templateUrl: './approve-member-application.component.html',
  styleUrls: ['./approve-member-application.component.css']
})
export class ApproveMemberApplicationComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel=new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  memberApproveForm: FormGroup;
  memberAlldataForm: FormGroup;
  applicationList = [];
  dataList = [];
  RdataList = [];
  NewMemNo=[];
  memType:number;
  displayApproveData: boolean = false;
  displayRejectData: boolean = false;
  @Output()ApplicationNoApprove: any;
  ApplicationNoReject: any;
  constructor(private houseKeepingService: HouseKeepingService,
    private approveMemberApplicationService: ApproveMemberApplicationService,
    private pService: AccountOpenService,
     private spinner: NgxSpinnerService,
     private toastr: ToastrService,
     private router: Router,
     private sanitizer: DomSanitizer,
     private aService:ReportCommonService) {
       this.reportModel.ReportName="rptCsMemberApplicationRegister";
       this.reportModel.Values=[];
     }

  ngOnInit(): void {
    this.getMemberApproveApplicationData();
    this.getDataList();
    this.getRejectDataList();
    this.initializeForm();
  }

  private initializeForm() {
    this.memberApproveForm = new FormGroup({
      selectedApproveCode: new FormControl("0"),
      selectedRejectCode: new FormControl("0")
    });
  }

  // Get Member Approve Application information

  getMemberApproveApplicationData = () => {
    this.spinner.show();
    this.approveMemberApplicationService.getMemberApproveApplicationInfo().pipe(first()).subscribe((x: any[]) => {
      this.spinner.hide();
      this.applicationList = x;
      console.log(this.applicationList);
    }, err => {
      this.spinner.hide();
    })
  }

  //Get Member Approve Note Data
  getDataList = () => {
    this.spinner.show();
    this.houseKeepingService.getDataList('MemberApproveCode').pipe(first()).subscribe((x: MemberApprovedCode[]) => {
      this.spinner.hide();
      this.dataList = x;
      console.log(this.getDataList);
    }, err => {
      this.spinner.hide();
    })
  }

  // Show Approve Application Screen
  displayApproveOption(data: any) {
    this.ApplicationNoApprove = data.MemApplicationNo;
    console.log(data);
    this.initializeForm();
    this.displayApproveData = true;
    this.displayRejectData = false;
    this.memType = data.MemType;
    this.approveMemberApplicationService.MemType = this.memType;
  }

  // Close Verify Application Screen
  closeApproveOption() {
    this.displayApproveData = false;
  }

  // Member Approve data pass
  approveInfo() {
    this.memberAlldataForm = new FormGroup({
      ApplicationNoApprove: new FormControl(""),
      MApproveCode: new FormControl(""),
      MApproveDescription: new FormControl("")
    });
    let dataCheck = this.memberAlldataForm.value;
    let approveData = this.memberApproveForm.value;
    let selectedCode = this.dataList.find((x) => x.MApproveCode == approveData.selectedApproveCode);
    console.log('this is approve data ',approveData);
    console.log('this is selected code ', selectedCode);
    console.log('this is datacheck ', dataCheck);
    if (approveData.selectedApproveCode != '0') {
      console.log('this is appliction list ', this.applicationList);
      dataCheck.ApplicationNoApprove = this.ApplicationNoApprove;
      dataCheck.MApproveCode = approveData.selectedApproveCode;
      dataCheck.MApproveDescription = selectedCode.MApproveDescription;
      dataCheck.Memtype = this.memType;
      this.approveMemberApplication(dataCheck);
      console.log("This is data check",selectedCode);
      this.displayApproveData = false;
    }
    console.log(dataCheck);
  }

  // Member Approve API Calling
  approveMemberApplication(data) {
    this.spinner.show();
    console.log(data);
    this.approveMemberApplicationService.approveMember(data).pipe(first()).subscribe((x: any) => {
      console.log("this is data for data", x)
      this.NewMemNo = x;
      this.getMemberApproveApplicationData();
      this.initializeForm();
      this.spinner.hide();
      let selectedCode = this.applicationList.find((x) => x.MemApplicationNo == this.ApplicationNoApprove);
      this.approveMemberApplicationService.setMemberInformation(selectedCode);
      console.log("This is selected code vlaue", selectedCode);
      console.log("This is Application List value", this.applicationList)
      this.approveMemberApplicationService.NewMemNo = x.NewMemNo;
      setTimeout(() => {
        this.router.navigate(['accounting/auto-new-account-openning/'+this.ApplicationNoApprove]);
      },
        1000);
      alert("New Member No " + x.NewMemNo);
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
    this.displayApproveData = false;
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
    let rejectData = this.memberApproveForm.value;
    let selectedCode = this.RdataList.find((x) => x.MRejectCode == rejectData.selectedRejectCode);
    if (rejectData.selectedRejectCode != '0') {
      dataCheck.ApplicationNoReject = this.ApplicationNoReject;
      dataCheck.MRejectCode = rejectData.selectedRejectCode;
      dataCheck.MRejectDescription = selectedCode.MRejectDescription;
      if (confirm("Do you want to Reject Application??")) {
        this.rejectMemberApplication(dataCheck);
      }
      this.displayRejectData = false;
    }
    console.log(dataCheck);
  }

  // Member Reject API Calling

  rejectMemberApplication(data) {
    this.spinner.show();
    this.approveMemberApplicationService.rejectMember(data).pipe(first()).subscribe((x: any[]) => {
      this.getMemberApproveApplicationData();
      this.initializeForm();
      this.spinner.hide();
      alert("Rejected Application No " + this.ApplicationNoReject);
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
    var fValue = this.memberApproveForm.value;
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
