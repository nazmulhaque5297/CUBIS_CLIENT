import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { ReportCommonService } from 'src/app/services/report-common.service';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { ReportEnum } from 'src/app/enums/report-enum';
import { FormGroup, FormControl } from '@angular/forms';
import { MemRegRptService } from 'src/app/services/memRegRpt-report.service';
import { MemRegRptReportInputHelp } from 'src/app/Models/memregrpt-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';

@Component({
  selector: 'app-member-register-report',
  templateUrl: './member-register-report.component.html',
  styleUrls: ['./member-register-report.component.css'],
})
export class MemberRegisterReportComponent implements OnInit, OnDestroy {
  module: string = '1';
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  chbIsAllMemberTypeStatus: any;
  chbIsAllCollectorStatus: any;
  chbIsAllGroupStatus: any;
  chbIsAllGenderStatus: any;
  chbIsAllReligionStatus: any;
  chbIsAllBloodGroupStatus: any;
  chbIsAllStatusStatus: any;
  chbIsAllDateStatus: any;
  chbIsAllAgeStatus: any;
  chbIsAllMobileStatus:any;
  IsMemberTypeDisabled: any;
  IsCollectorDisabled: any;
  IsGroupDisabled: any;
  IsGenderDisabled: any;
  IsReligionDisabled: any;
  IsBloodGroupDisabled: any;
  IsStatusDisabled: any;
  IsMobileDisabled:any;
  storefDate:any;
  MemberRegisterReportForm: FormGroup;

