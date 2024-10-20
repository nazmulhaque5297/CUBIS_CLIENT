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
import { MemRegRptByAccService } from 'src/app/services/memRegRptByAcc-report.service';
import {
  MemRegRptByAccReportInputHelp,
  MemRegRptByAccReportAccTypeDetails,
} from 'src/app/Models/memregrptbyacc-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';

@Component({
  selector: 'app-member-register-report-by-account',
  templateUrl: './member-register-report-by-account.component.html',
  styleUrls: ['./member-register-report-by-account.component.css'],
})
export class MemberRegisterReportByAccountComponent
  implements OnInit, OnDestroy {
  module: string = '1';
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  chbIsAllCollectorStatus: any;
  chbIsAllGroupStatus: any;
  chbIsAllGenderStatus: any;
  chbIsAllReligionStatus: any;
  chbIsAllBloodGroupStatus: any;
  chbIsAllStatusStatus: any;
  chbIsAllDateStatus: any;
  chbIsAllAgeStatus: any;
  IsCollectorDisabled: any;
  IsGroupDisabled: any;
  IsGenderDisabled: any;
  IsReligionDisabled: any;
  IsBloodGroupDisabled: any;
  IsStatusDisabled: any;
  storefDate: any;
  MemberRegisterReportByAccountForm: FormGroup;
  public inputHelpData: MemRegRptByAccReportInputHelp = new MemRegRptByAccReportInputHelp();
  public inputHelpDetails: MemRegRptByAccReportAccTypeDetails = new MemRegRptByAccReportAccTypeDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private memRegRptByAccService: MemRegRptByAccService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe
  ) {
    //this.reportModel.ReportName = 'CSGenerateMemberInformationByAccount';
    this.reportModel.ReportName = 'rptMCsGenerateMemberByAccount';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private initializeForm() {
    this.chbIsAllCollectorStatus = true;
    this.chbIsAllGroupStatus = true;
    this.chbIsAllGenderStatus = true;
    this.chbIsAllReligionStatus = true;
    this.chbIsAllBloodGroupStatus = true;
    this.chbIsAllStatusStatus = true;
    this.chbIsAllDateStatus = true;
    this.chbIsAllAgeStatus = true;
    this.IsCollectorDisabled = true;
    this.IsGroupDisabled = true;
    this.IsGenderDisabled = true;
    this.IsReligionDisabled = true;
    this.IsBloodGroupDisabled = true;
    this.IsStatusDisabled = true;
    this.MemberRegisterReportByAccountForm = new FormGroup({
      AccType: new FormControl('0'),
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
    this.memRegRptByAccService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        // this.MemberRegisterReportByAccountForm.controls[
        //   'FormOpenDate'
        // ].setValue(data.ApplicationDate);
        this.spinner.hide();
      });
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      // this.MemberRegisterReportByAccountForm.get('Collector').disable();
      this.IsCollectorDisabled = true;
      this.MemberRegisterReportByAccountForm.controls['Collector'].setValue(
        '0'
      );
    } else {
      this.chbIsAllCollectorStatus = false;
      this.MemberRegisterReportByAccountForm.get('Collector').enable();
    }
  }
  checkIsAllGroupValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGroupStatus = true;
      // this.MemberRegisterReportByAccountForm.get('Group').disable();
      this.IsGroupDisabled = true;
      this.MemberRegisterReportByAccountForm.controls['Group'].setValue('0');
    } else {
      this.chbIsAllGroupStatus = false;
      this.MemberRegisterReportByAccountForm.get('Group').enable();
    }
  }
  checkIsAllGenderValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGenderStatus = true;
      // this.MemberRegisterReportByAccountForm.get('Gender').disable();
      this.IsGenderDisabled = true;
      this.MemberRegisterReportByAccountForm.controls['Gender'].setValue('0');
    } else {
      this.chbIsAllGenderStatus = false;
      this.MemberRegisterReportByAccountForm.get('Gender').enable();
    }
  }
  checkIsAllReligionValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllReligionStatus = true;
      //this.MemberRegisterReportByAccountForm.get('Religion').disable();
      this.IsReligionDisabled = true;
      this.MemberRegisterReportByAccountForm.controls['Religion'].setValue('0');
    } else {
      this.chbIsAllReligionStatus = false;
      this.MemberRegisterReportByAccountForm.get('Religion').enable();
    }
  }
  checkIsAllBloodGroupValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllBloodGroupStatus = true;
      // this.MemberRegisterReportByAccountForm.get('BloodGroup').disable();
      this.IsBloodGroupDisabled = true;
      this.MemberRegisterReportByAccountForm.controls['BloodGroup'].setValue(
        '0'
      );
    } else {
      this.chbIsAllBloodGroupStatus = false;
      this.MemberRegisterReportByAccountForm.get('BloodGroup').enable();
    }
  }
  checkIsAllStatusValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllStatusStatus = true;
      // this.MemberRegisterReportByAccountForm.get('Status').disable();
      this.IsStatusDisabled = true;
      this.MemberRegisterReportByAccountForm.controls['Status'].setValue('0');
    } else {
      this.chbIsAllStatusStatus = false;
      this.MemberRegisterReportByAccountForm.get('Status').enable();
    }
  }
  checkIsAllDateValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllDateStatus = true;
      this.MemberRegisterReportByAccountForm.get('FormOpenDate').disable();
      this.MemberRegisterReportByAccountForm.controls['FormOpenDate'].setValue(
        ''
      );
    } else {
      this.chbIsAllDateStatus = false;
      this.MemberRegisterReportByAccountForm.get('FormOpenDate').enable();
      this.MemberRegisterReportByAccountForm.controls['FormOpenDate'].setValue(
        this.inputHelpData.ApplicationDate
      );
      this.storefDate = this.inputHelpData.ApplicationDate;
    }
  }
  checkIsAllAgeValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllAgeStatus = true;
      this.MemberRegisterReportByAccountForm.get('Age').disable();
      this.MemberRegisterReportByAccountForm.get('AgeEqual').disable();
      this.MemberRegisterReportByAccountForm.controls['Age'].setValue('');
      this.MemberRegisterReportByAccountForm.controls['AgeEqual'].setValue('0');
    } else {
      this.chbIsAllAgeStatus = false;
      this.MemberRegisterReportByAccountForm.get('Age').enable();
      this.MemberRegisterReportByAccountForm.get('AgeEqual').enable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.MemberRegisterReportByAccountForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));
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
    this.reportModel.Values.push(new ReportKeyValue('Status', fValue.Status));
    this.reportModel.Values.push(
      new ReportKeyValue('FormOpenDate', this.storefDate)
    );

    this.reportModel.Values.push(new ReportKeyValue('Age', fValue.Age));
    this.reportModel.Values.push(
      new ReportKeyValue('AgeEqual', fValue.AgeEqual)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IsAllDate', fValue.IsAllDate ? '1' : '0')
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IsAllAge', fValue.IsAllAge ? '1' : '0')
    );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccTypeDesc',
        this.getSelectedItemText(
          fValue.AccType,
          this.inputHelpData.AccountTypeList
        )
      )
    );
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

  public getReportToken = (type: any) => {
    let AccType = this.MemberRegisterReportByAccountForm.controls['AccType']
      .value;
    console.log(AccType);
    if (AccType == 0) {
      alert('Please Select Account Type!');
    } else {
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
    }
  };

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
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
    var fv = this.MemberRegisterReportByAccountForm.value;
    var value = this.datepipe.transform(fv.FormOpenDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.MemberRegisterReportByAccountForm.value.FormOpenDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.MemberRegisterReportByAccountForm.value);
    console.log(this.storefDate);
  }
}
