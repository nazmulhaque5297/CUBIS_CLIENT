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
import { LoanDefaulterReportService } from 'src/app/services/loan-defaulter-report.service';
import {
  AccDescModel,
  LoanDefaulterReportPageLoadModel,
  MemNameModel,
} from '../../../models/loan-defaulter-report.model';

@Component({
  selector: 'app-loan-defaulter-report',
  templateUrl: './loan-defaulter-report.component.html',
  styleUrls: ['./loan-defaulter-report.component.css'],
})
export class LoanDefaulterReportComponent implements OnInit {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: LoanDefaulterReportPageLoadModel = new LoanDefaulterReportPageLoadModel();
  public AccDsc: AccDescModel = new AccDescModel();
  public MemName: MemNameModel = new MemNameModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  isCollectorDisable: boolean = true;
  isGroupDisable: boolean = true;
  chbForGenderDisable: boolean = true;
  AccountDesc: any;
  selectedMonth: any;
  selectedYear: any;
  processDate: any;
  monthDdl: any;
  yearDdl: any;
  fromFieldHide: boolean = true;
  chbIsSurityMemberTypeStatus: boolean = false;
  chbIsCollectorTypeStatus: boolean = true;
  chbIsGroupTypeStatus: boolean = true;
  chbIsMemberTypeStatus: boolean = true;
  AccValue: any;
  CheckSurity: any;
  MemNo: any;
  DueFrom: any;
  DueTo: any;
  CheckMember: any;
  colValue: any;
  ViewDataList: any[] = [];
  checked: boolean = false;
  groupValue: any;

  LoanDefaultForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private loanDefaulterReportService: LoanDefaulterReportService
  ) {
    this.reportModel.ReportName = 'CCULB_rptCSLoanDefaulterReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    this.LoanDefaultForm = new FormGroup({
      AccNameInput: new FormControl(''),
      AccountDdl: new FormControl('0'),
      CollectorChb: new FormControl('0'),
      CollectorCodeInput: new FormControl(''),
      CollectorCodeDdl: new FormControl('0'),
      GroupChb: new FormControl('0'),
      MemberNoInput: new FormControl(''),
      AllMemberNoChb: new FormControl('0'),
      SurityMemberChb: new FormControl(''),
      GroupNameInput: new FormControl(''),
      AllGroupDdl: new FormControl('0'),
      LoanInfoRb: new FormControl('0'),
      DefaulterInputFrom: new FormControl(''),
      DefaulterInputTo: new FormControl(''),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      AccountTypeInput: new FormControl(''),
      AllMonthDdl: new FormControl('0'),
      AllYearDdl: new FormControl('0'),
      detailsBtn: new FormControl(''),
    });

    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.loanDefaulterReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
        console.log('All Data:', this.pageLoadModel);
        this.selectedMonth = data.AllMonthDropdown;
        this.selectedYear = data.AllYearDropdown;

        this.processDate = this.pageLoadModel.ProcessDate;
        let month = this.processDate[3] + '' + this.processDate[4];
        let year =
          this.processDate[6] +
          '' +
          this.processDate[7] +
          '' +
          this.processDate[8] +
          '' +
          this.processDate[9];
        console.log('Month', month);

        this.monthDdl = this.selectedMonth.find((x) => x.Id == month);
        this.yearDdl = this.selectedYear.find((x) => x.Id == year);

        console.log('SelectedMonth:', this.monthDdl.Description);
        this.LoanDefaultForm.controls['AllMonthDdl'].setValue(this.monthDdl.Id);
        this.LoanDefaultForm.controls['AllYearDdl'].setValue(this.yearDdl.Id);
      });

    this.LoanDefaultForm.get('CollectorCodeDdl').disable();
    this.LoanDefaultForm.get('AllGroupDdl').disable();
    this.fromFieldHide = true;
  }

  public MemNumberInput() {
    this.MemNo = this.LoanDefaultForm.value.MemberNoInput;
    console.log('MemberNumber:', this.MemNo);
    this.loanDefaulterReportService
      .GetMemberName(this.MemNo)
      .pipe(first())
      .subscribe((data: any) => {
        this.MemName = data;
      });
  }

  public CollectorChbChange() {
    if (this.isCollectorDisable == true) {
      this.isCollectorDisable = false;
      this.LoanDefaultForm.get('CollectorCodeDdl').enable();
    } else {
      this.isCollectorDisable = true;
      this.LoanDefaultForm.get('CollectorCodeDdl').disable();
      this.LoanDefaultForm.controls['CollectorCodeInput'].setValue('');
      this.LoanDefaultForm.controls['CollectorCodeDdl'].setValue('0');
    }
  }
  public GroupDDlChb() {
    if (this.isGroupDisable == true) {
      this.isGroupDisable = false;
      this.LoanDefaultForm.get('AllGroupDdl').enable();
    } else {
      this.isGroupDisable = true;
      this.LoanDefaultForm.get('AllGroupDdl').disable();
      this.LoanDefaultForm.controls['GroupNameInput'].setValue('');
      this.LoanDefaultForm.controls['AllGroupDdl'].setValue('0');
    }
  }
  public AccInput() {
    this.LoanDefaultForm.controls['AccountDdl'].setValue(
      this.LoanDefaultForm.value.AccNameInput
    );
  }

  public AccDDLChange() {
    this.LoanDefaultForm.controls['AccNameInput'].setValue(
      this.LoanDefaultForm.value.AccountDdl
    );
    this.AccValue = this.LoanDefaultForm.controls['AccNameInput'].value;
    console.log('AccValue:', this.AccValue);
    this.loanDefaulterReportService
      .GetAccDesc(this.AccValue)
      .pipe(first())
      .subscribe((data: any) => {
        console.log('desc', data);
        this.AccDsc = data;
      });
  }

  public GroupInputChange() {
    this.LoanDefaultForm.controls['AllGroupDdl'].setValue(
      this.LoanDefaultForm.value.GroupNameInput
    );
  }
  public GroupDDLOptChange() {
    this.LoanDefaultForm.controls['GroupNameInput'].setValue(
      this.LoanDefaultForm.value.AllGroupDdl
    );
  }
  public CollectorCodeChange() {
    this.LoanDefaultForm.controls['CollectorCodeDdl'].setValue(
      this.LoanDefaultForm.value.CollectorCodeInput
    );
  }
  public CollectorCodeDDLChange() {
    this.LoanDefaultForm.controls['CollectorCodeInput'].setValue(
      this.LoanDefaultForm.value.CollectorCodeDdl
    );
  }

  public RadioButtonChange(e) {
    if (this.LoanDefaultForm.value.LoanInfoRb == 1) {
      this.fromFieldHide = false;
    } else {
      this.fromFieldHide = true;
    }
  }

  public GenerateReport() {
    this.spinner.show();
    var fValue = this.LoanDefaultForm.value;
    if (fValue.AccNameInput == '') {
      alert('Please Select Account Type');
      this.spinner.hide();
      return;
    }

    if (
      fValue.LoanInfoRb == 0 &&
      fValue.DefaulterInputFrom == '' &&
      fValue.DefaulterInputTo == ''
    ) {
      alert('Please Fill up the Defaulter Input Field!');
      this.spinner.hide();
      document.getElementById(`DefaulterInputFrom`).focus();
      return;
    }
    console.log('Hello I am from GenerateReport ');
    if (this.chbIsSurityMemberTypeStatus == true) {
      this.CheckSurity = 1;
    } else {
      this.CheckSurity = 0;
    }

    if (this.chbIsMemberTypeStatus == true) {
      this.CheckMember = 1;
    } else {
      this.CheckMember = 0;
    }

    if (this.chbIsCollectorTypeStatus == true) {
      this.colValue = 0;
    } else {
      this.colValue = this.LoanDefaultForm.value.CollectorCodeInput;
    }

    if (this.chbIsMemberTypeStatus == true) {
      this.MemNo = 0;
    } else {
      this.colValue = this.LoanDefaultForm.value.MemberNoInput;
    }

    if (this.chbIsGroupTypeStatus == true) {
      this.groupValue = 0;
    } else {
      this.groupValue = this.LoanDefaultForm.value.GroupNameInput;
    }

    if (this.LoanDefaultForm.value.LoanInfoRb == 0) {
      this.DueFrom = this.LoanDefaultForm.value.DefaulterInputFrom;
      this.DueTo = this.LoanDefaultForm.value.DefaulterInputTo;
    }

    this.selectedMonth = fValue.AllMonthDdl;
    this.selectedYear = fValue.AllYearDdl;

    console.log('from GenerateReport selected Month ', this.selectedMonth);
    console.log('from GenerateReport selected Year ', this.selectedYear);

    this.monthDdl = this.pageLoadModel.AllMonthDropdown.find(
      (x) => x.Id == this.selectedMonth
    );
    this.yearDdl = this.pageLoadModel.AllYearDropdown.find(
      (x) => x.Id == this.selectedYear
    );

    //this.AccValue
    let data = {
      AccNo: this.AccValue,
      Month: this.monthDdl.Id,
      Year: this.yearDdl.Description,
      ColCode: this.colValue,
      GroupCode: this.groupValue,
      DueFrom: this.DueFrom,
      DueTo: this.DueTo,
      CheckSurityChb: this.CheckSurity,
      MemberNo: this.MemNo,
      CheckMember: this.CheckMember,
    };

    console.log('GenerateReport data going to API >> ', data);
    this.loanDefaulterReportService
      .GenerateInfo(data)
      .pipe(first())
      .subscribe((x: any) => {
        this.spinner.hide();
        console.log('Message:', x);
        alert('Generate SuccessFully!!');
      });
  }

  public ViewTableData() {
    this.checked = true;
    console.log('Click');
    this.loanDefaulterReportService
      .ViewTableInfo()
      .pipe(first())
      .subscribe((x: any) => {
        console.log('View:', x);
        this.ViewDataList = x;
      });
  }

  public getReportToken = (type:any) => {
    var fValue = this.LoanDefaultForm.value;
    if (
      fValue.LoanInfoRb == 0 &&
      fValue.DefaulterInputFrom == '' &&
      fValue.DefaulterInputTo == ''
    ) {
      alert('Please Fill up the Defaulter Input Field!');
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
    var fValue = this.LoanDefaultForm.value;
    this.reportModel.Values = [];
    if (this.chbIsCollectorTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('collectorNo', '0'));

      this.reportModel.Values.push(new ReportKeyValue('collectorName', 'All'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('collectorNo', fValue.CollectorCodeInput)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('collectorName', fValue.CollectorCodeDdl)
      );
    }

    if (this.chbIsGroupTypeStatus == true) {
      this.reportModel.Values.push(new ReportKeyValue('groupNo', '0'));

      this.reportModel.Values.push(new ReportKeyValue('groupName', 'All'));
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('groupNo', fValue.GroupNameInput)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('groupName', fValue.AllGroupDdl)
      );
    }

    this.DueFrom = fValue.DefaulterInputFrom;

    if (fValue.LoanInfoRb == 0) {
      var name =
        'Period : From : ' +
        fValue.DefaulterInputFrom +
        ' To : ' +
        fValue.DefaulterInputTo;
      console.log('Name4:', name);
      this.DueFrom = fValue.DefaulterInputFrom;
      this.DueTo = fValue.DefaulterInputTo;
      this.reportModel.Values.push(new ReportKeyValue('Name4', name));

      this.reportModel.Values.push(new ReportKeyValue('FromNo', this.DueFrom));

      this.reportModel.Values.push(new ReportKeyValue('ToNo', this.DueTo));
    } else {
      this.DueFrom = '0';
      this.DueTo = '0';
      this.reportModel.Values.push(new ReportKeyValue('Name4', 'Period : All'));

      this.reportModel.Values.push(new ReportKeyValue('FromNo', this.DueFrom));

      this.reportModel.Values.push(new ReportKeyValue('ToNo', this.DueTo));
    }

    var selectedDate =
      this.monthDdl.Description + ',' + this.yearDdl.Description;
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName', selectedDate)
    );

    // var selectedDate = fValue.AllMonthDdl.Id + ',' + fValue.AllYearDdl;
    // this.reportModel.Values.push(
    //   new ReportKeyValue('CommonName', selectedDate)
    // );

    this.reportModel.Values.push(
      new ReportKeyValue('CommonName1', fValue.AccountDdl)
    );

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
}
