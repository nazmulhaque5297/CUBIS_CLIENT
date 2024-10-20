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
import {
  CashCollectionAccPageLoadModel,
  CashCollectionMemberNoChngModel,
} from '../../../models/cash-collection-report-by-acc.model';
import { Router } from '@angular/router';
import { AccountOpenCloseReportService } from 'src/app/services/account-open-close-report.service';
import { AccountOpenCloseReportPageLoadModel } from '../../../models/account-open-close-report.model';

@Component({
  selector: 'app-account-open-and-close-register',
  templateUrl: './account-open-and-close-register.component.html',
  styleUrls: ['./account-open-and-close-register.component.css'],
})
export class AccountOpenAndCloseRegisterComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: AccountOpenCloseReportPageLoadModel = new AccountOpenCloseReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  chbForCollectorDisable: boolean = true;
  chbForGroupDisable: boolean = true;
  chbForGenderDisable: boolean = true;
  AccDDLName: any;
  CollectorDDLName: any;
  GroupDDLName: any;
  GenderName: any;
  GenderValue: any;
  AccountOpenCloseForm: FormGroup;
  storefDate: any;
  storetDate: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    // private loanInfoReportService: LoanInfoReportService,
    private accountOpenCloseReportService: AccountOpenCloseReportService
  ) {
    this.reportModel.ReportName = 'rptCSAccountOpenRegisterByDate';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.AccountOpenCloseForm = new FormGroup({
      CollectorChb: new FormControl('0'),
      GroupChb: new FormControl('0'),
      GenderChb: new FormControl('0'),
      AllAccDdl: new FormControl('0'),
      AllGenderDdl: new FormControl('0'),
      AllGroupDdl: new FormControl('0'),
      AllCollectorDdl: new FormControl('0'),
      AllCollectorCodeInput: new FormControl(''),
      AllGroupCodeInput: new FormControl(''),
      InfoModeRb: new FormControl('0'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      AccountTypeInput: new FormControl(''),
      ByDate: new FormControl(''),
    });

    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.accountOpenCloseReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
        this.AccountOpenCloseForm.controls['IssueFromDate'].setValue(
          this.pageLoadModel.FromDate
        );
        this.AccountOpenCloseForm.controls['IssueToDate'].setValue(
          this.pageLoadModel.ToDate
        );
        this.storefDate = this.pageLoadModel.FromDate;
        this.storetDate = this.pageLoadModel.ToDate;
      });

    this.AccountOpenCloseForm.get('AllCollectorDdl').disable();
    this.AccountOpenCloseForm.get('AllGroupDdl').disable();
    this.AccountOpenCloseForm.get('AllGenderDdl').disable();
  }

  public AccountChange() {
    console.log(this.AccountOpenCloseForm.value.AllAccDdl);
    this.AccountOpenCloseForm.controls['AccountTypeInput'].setValue(
      this.AccountOpenCloseForm.value.AllAccDdl
    );
    let selectedCode = this.pageLoadModel.AllAccountDropdown.find(
      (x) => x.Id == this.AccountOpenCloseForm.value.AllAccDdl
    );
    this.AccDDLName = selectedCode.Description;
  }
  public AccountCodeChange() {
    this.AccountOpenCloseForm.controls['AllAccDdl'].setValue(
      this.AccountOpenCloseForm.value.AccountTypeInput
    );
  }

  public CollectorDdlChange() {
    console.log(this.AccountOpenCloseForm.value.AllAccDdl);
    this.AccountOpenCloseForm.controls['AllCollectorCodeInput'].setValue(
      this.AccountOpenCloseForm.value.AllCollectorDdl
    );
    let selectedCode = this.pageLoadModel.AllCollectorCodeDropdown.find(
      (x) => x.Id == this.AccountOpenCloseForm.value.AllCollectorDdl
    );
    this.CollectorDDLName = selectedCode.Description;
  }
  public CollectorCodeChange() {
    this.AccountOpenCloseForm.controls['AllCollectorDdl'].setValue(
      this.AccountOpenCloseForm.value.AllCollectorCodeInput
    );
  }

  public GroupDdlChange() {
    console.log(this.AccountOpenCloseForm.value.AllAccDdl);
    this.AccountOpenCloseForm.controls['AllGroupCodeInput'].setValue(
      this.AccountOpenCloseForm.value.AllGroupDdl
    );
    let selectedCode = this.pageLoadModel.AllGroupCodeDropdown.find(
      (x) => x.Id == this.AccountOpenCloseForm.value.AllGroupDdl
    );
    this.GroupDDLName = selectedCode.Description;
  }
  public GroupCodeChange() {
    this.AccountOpenCloseForm.controls['AllGroupDdl'].setValue(
      this.AccountOpenCloseForm.value.AllGroupCodeInput
    );
  }

  public GenderDdlChange() {
    let selectedCode = this.pageLoadModel.AllGenderDropdown.find(
      (x) => x.Id == this.AccountOpenCloseForm.value.AllGenderDdl
    );
    this.GenderName = selectedCode.Description;
    this.GenderValue = selectedCode.Id;
    console.log('GenderValue:', this.GenderValue);
  }

  public ChbForCollector() {
    if (this.chbForCollectorDisable == true) {
      this.chbForCollectorDisable = false;
      this.AccountOpenCloseForm.get('AllCollectorDdl').enable();
    } else {
      this.chbForCollectorDisable = true;
      this.AccountOpenCloseForm.get('AllCollectorDdl').disable();
      this.AccountOpenCloseForm.controls['AllCollectorCodeInput'].setValue('');
      this.AccountOpenCloseForm.controls['AllCollectorDdl'].setValue('0');
    }
  }
  public ChbForGroupCode() {
    if (this.chbForGroupDisable == true) {
      this.chbForGroupDisable = false;
      this.AccountOpenCloseForm.get('AllGroupDdl').enable();
    } else {
      this.chbForGroupDisable = true;
      this.AccountOpenCloseForm.get('AllGroupDdl').disable();
      this.AccountOpenCloseForm.controls['AllGroupCodeInput'].setValue('');
      this.AccountOpenCloseForm.controls['AllGroupDdl'].setValue('0');
    }
  }

  public ChbForGender() {
    if (this.chbForGenderDisable == true) {
      this.chbForGenderDisable = false;
      this.AccountOpenCloseForm.get('AllGenderDdl').enable();
    } else {
      this.chbForGenderDisable = true;
      this.AccountOpenCloseForm.get('AllGenderDdl').disable();
      this.AccountOpenCloseForm.controls['AllGenderDdl'].setValue('0');
    }
  }

  public getReportToken = (type: any) => {
    if (this.AccountOpenCloseForm.controls['AccountTypeInput'].value == '') {
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
    var fValue = this.AccountOpenCloseForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(new ReportKeyValue('fDate', this.storefDate));
    this.reportModel.Values.push(new ReportKeyValue('tDate', this.storetDate));

    this.reportModel.Values.push(
      new ReportKeyValue('AccType', fValue.AccountTypeInput)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('CommonName1', this.AccDDLName)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('CommonNo1', fValue.AccountTypeInput)
    );

    if (fValue.AllCollectorCodeInput == '') {
      this.reportModel.Values.push(new ReportKeyValue('ColCode', '0'));

      this.reportModel.Values.push(new ReportKeyValue('CommonName2', 'All'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('ColCode', fValue.AllCollectorCodeInput)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('CommonName2', this.CollectorDDLName)
      );
    }

    if (fValue.AllGroupCodeInput == '') {
      this.reportModel.Values.push(new ReportKeyValue('RegNo', '0'));

      this.reportModel.Values.push(new ReportKeyValue('CommonName3', 'All'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('RegNo', fValue.AllGroupCodeInput)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('CommonName3', this.GroupDDLName)
      );
    }

    if (fValue.AllGenderDdl != 1 || fValue.AllGenderDdl != 2) {
      this.reportModel.Values.push(new ReportKeyValue('CommonNo2', '0'));

      this.reportModel.Values.push(new ReportKeyValue('CommonName4', 'All'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('CommonNo2', this.GenderValue)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('CommonName4', this.GenderName)
      );
    }

    console.log('CheckBox:', fValue.ByDate);

    if (fValue.InfoModeRb == '0') {
      if (fValue.ByDate == true) {
        this.reportModel.Values.push(new ReportKeyValue('nFlag', '0'));

        this.reportModel.ReportName = 'rptCSAccountOpenRegisterByDate';
      } else if (fValue.ByDate == false) {
        this.reportModel.Values.push(new ReportKeyValue('nFlag', '0'));

        this.reportModel.ReportName = 'rptCSAccountOpenRegister';
      }
    } else if (fValue.InfoModeRb == '1') {
      if (fValue.ByDate == true) {
        this.reportModel.Values.push(new ReportKeyValue('nFlag', '1'));

        this.reportModel.ReportName = 'rptCSAccountCloseRegisterByDate';
      } else if (fValue.ByDate == false) {
        this.reportModel.Values.push(new ReportKeyValue('nFlag', '1'));

        this.reportModel.ReportName = 'rptCSAccountCloseRegister';
      }
    }

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

  applicationDateChange() {
    var fv = this.AccountOpenCloseForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.AccountOpenCloseForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.AccountOpenCloseForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.AccountOpenCloseForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.AccountOpenCloseForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.AccountOpenCloseForm.value);
    console.log(this.storetDate);
  }
}
