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
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import {
  LoanReceivedReportInputHelp,
  EstIntDetailsReportAccNoDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ChequeBookReportService } from 'src/app/services/chequebook-report.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';

@Component({
  selector: 'app-estimated-maturity-int-report',
  templateUrl: './estimated-maturity-int-report.component.html',
  styleUrls: ['./estimated-maturity-int-report.component.css'],
})
export class EstimatedMaturityIntReportComponent implements OnInit, OnDestroy {
  module: string = '1';
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  chbIsAllCollectorStatus: any;
  chbIsAllGroupStatus: any;

  IsCollectorDisabled: any;
  IsGroupDisabled: any;
  GroupShowHide:boolean=true;
  CollectorShowHide:boolean=true;
  AccNoShowHide:boolean=false;
  MemberNoShowHide:boolean=false;

  EstimatedInterestForm: FormGroup;

  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  public inputHelpAccNoDetails: EstIntDetailsReportAccNoDetails = new EstIntDetailsReportAccNoDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private chequeBookReportService: ChequeBookReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe
  ) {
    this.reportModel.ReportName = 'rptCSEstimatedInterestList';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }
  private initializeForm() {
    this.chbIsAllCollectorStatus = true;
    this.chbIsAllGroupStatus = true;

    this.IsCollectorDisabled = true;
    this.IsGroupDisabled = true;

    this.EstimatedInterestForm = new FormGroup({
      AccTypeCode: new FormControl(''),
      AccType: new FormControl('0'),
      IsAllCollector: new FormControl('true'),
      CollectorCode: new FormControl(''),
      Collector: new FormControl('0'),
      IsAllGroup: new FormControl('true'),
      GroupCode: new FormControl(''),
      Group: new FormControl('0'),
      rbDue: new FormControl('0'),
      MemNo: new FormControl(''),
      AccNo: new FormControl('0'),
    });
    this.CollectorShowHide=true;
    this.GroupShowHide=true;
    this.AccNoShowHide=false;
    this.MemberNoShowHide=false;
  }
  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.spinner.hide();
      });
  }
  checkIsAllCollectorValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllCollectorStatus = true;
      this.IsCollectorDisabled = true;
      this.EstimatedInterestForm.controls['Collector'].setValue('0');
      this.EstimatedInterestForm.controls['CollectorCode'].setValue('');
    } else {
      this.chbIsAllCollectorStatus = false;
      this.EstimatedInterestForm.get('Collector').enable();
    }
  }
  checkIsAllGroupValue(e) {
    console.log(e);
    if (e) {
      this.chbIsAllGroupStatus = true;
      this.IsGroupDisabled = true;
      this.EstimatedInterestForm.controls['Group'].setValue('0');
      this.EstimatedInterestForm.controls['GroupCode'].setValue('');
    } else {
      this.chbIsAllGroupStatus = false;
      this.EstimatedInterestForm.get('Group').enable();
    }
  }
  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }
  public getSelectedItemIDAccType(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Account Type!');
      this.EstimatedInterestForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
  }
  public getSelectedItemIDCollector(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Collector !');
      this.EstimatedInterestForm.patchValue({
        Collector: 0,
        CollectorCode: '',
      });
    }
    return selected.Id;
  }
  public getSelectedItemIDGroup(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      alert('Invalid Group !');
      this.EstimatedInterestForm.patchValue({
        Group: 0,
        GroupCode: '',
      });
    }
    return selected.Id;
  }
  onChangeGroupCode(event: any) {
    let GroupCodeId = this.EstimatedInterestForm.controls['GroupCode'].value;
    console.log(GroupCodeId);
    if (GroupCodeId) {
      this.EstimatedInterestForm.patchValue({
        Group: this.getSelectedItemIDGroup(
          GroupCodeId,
          this.inputHelpData.GroupList
        ),
      });
    }
  }
  onChangeCollectorCode(event: any) {
    let CollectorCodeId = this.EstimatedInterestForm.controls['CollectorCode']
      .value;
    console.log(CollectorCodeId);
    if (CollectorCodeId) {
      this.EstimatedInterestForm.patchValue({
        Collector: this.getSelectedItemIDCollector(
          CollectorCodeId,
          this.inputHelpData.CollectorList
        ),
      });
    }
  }
  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.EstimatedInterestForm.controls['AccTypeCode']
      .value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.EstimatedInterestForm.patchValue({
        AccType: this.getSelectedItemIDAccType(
          AccTypeCodeId,
          this.inputHelpData.emIntAccountTypeList
        ),
      });
    }
  }
  onChangeAccType(event: any) {
    let AccTypeId = this.EstimatedInterestForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.EstimatedInterestForm.patchValue({
        AccTypeCode: AccTypeId,
      });
    }
  }
  onChangeCollector(event: any) {
    let CollectorId = this.EstimatedInterestForm.controls['Collector'].value;
    console.log(CollectorId);
    if (CollectorId) {
      this.EstimatedInterestForm.patchValue({
        CollectorCode: CollectorId,
      });
    }
  }
  onChangeGroup(event: any) {
    let GroupId = this.EstimatedInterestForm.controls['Group'].value;
    console.log(GroupId);
    if (GroupId) {
      this.EstimatedInterestForm.patchValue({
        GroupCode: GroupId,
      });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.EstimatedInterestForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));

    this.reportModel.Values.push(
      new ReportKeyValue('Collector', fValue.Collector)
    );

    this.reportModel.Values.push(new ReportKeyValue('Group', fValue.Group));

    this.reportModel.Values.push(new ReportKeyValue('rbDue', fValue.rbDue));

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
    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccTypeDesc',
        this.getSelectedItemText(
          fValue.AccType,
          this.inputHelpData.emIntAccountTypeList
        )
      )
    );
    console.log(fValue.rbDue);
    if (fValue.rbDue == '0') {
      this.reportModel.ReportName = 'rptCSEstimatedInterestList';
    } else {
      this.reportModel.ReportName = 'rptCSEstimatedInterestListDtl';
      this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));
      this.reportModel.Values.push(new ReportKeyValue('AccNo', fValue.AccNo));
    }
  }