  public inputHelpData: MemRegRptReportInputHelp = new MemRegRptReportInputHelp();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private memRegRptService: MemRegRptService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe
  ) {
    //this.reportModel.ReportName = 'CSGenerateMemberInformation';
    this.reportModel.ReportName = 'rptMCsGenerateMemberList';

    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
    // this.getReportToken();
    // this.displayIFrame = true;
  }
  private initializeForm() {
    this.chbIsAllMemberTypeStatus = true;
    this.chbIsAllCollectorStatus = true;
    this.chbIsAllGroupStatus = true;
    this.chbIsAllGenderStatus = true;
    this.chbIsAllReligionStatus = true;
    this.chbIsAllBloodGroupStatus = true;
    this.chbIsAllStatusStatus = true;
    this.chbIsAllDateStatus = true;
    this.chbIsAllAgeStatus = true;
this.chbIsAllMobileStatus=true;
    this.IsMemberTypeDisabled = true;
    this.IsCollectorDisabled = true;
    this.IsGroupDisabled = true;
    this.IsGenderDisabled = true;
    this.IsReligionDisabled = true;
    this.IsBloodGroupDisabled = true;
    this.IsStatusDisabled = true;
    this.IsMobileDisabled=true;
    this.MemberRegisterReportForm = new FormGroup({
      IsAllMemberType: new FormControl('true'),
      MemberType: new FormControl('0'),
      IsAllCollector: new FormControl('true'),
      Collector: new FormControl('0'),
      IsAllGroup: new FormControl('true'),
      Group: new FormControl('0'),
      IsAllGender: new FormControl('true'),
      Gender: new FormControl('0'),
      IsAllReligion: new FormControl('true'),
      Religion: new FormControl('0'),
      IsAllBloodGroup: new FormControl('true'),
      BloodGroup: new FormControl('0'),
      IsAllMobile: new FormControl('true'),
      Mobile: new FormControl('0'),
      IsAllStatus: new FormControl('true'),
      Status: new FormControl('0'),
      IsAllDate: new FormControl('true'),
      FormOpenDate: new FormControl(''),
      IsAllAge: new FormControl('true'),
      Age: new FormControl(''),
      AgeEqual: new FormControl('0'),
    });
  }
  private setDefaultOptions(): void {
    this.spinner.show();
    this.memRegRptService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.spinner.hide();
      });
  }
  checkIsAllMemberTypeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllMemberTypeStatus = true;
      this.IsMemberTypeDisabled = true;
      this.MemberRegisterReportForm.controls['MemberType'].setValue('0');
    } else {
      this.chbIsAllMemberTypeStatus = false;
      this.MemberRegisterReportForm.get('MemberType').enable();
    }
  }
  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.MemberRegisterReportForm.controls['Collector'].setValue('0');
    } else {
      this.chbIsAllCollectorStatus = false;
      this.MemberRegisterReportForm.get('Collector').enable();
    }
  }
  checkIsAllGroupValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGroupStatus = true;
      this.IsGroupDisabled = true;
      this.MemberRegisterReportForm.controls['Group'].setValue('0');
    } else {
      this.chbIsAllGroupStatus = false;
      this.MemberRegisterReportForm.get('Group').enable();
    }
  }
  checkIsAllGenderValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGenderStatus = true;
      this.IsGenderDisabled = true;
      this.MemberRegisterReportForm.controls['Gender'].setValue('0');
    } else {
      this.chbIsAllGenderStatus = false;
      this.MemberRegisterReportForm.get('Gender').enable();
    }
  }
  checkIsAllReligionValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllReligionStatus = true;
      this.IsReligionDisabled = true;
      this.MemberRegisterReportForm.controls['Religion'].setValue('0');
    } else {
      this.chbIsAllReligionStatus = false;
      this.MemberRegisterReportForm.get('Religion').enable();
    }
  }
  checkIsAllBloodGroupValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllBloodGroupStatus = true;
      this.IsBloodGroupDisabled = true;
      this.MemberRegisterReportForm.controls['BloodGroup'].setValue('0');
    } else {
      this.chbIsAllBloodGroupStatus = false;
      this.MemberRegisterReportForm.get('BloodGroup').enable();
    }
  }
  checkIsAllMobileValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllMobileStatus = true;
      this.IsMobileDisabled = true;
      this.MemberRegisterReportForm.controls['Mobile'].setValue('0');
    } else {
      this.chbIsAllMobileStatus = false;
      this.MemberRegisterReportForm.get('Mobile').enable();
    }
  }
  checkIsAllStatusValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllStatusStatus = true;
      // this.MemberRegisterReportByAccountForm.get('Status').disable();
      this.IsStatusDisabled = true;
      this.MemberRegisterReportForm.controls['Status'].setValue('0');
    } else {
      this.chbIsAllStatusStatus = false;
      this.MemberRegisterReportForm.get('Status').enable();
    }
  }
  checkIsAllDateValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllDateStatus = true;
      this.MemberRegisterReportForm.get('FormOpenDate').disable();
      this.MemberRegisterReportForm.controls['FormOpenDate'].setValue(
        ''
      );
    } else {
      this.chbIsAllDateStatus = false;
      this.MemberRegisterReportForm.get('FormOpenDate').enable();
      this.MemberRegisterReportForm.controls['FormOpenDate'].setValue(
        this.inputHelpData.ApplicationDate
      );
      this.storefDate = this.inputHelpData.ApplicationDate;
    }
  }
  checkIsAllAgeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllAgeStatus = true;
      this.MemberRegisterReportForm.get('Age').disable();
      this.MemberRegisterReportForm.get('AgeEqual').disable();
      this.MemberRegisterReportForm.controls['Age'].setValue('');
      this.MemberRegisterReportForm.controls['AgeEqual'].setValue('0');
    } else {
      this.chbIsAllAgeStatus = false;
      this.MemberRegisterReportForm.get('Age').enable();
      this.MemberRegisterReportForm.get('AgeEqual').enable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.MemberRegisterReportForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(new ReportKeyValue('MemberType', fValue.MemberType));
    this.reportModel.Values.push(new ReportKeyValue('Gender', fValue.Gender));
    this.reportModel.Values.push(
      new ReportKeyValue('Religion', fValue.Religion)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('BloodGroup', fValue.BloodGroup)
    );
    this.reportModel.Values.push(new ReportKeyValue('Group', fValue.Group));
    this.reportModel.Values.push(
      new ReportKeyValue('Collector', fValue.Collector)
    );
    this.reportModel.Values.push(new ReportKeyValue('Mobile', fValue.Mobile));
    this.reportModel.Values.push(new ReportKeyValue('Status', fValue.Status));


    if(fValue.FormOpenDate=="")
    {
      this.reportModel.Values.push(
        new ReportKeyValue('FormOpenDate', "0")
      );
    }
    else{
      this.reportModel.Values.push(
        new ReportKeyValue('FormOpenDate', fValue.FormOpenDate)
      );
    }

if(fValue.Age=="")
{
  this.reportModel.Values.push(new ReportKeyValue('Age', "0"));
}
else{
  this.reportModel.Values.push(new ReportKeyValue('Age', fValue.Age));
}

    if(fValue.AgeEqual=="")
    {
      this.reportModel.Values.push(
        new ReportKeyValue('AgeEqual', "0")
      );
    }
    else{
      this.reportModel.Values.push(
        new ReportKeyValue('AgeEqual', fValue.AgeEqual)
      );
    }

    this.reportModel.Values.push(
      new ReportKeyValue('IsAllDate', fValue.IsAllDate ? '1' : '0')
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IsAllAge', fValue.IsAllAge ? '1' : '0')
    );

    if(this.chbIsAllMemberTypeStatus){
      this.reportModel.Values.push(
        new ReportKeyValue('MemberTypeDesc', 'All Member Type')
      );
    }
    else{
      this.reportModel.Values.push(
        new ReportKeyValue(
          'MemberTypeDesc',
          this.getSelectedItemText(
            fValue.MemberType,
            this.inputHelpData.MemberTypeList
          )
        )
      );
    }
    
    if (this.chbIsAllGroupStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('GroupDesc', 'All Group')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'GroupDesc',
          this.getSelectedItemText(fValue.Group, this.inputHelpData.GroupList)
        )
      );
    }
    //start
    if (this.chbIsAllCollectorStatus) {
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorDesc', 'All Collector')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue(
          'CollectorDesc',
          this.getSelectedItemText(
            fValue.Collector,
            this.inputHelpData.CollectorList
          )
        )
      );
    }
    //end
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  public getReportToken = (type:any) => {
      this.setParameter();
      this.spinner.show();
      this.displayIFrame = true;
      console.log(this.reportModel);
      this.aService
        .getReportToken(this.reportModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (x) => {
            if (type === 'CRV') {
              this.setIframeCRV(x);
            } else {
              this.setIframe(x);
            }
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    
  };

  private setIframe = (x: any) => {

    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath,"_blank");
  };

  private setIframeCRV = (x: any) => {
    var iFramePath =
      environment.reportUrl +
      'id=' +
      x.id +
      '&token=' +
      x.token +
      '&type=crViewer';

    window.open(iFramePath, '_blank');
  };

  applicationDateChange() {
    var fv = this.MemberRegisterReportForm.value;
    var value = this.datepipe.transform(fv.FormOpenDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.MemberRegisterReportForm.value.FormOpenDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.MemberRegisterReportForm.value);
    console.log(this.storefDate);
  }
}
