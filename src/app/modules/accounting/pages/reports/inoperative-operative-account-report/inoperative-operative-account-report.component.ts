import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { FormGroup, FormControl } from '@angular/forms';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import { Router } from '@angular/router';
import { DepositDefaulterReportService } from 'src/app/services/deposit-defaulter-report.service';
import { DepositDefaulterReportPageLoadModel } from '../../../models/deposit-defaulter-report.model';
import { InoperativeOperativeReportService } from 'src/app/services/inoperative-operative-report.service';
import { InoperativeOperativeReportPageLoadModel } from '../../../models/inoperative-operative-report.model';

@Component({
  selector: 'app-inoperative-operative-account-report',
  templateUrl: './inoperative-operative-account-report.component.html',
  styleUrls: ['./inoperative-operative-account-report.component.css'],
})
export class InoperativeOperativeAccountReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp =
    new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: InoperativeOperativeReportPageLoadModel =
    new InoperativeOperativeReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  isCollectorDisable: boolean = true;
  isGroupDisable: boolean = true;
  chbForGenderDisable: boolean = true;
  CollectorDDlName: any;
  AccDDlName: any;
  GroupDDlName: any;
  storefDate: any;
  storetDate: any;
  InoperativeOperativeForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private inoperativeOperativeReportService: InoperativeOperativeReportService
  ) {
    this.reportModel.ReportName = 'rptCSInoperativeAndOperativeReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.InoperativeOperativeForm = new FormGroup({
      InoperativeRb: new FormControl('1'),
      AccNameInput: new FormControl(''),
      AccountDdl: new FormControl('0'),
      CollectorChb: new FormControl('0'),
      CollectorCodeInput: new FormControl(''),
      CollectorCodeDdl: new FormControl('0'),
      GroupChb: new FormControl('0'),

      GroupNameInput: new FormControl(''),
      AllGroupDdl: new FormControl('0'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      OldAcWiseChb: new FormControl(''),
    });

    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.inoperativeOperativeReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
        this.InoperativeOperativeForm.controls['IssueFromDate'].setValue(
          this.pageLoadModel.FDateMemStatReport
        );
        this.InoperativeOperativeForm.controls['IssueToDate'].setValue(
          this.pageLoadModel.ToDate
        );
        this.storefDate = this.pageLoadModel.FDateMemStatReport;
        this.storetDate = this.pageLoadModel.ToDate; 
      });


    this.InoperativeOperativeForm.get('CollectorCodeDdl').disable();
    this.InoperativeOperativeForm.get('AllGroupDdl').disable();
  }

  public CollectorChbChange() {
    if (this.isCollectorDisable == true) {
      this.isCollectorDisable = false;
      this.InoperativeOperativeForm.get('CollectorCodeDdl').enable();
    } else {
      this.isCollectorDisable = true;
      this.InoperativeOperativeForm.get('CollectorCodeDdl').disable();
      this.InoperativeOperativeForm.controls['CollectorCodeInput'].setValue('');
      this.InoperativeOperativeForm.controls['CollectorCodeDdl'].setValue('0');
    }
  }
  public GroupDDlChb() {
    if (this.isGroupDisable == true) {
      this.isGroupDisable = false;
      this.InoperativeOperativeForm.get('AllGroupDdl').enable();
    } else {
      this.isGroupDisable = true;
      this.InoperativeOperativeForm.get('AllGroupDdl').disable();
      this.InoperativeOperativeForm.controls['GroupNameInput'].setValue('');
      this.InoperativeOperativeForm.controls['AllGroupDdl'].setValue('0');
    }
  }
  public AccInput() {
    this.InoperativeOperativeForm.controls['AccountDdl'].setValue(
      this.InoperativeOperativeForm.value.AccNameInput
    );
    let selectedCode = this.pageLoadModel.AllAccountDropdown.find(
      (x) => x.Id == this.InoperativeOperativeForm.value.AccNameInput
    );
    this.AccDDlName = selectedCode.Description;
  }

  public AccDDLChange() {
    this.InoperativeOperativeForm.controls['AccNameInput'].setValue(
      this.InoperativeOperativeForm.value.AccountDdl
    );
    let selectedCode = this.pageLoadModel.AllAccountDropdown.find(
      (x) => x.Id == this.InoperativeOperativeForm.value.AccNameInput
    );
    this.AccDDlName = selectedCode.Description;
    console.log('AccName:', this.AccDDlName);
  }

  public GroupInputChange() {
    this.InoperativeOperativeForm.controls['AllGroupDdl'].setValue(
      this.InoperativeOperativeForm.value.GroupNameInput
    );
  }
  public GroupDDLOptChange() {
    this.InoperativeOperativeForm.controls['GroupNameInput'].setValue(
      this.InoperativeOperativeForm.value.AllGroupDdl
    );
    let selectedCode = this.pageLoadModel.AllGroupDropdown.find(
      (x) => x.Id == this.InoperativeOperativeForm.value.GroupNameInput
    );
    this.GroupDDlName = selectedCode.Description;
  }
  public CollectorCodeChange() {
    this.InoperativeOperativeForm.controls['CollectorCodeDdl'].setValue(
      this.InoperativeOperativeForm.value.CollectorCodeInput
    );
    let selectedCode = this.pageLoadModel.AllCollectorDropdown.find(
      (x) => x.Id == this.InoperativeOperativeForm.value.CollectorCodeInput
    );
    this.CollectorDDlName = selectedCode.Description;
  }
  public CollectorCodeDDLChange() {
    this.InoperativeOperativeForm.controls['CollectorCodeInput'].setValue(
      this.InoperativeOperativeForm.value.CollectorCodeDdl
    );
    let selectedCode = this.pageLoadModel.AllCollectorDropdown.find(
      (x) => x.Id == this.InoperativeOperativeForm.value.CollectorCodeInput
    );
    this.CollectorDDlName = selectedCode.Description;
  }

  public getReportToken = (type:any) => {
    if (this.InoperativeOperativeForm.value.AccNameInput == '') {
      alert('Please Select Account Type!');
      return;
    }
    this.spinner.show();
    this.setParameter();
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
  private setParameter(): void {
    var fValue = this.InoperativeOperativeForm.value;
    this.reportModel.Values = [];

    // this.reportModel.Values.push(
    //   new ReportKeyValue('fDate1', this.fromDate1)
    // );
    if (fValue.OldAcWiseChb == false) {
      this.reportModel.Values.push(new ReportKeyValue('oldAccWise', '0'));
    } else {
      this.reportModel.Values.push(new ReportKeyValue('oldAccWise', '1'));
    }

    if (fValue.CollectorCodeInput == '') {
      this.reportModel.Values.push(new ReportKeyValue('CollectorCode', '0'));

      this.reportModel.Values.push(new ReportKeyValue('CollectorName', 'All'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorCode', fValue.CollectorCodeInput)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('CollectorName', this.CollectorDDlName)
      );
    }

    if (fValue.GroupNameInput == '') {
      this.reportModel.Values.push(new ReportKeyValue('GroupCode', '0'));
      this.reportModel.Values.push(new ReportKeyValue('GroupName', 'All'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('GroupCode', fValue.GroupNameInput)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('GroupName', this.GroupDDlName)
      );
    }

    this.reportModel.Values.push(
      new ReportKeyValue('AccCode', fValue.AccNameInput)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('AccName', this.AccDDlName)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('InOperativeBtn', fValue.InoperativeRb)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('FromDate', this.storefDate)
    );
    this.reportModel.Values.push(new ReportKeyValue('ToDate', this.storetDate));

    console.log(this.reportModel.Values);
  }

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

  exitPage() {
    this.router.navigate(['accounting/']);
  }

  // Date change event
  applicationDateChange() {
    var fv = this.InoperativeOperativeForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.InoperativeOperativeForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.InoperativeOperativeForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.InoperativeOperativeForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.InoperativeOperativeForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.InoperativeOperativeForm.value);
    console.log(this.storetDate);
  }
}