GroupColHide()
{
  this.CollectorShowHide=false;
  this.GroupShowHide=false;
  this.AccNoShowHide=true;
  this.MemberNoShowHide=true;
}
GroupColShow()
{
  this.CollectorShowHide=true;
  this.GroupShowHide=true;
  this.AccNoShowHide=false;
  this.MemberNoShowHide=false;
}
  onChangeMemNo(event: any) {
    let memNumber = this.EstimatedInterestForm.controls['MemNo'].value;
    let AccTypeCodeId = this.EstimatedInterestForm.controls['AccTypeCode']
      .value;
    console.log(memNumber);
    console.log(AccTypeCodeId);
    if (memNumber && AccTypeCodeId) {
      this.spinner.show();
      this.chequeBookReportService
        .getAccountNo(memNumber, AccTypeCodeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          if (data.AccountNoList.length == 0) {
            this.spinner.hide();
            alert('Invalid Account Type or Member No!');
            this.EstimatedInterestForm.patchValue({
              AccType: 0,
              AccTypeCode: '',
              MemNo: '',
            });
          } else {
            this.inputHelpAccNoDetails = data;
            console.log(this.inputHelpAccNoDetails);
            this.EstimatedInterestForm.patchValue({
              AccNo: this.inputHelpAccNoDetails.AccountNoList[0].Description,
            });

            this.spinner.hide();
          }

          (err) => {
            this.spinner.hide();
          };
        });
    } else {
      alert('Invalid Account Type or Member No!');
    }
  }

  public getReportToken = (type:any) => {
    let AccType = this.EstimatedInterestForm.controls['AccType'].value;
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

    window.open(iFramePath,"_blank");
  }
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
}
