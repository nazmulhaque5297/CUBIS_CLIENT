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

import { StandardAccountIntReportService } from 'src/app/services/standerd-account-int-report.service';
import {
  StandardAccountIntReportPageLoadModel,
  periodStringDetails,
} from '../../../models/standerd-account-int-report.model';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanRecoveryReportService } from 'src/app/services/loan-recovery-report.service';
import { Store, select } from '@ngrx/store';
import { getCommonData, getUserInfo } from 'src/app/selector/user.selectors';

@Component({
  selector: 'app-standard-account-int-report',
  templateUrl: './standard-account-int-report.component.html',
  styleUrls: ['./standard-account-int-report.component.css'],
})
export class StandardAccountIntReportComponent implements OnInit {
  module: string = '1';
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  public periodStringData: periodStringDetails = new periodStringDetails();
  private destroy$: Subject<void> = new Subject<void>();
  public pageLoadModel: StandardAccountIntReportPageLoadModel = new StandardAccountIntReportPageLoadModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  isCollectorDisable: boolean = true;
  isGroupDisable: boolean = true;
  chbForGenderDisable: boolean = true;
  StandardAccountIntReportForm: FormGroup;
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

  currentMonth: string;
  currentYear: string;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private standardAccountIntReportService: StandardAccountIntReportService,
    private loanRecoveryReportService: LoanRecoveryReportService,
    private store: Store
  ) {
    this.reportModel.ReportName = 'rptCsSBInterestReport';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
    this.store.pipe(select(getUserInfo)).subscribe((userInfo: UserInfo) => {
      this.UserData = userInfo;

      console.log('This is UserData::', this.UserData);
    });
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
    console.log('This is ul data:', urlData);
    var result = '';
    for (var i = 1; i < urlData.length; i++) {
      if (urlData[i] == '/') return result;
      result += urlData[i];
    }
  }

  private initializeForm() {
    this.StandardAccountIntReportForm = new FormGroup({
      BranchNameInput: new FormControl(this.UserData?.UserBranchNo),
      BranchDdl: new FormControl(this.UserData?.UserBranchNo),
      AccNameInput: new FormControl(''),
      AccountDdl: new FormControl('0'),

      PeriodInput: new FormControl(''),
    });

    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.standardAccountIntReportService
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
        console.log('Year', year);
        this.currentMonth = month;
        this.currentYear = year;
        // this.monthDdl = this.selectedMonth.find((x) => x.Id == month);
        // this.yearDdl = this.selectedYear.find((x) => x.Id == year);

        // console.log('SelectedMonth:', this.monthDdl.Description);
        // this.StandardAccountIntReportForm.controls['MonthDdl'].setValue(
        //   this.monthDdl.Id
        // );
        // this.StandardAccountIntReportForm.controls['YearDdl'].setValue(
        //   this.yearDdl.Id
        // );
      });

    // this.StandardAccountIntReportForm.get('CollectorCodeDdl').disable();
    // this.StandardAccountIntReportForm.get('AllGroupDdl').disable();
  }

  public CollectorChbChange() {
    if (this.isCollectorDisable == true) {
      this.isCollectorDisable = false;
      this.StandardAccountIntReportForm.get('CollectorCodeDdl').enable();
    } else {
      this.isCollectorDisable = true;
      this.StandardAccountIntReportForm.get('CollectorCodeDdl').disable();
      this.StandardAccountIntReportForm.controls['CollectorCodeInput'].setValue(
        ''
      );
      this.StandardAccountIntReportForm.controls['CollectorCodeDdl'].setValue(
        '0'
      );
    }
  }
  public GroupDDlChb() {
    if (this.isGroupDisable == true) {
      this.isGroupDisable = false;
      this.StandardAccountIntReportForm.get('AllGroupDdl').enable();
    } else {
      this.isGroupDisable = true;
      this.StandardAccountIntReportForm.get('AllGroupDdl').disable();
      this.StandardAccountIntReportForm.controls['GroupNameInput'].setValue('');
      this.StandardAccountIntReportForm.controls['AllGroupDdl'].setValue('0');
    }
  }
  public AccInput() {
    this.StandardAccountIntReportForm.controls['AccountDdl'].setValue(
      this.StandardAccountIntReportForm.value.AccNameInput
    );
    let AccTypeId = this.StandardAccountIntReportForm.controls['AccountDdl']
      .value;
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

    // start get period string
    this.spinner.show();
    this.standardAccountIntReportService
      .getPeriodString(AccTypeId, this.currentMonth, this.currentYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.periodStringData = data;
        console.log('This is periodStringData=', this.periodStringData);
        this.StandardAccountIntReportForm.controls['PeriodInput'].setValue(
          this.periodStringData.periodString
        );
        this.spinner.hide();

        (err) => {
          this.spinner.hide();
        };
      });
    this.showGrid1 = true;
    this.getGrid1InfoDetails();
    this.showGrid2 = true;
    this.getGrid2InfoDetails();
    // end get period string
  }

  public BranchInput() {
    this.StandardAccountIntReportForm.controls['BranchDdl'].setValue(
      this.StandardAccountIntReportForm.value.BranchNameInput
    );
    let BranchId = this.StandardAccountIntReportForm.controls['BranchDdl']
      .value;
    console.log(BranchId);
  }

  public GroupInputChange() {
    this.StandardAccountIntReportForm.controls['AllGroupDdl'].setValue(
      this.StandardAccountIntReportForm.value.GroupNameInput
    );
  }
  public GroupDDLOptChange() {
    this.StandardAccountIntReportForm.controls['GroupNameInput'].setValue(
      this.StandardAccountIntReportForm.value.AllGroupDdl
    );
  }
  public CollectorCodeChange() {
    this.StandardAccountIntReportForm.controls['CollectorCodeDdl'].setValue(
      this.StandardAccountIntReportForm.value.CollectorCodeInput
    );
  }
  public CollectorCodeDDLChange() {
    this.StandardAccountIntReportForm.controls['CollectorCodeInput'].setValue(
      this.StandardAccountIntReportForm.value.CollectorCodeDdl
    );
  }

  public getReportToken = (type: any) => {
    if (this.StandardAccountIntReportForm.controls['BranchDdl'].value == '0') {
      alert('Please Select Branch!');
      return;
    }

    if (this.StandardAccountIntReportForm.controls['AccountDdl'].value == '0') {
      alert('Please Select Account Type!');
      return;
    }
    if (this.Grid1DataList.length == 0) {
      alert('Calculation Not Done!');
      return;
    }
    this.reportModel.ReportName = 'rptCsSBInterestDetailReport';
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

  public getReportToken2 = (type: any) => {
    if (this.StandardAccountIntReportForm.controls['BranchDdl'].value == '0') {
      alert('Please Select Branch!');
      return;
    }

    if (this.StandardAccountIntReportForm.controls['AccountDdl'].value == '0') {
      alert('Please Select Account Type!');
      return;
    }

    if (this.Grid1DataList.length == 0) {
      alert('Calculation Not Done!');
      return;
    }
    this.reportModel.ReportName = 'rptCsSBInterestReport';
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
    var fValue = this.StandardAccountIntReportForm.value;
    this.reportModel.Values = [];

    // this.reportModel.Values.push(
    //   new ReportKeyValue('LoanInfoRb', fValue.LoanInfoRb)
    // );

    //start Branch
    this.reportModel.Values.push(
      new ReportKeyValue('BranchValue', fValue.BranchDdl)
    );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'BranchDesc',
        this.getSelectedItemText(
          fValue.BranchDdl,
          this.pageLoadModel.AllBranchDropdown
        )
      )
    );

    // end Branch

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

    let valueCommonName1 =
      'Interest Calculation for ' +
      fValue.AccountDdl.toString() +
      ' - ' +
      this.getSelectedItemText(
        fValue.AccountDdl,
        this.pageLoadModel.AllAccountDropdown
      );
    let valueCommonName2 = fValue.PeriodInput.toString();
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName1', valueCommonName1)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('CommonName2', valueCommonName2)
    );

    // this.reportModel.Values.push(
    //   new ReportKeyValue(
    //     'AccTypeMode',
    //     this.accTypeClassData.AccTypeClass.toString()
    //   )
    // );
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

  onChangeBranch(event: any) {
    this.StandardAccountIntReportForm.controls['BranchNameInput'].setValue(
      this.StandardAccountIntReportForm.value.BranchDdl
    );

    let BranchId = this.StandardAccountIntReportForm.controls['BranchDdl']
      .value;
    console.log(BranchId);
  }

  //events A/C Type
  onChangeAccType(event: any) {
    this.StandardAccountIntReportForm.controls['AccNameInput'].setValue(
      this.StandardAccountIntReportForm.value.AccountDdl
    );

    let AccTypeId = this.StandardAccountIntReportForm.controls['AccountDdl']
      .value;
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

    // start get period string
    this.spinner.show();
    this.standardAccountIntReportService
      .getPeriodString(AccTypeId, this.currentMonth, this.currentYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.periodStringData = data;
        console.log('This is periodStringData=', this.periodStringData);
        this.StandardAccountIntReportForm.controls['PeriodInput'].setValue(
          this.periodStringData.periodString
        );
        this.spinner.hide();

        (err) => {
          this.spinner.hide();
        };
      });
    this.showGrid1 = true;
    this.getGrid1InfoDetails();
    this.showGrid2 = true;
    this.getGrid2InfoDetails();
    // end get period string
  }

  // Grid1 Info table data
  getGrid1InfoDetails = () => {
    let adata = this.StandardAccountIntReportForm.controls['AccountDdl'].value;

    console.log(adata);

    if (adata) {
      this.spinner.show();
      this.standardAccountIntReportService
        .GetGrid1Info(adata)
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
  getGrid2InfoDetails = () => {
    var fValue = this.StandardAccountIntReportForm.value;

    let acdata = this.StandardAccountIntReportForm.controls['AccountDdl'].value;

    console.log(acdata);

    if (acdata) {
      this.spinner.show();
      this.standardAccountIntReportService
        .GetGrid2Info(acdata)
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
