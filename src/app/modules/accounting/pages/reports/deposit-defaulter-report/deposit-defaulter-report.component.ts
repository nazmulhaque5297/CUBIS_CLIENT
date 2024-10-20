import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
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

import { DepositDefaulterReportService } from 'src/app/services/deposit-defaulter-report.service';
import { DepositDefaulterReportPageLoadModel } from '../../../models/deposit-defaulter-report.model';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanRecoveryReportService } from 'src/app/services/loan-recovery-report.service';

@Component({
  selector: 'app-deposit-defaulter-report',
  templateUrl: './deposit-defaulter-report.component.html',
  styleUrls: ['./deposit-defaulter-report.component.css'],
})
export class DepositDefaulterReportComponent implements OnInit {
  module: string = '1';
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: DepositDefaulterReportPageLoadModel = new DepositDefaulterReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  isCollectorDisable: boolean = true;
  isGroupDisable: boolean = true;
  chbForGenderDisable: boolean = true;
  DepositDefaultForm: FormGroup;
  showGrid1: boolean = false;
  showGrid2: boolean = false;
  Grid1DataList = [];
  Grid2DataList = [];
  accountType: any;
  accountNo: any;
  memberNo: any;
  accountDesc: any;
  memberName: any;

  selectedMonth: any;
  selectedYear: any;
  processDate: any;
  monthDdl: any;
  yearDdl: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private depositDefaulterReportService: DepositDefaulterReportService,
    private loanRecoveryReportService: LoanRecoveryReportService
  ) {
    this.reportModel.ReportName = 'CCULB_rptCSPensionDefaulterReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
    this.initializeForm();
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    let url = route.pathFromRoot
      .map((v) => v.url.map((segment) => segment.toString()).join('/'))
      .join('/');
    const queryParam = route.queryParamMap;
    if (queryParam.keys.length > 0) {
      url +=
        '?' +
        queryParam.keys
          .map((key) =>
            queryParam
              .getAll(key)
              .map((value) => key + '=' + value)
              .join('&')
          )
          .join('&');
    }
    return this.getModuleName(url);
  }
  getModuleName(urlData: any) {
    console.log(urlData);
    var result = '';
    for (var i = 1; i < urlData.length; i++) {
      if (urlData[i] == '/') return result;
      result += urlData[i];
    }
  }

  private initializeForm() {
    this.DepositDefaultForm = new FormGroup({
      AccNameInput: new FormControl(''),
      AccountDdl: new FormControl('0'),
      CollectorChb: new FormControl('0'),
      CollectorCodeInput: new FormControl(''),
      CollectorCodeDdl: new FormControl('0'),
      GroupChb: new FormControl('0'),
      GroupNameInput: new FormControl(''),
      AllGroupDdl: new FormControl('0'),
      LoanInfoRb: new FormControl('0'),
      DefaulterInputFrom: new FormControl(''),
      DefaulterInputTo: new FormControl(''),
      MonthDdl: new FormControl('0'),
      YearDdl: new FormControl('0'),
    });

    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.depositDefaulterReportService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        this.pageLoadModel = data;
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
        this.DepositDefaultForm.controls['MonthDdl'].setValue(this.monthDdl.Id);
        this.DepositDefaultForm.controls['YearDdl'].setValue(this.yearDdl.Id);
      });

    this.DepositDefaultForm.get('CollectorCodeDdl').disable();
    this.DepositDefaultForm.get('AllGroupDdl').disable();
  }

  public CollectorChbChange() {
    if (this.isCollectorDisable == true) {
      this.isCollectorDisable = false;
      this.DepositDefaultForm.get('CollectorCodeDdl').enable();
    } else {
      this.isCollectorDisable = true;
      this.DepositDefaultForm.get('CollectorCodeDdl').disable();
      this.DepositDefaultForm.controls['CollectorCodeInput'].setValue('');
      this.DepositDefaultForm.controls['CollectorCodeDdl'].setValue('0');
    }
  }
  public GroupDDlChb() {
    if (this.isGroupDisable == true) {
      this.isGroupDisable = false;
      this.DepositDefaultForm.get('AllGroupDdl').enable();
    } else {
      this.isGroupDisable = true;
      this.DepositDefaultForm.get('AllGroupDdl').disable();
      this.DepositDefaultForm.controls['GroupNameInput'].setValue('');
      this.DepositDefaultForm.controls['AllGroupDdl'].setValue('0');
    }
  }
  public AccInput() {
    this.DepositDefaultForm.controls['AccountDdl'].setValue(
      this.DepositDefaultForm.value.AccNameInput
    );
    let AccTypeId = this.DepositDefaultForm.controls['AccountDdl'].value;
    console.log(AccTypeId);

    //start get acctype Mode
    this.spinner.show();
    this.loanRecoveryReportService
      .getAccTypeClassDetails(AccTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accTypeClassData = data;
        console.log('This is accTypeMode=', this.accTypeClassData);
        this.spinner.hide();

        (err) => {
          this.spinner.hide();
        };
      });
    //end get acctype Mode
  }

  // public AccDDLChange() {
  //   this.DepositDefaultForm.controls['AccNameInput'].setValue(
  //     this.DepositDefaultForm.value.AccountDdl
  //   );
  // }

  public GroupInputChange() {
    this.DepositDefaultForm.controls['AllGroupDdl'].setValue(
      this.DepositDefaultForm.value.GroupNameInput
    );
  }
  public GroupDDLOptChange() {
    this.DepositDefaultForm.controls['GroupNameInput'].setValue(
      this.DepositDefaultForm.value.AllGroupDdl
    );
  }
  public CollectorCodeChange() {
    this.DepositDefaultForm.controls['CollectorCodeDdl'].setValue(
      this.DepositDefaultForm.value.CollectorCodeInput
    );
  }
  public CollectorCodeDDLChange() {
    this.DepositDefaultForm.controls['CollectorCodeInput'].setValue(
      this.DepositDefaultForm.value.CollectorCodeDdl
    );
  }

  public getReportToken = (type: any) => {
    if (this.DepositDefaultForm.controls['AccountDdl'].value == '0') {
      alert('Please Select Account Type!');
      return;
    }

    if (
      this.DepositDefaultForm.controls['LoanInfoRb'].value == '0' &&
      this.DepositDefaultForm.controls['DefaulterInputFrom'].value == ''
    ) {
      alert('Please Input Defaulter No. of Period!');
      return;
    }

    if (
      this.DepositDefaultForm.controls['LoanInfoRb'].value == '0' &&
      this.DepositDefaultForm.controls['DefaulterInputTo'].value == ''
    ) {
      alert('Please Input Defaulter No. of Period!');
      return;
    }

    if (this.DepositDefaultForm.controls['MonthDdl'].value == '0') {
      alert('Please Select Month!');
      return;
    }

    if (this.DepositDefaultForm.controls['YearDdl'].value == '0') {
      alert('Please Select Year!');
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

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  private setParameter(): void {
    var fValue = this.DepositDefaultForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('LoanInfoRb', fValue.LoanInfoRb)
    );

    //start AccType
    this.reportModel.Values.push(
      new ReportKeyValue('AccType', fValue.AccountDdl)
    );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccTypeDesc',
        this.getSelectedItemText(
          fValue.AccountDdl,
          this.pageLoadModel.AllAccountDropdown
        )
      )
    );

    // end AccType

    //start Collector
    if (fValue.CollectorChb === '0') {
      this.reportModel.Values.push(new ReportKeyValue('Collector', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue('CollectorDesc', 'All Collector')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('Collector', fValue.CollectorCodeInput)
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'CollectorDesc',
          this.getSelectedItemText(
            fValue.CollectorCodeInput,
            this.pageLoadModel.AllCollectorDropdown
          )
        )
      );
    }

    //end Collector

    //start Group
    if (fValue.GroupChb === '0') {
      this.reportModel.Values.push(new ReportKeyValue('Group', '0'));
      this.reportModel.Values.push(
        new ReportKeyValue('GroupDesc', 'All Group')
      );
    } else {
      this.reportModel.Values.push(
        new ReportKeyValue('Group', fValue.GroupNameInput)
      );
      this.reportModel.Values.push(
        new ReportKeyValue(
          'GroupDesc',
          this.getSelectedItemText(
            fValue.GroupNameInput,
            this.pageLoadModel.AllGroupDropdown
          )
        )
      );
    }

    //end Group

    this.reportModel.Values.push(
      new ReportKeyValue('DefaulterInputFrom', fValue.DefaulterInputFrom)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('DefaulterInputTo', fValue.DefaulterInputTo)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('MonthDdl', fValue.MonthDdl)
    );

    this.reportModel.Values.push(new ReportKeyValue('YearDdl', fValue.YearDdl));

    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccTypeMode',
        this.accTypeClassData.AccTypeClass.toString()
      )
    );

    this.reportModel.Values.push(
      new ReportKeyValue(
        'MonthDesc',
        this.getSelectedItemText(
          fValue.MonthDdl,
          this.pageLoadModel.AllMonthDropdown
        )
      )
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

  //events A/C Type
  onChangeAccType(event: any) {
    this.DepositDefaultForm.controls['AccNameInput'].setValue(
      this.DepositDefaultForm.value.AccountDdl
    );

    let AccTypeId = this.DepositDefaultForm.controls['AccountDdl'].value;
    console.log(AccTypeId);

    //start get acctype Mode
    this.spinner.show();
    this.loanRecoveryReportService
      .getAccTypeClassDetails(AccTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accTypeClassData = data;
        console.log('This is accTypeMode=', this.accTypeClassData);
        this.spinner.hide();

        (err) => {
          this.spinner.hide();
        };
      });
    //end get acctype Mode
  }

  // Gridview
  public ShowGrid = () => {
    if (this.DepositDefaultForm.controls['AccountDdl'].value == '0') {
      alert('Please Select Account Type!');
      return;
    }

    if (
      this.DepositDefaultForm.controls['LoanInfoRb'].value == '0' &&
      this.DepositDefaultForm.controls['DefaulterInputFrom'].value == ''
    ) {
      alert('Please Input Defaulter No. of Period!');
      return;
    }

    if (
      this.DepositDefaultForm.controls['LoanInfoRb'].value == '0' &&
      this.DepositDefaultForm.controls['DefaulterInputTo'].value == ''
    ) {
      alert('Please Input Defaulter No. of Period!');
      return;
    }

    if (this.DepositDefaultForm.controls['MonthDdl'].value == '0') {
      alert('Please Select Month!');
      return;
    }

    if (this.DepositDefaultForm.controls['YearDdl'].value == '0') {
      alert('Please Select Year!');
      return;
    }
    this.showGrid1 = true;
    this.getGrid1InfoDetails();
  };

  public ShowGrid2 = (event: any) => {
    this.accountType = this.DepositDefaultForm.controls['AccountDdl'].value;
    this.accountNo = event.AccNo;
    this.memberNo = event.MemNo;
    this.memberName = event.MemName;

    this.showGrid2 = true;
    this.getGrid2InfoDetails(event);
  };

  // Grid1 Info table data
  getGrid1InfoDetails = () => {
    var fValue = this.DepositDefaultForm.value;

    let ldata = this.DepositDefaultForm.controls['LoanInfoRb'].value;

    let amdata = this.accTypeClassData.AccTypeClass.toString();
    let adata = this.DepositDefaultForm.controls['AccountDdl'].value;

    let mdata = this.DepositDefaultForm.controls['MonthDdl'].value;
    let ydata = this.DepositDefaultForm.controls['YearDdl'].value;
    let cdata = this.DepositDefaultForm.controls['CollectorCodeInput'].value;
    if (fValue.CollectorChb === '0') {
      cdata = '0';
    }

    let gdata = fValue.GroupNameInput;
    if (fValue.GroupChb === '0') {
      gdata = '0';
    }
    let dfdata = fValue.DefaulterInputFrom;
    let dtdata = fValue.DefaulterInputTo;

    console.log(ldata);
    console.log(amdata);
    console.log(adata);
    console.log(mdata);
    console.log(ydata);
    console.log(cdata);
    console.log(gdata);
    console.log(dfdata);
    console.log(dtdata);

    if (
      ldata &&
      amdata &&
      adata &&
      mdata &&
      ydata &&
      cdata &&
      gdata &&
      dfdata &&
      dtdata
    ) {
      this.spinner.show();
      this.depositDefaulterReportService
        .GetGrid1Info(
          ldata,
          amdata,
          adata,
          mdata,
          ydata,
          cdata,
          gdata,
          dfdata,
          dtdata
        )
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.Grid1DataList = x;
            console.log('This is Grid1Table information', this.Grid1DataList);

            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error('Invalid !', 'Error');
          }
        );
    }
  };

  // Grid2 Info table data
  getGrid2InfoDetails = (event: any) => {
    var fValue = this.DepositDefaultForm.value;
    this.accountDesc = this.getSelectedItemText(
      fValue.AccountDdl,
      this.pageLoadModel.AllAccountDropdown
    );

    let mtdata = event.MemType;

    let mndata = event.MemNo;

    let andata = event.AccNo;

    let amdata = this.accTypeClassData.AccTypeClass.toString();

    let acdata = this.DepositDefaultForm.controls['AccountDdl'].value;

    let mdata = this.DepositDefaultForm.controls['MonthDdl'].value;
    let ydata = this.DepositDefaultForm.controls['YearDdl'].value;

    console.log(mtdata);
    console.log(mndata);
    console.log(andata);
    console.log(amdata);
    console.log(acdata);
    console.log(mdata);
    console.log(ydata);

    if (mtdata && mndata && andata && amdata && acdata && mdata && ydata) {
      this.spinner.show();
      this.depositDefaulterReportService
        .GetGrid2Info(mtdata, mndata, andata, amdata, acdata, mdata, ydata)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.Grid2DataList = x;
            console.log('This is Grid2Table information', this.Grid2DataList);

            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error('Invalid !', 'Error');
          }
        );
    }
  };
}
