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
import { JournalReportService } from 'src/app/services/journal-report.service';
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { JournalReportInputHelp } from 'src/app/Models/journal-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import { FinalAccountsReportService } from 'src/app/services/final-accounts-report.service';

@Component({
  selector: 'app-final-accounts-report',
  templateUrl: './final-accounts-report.component.html',
  styleUrls: ['./final-accounts-report.component.css'],
})
export class FinalAccountsReportComponent implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  public inputHelpData2: JournalReportInputHelp = new JournalReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  FinalAccountsReportForm: FormGroup;

  storefDate: any;
  storetDate: any;
  showGridbutton: boolean = true;
  showBackButton: boolean = false;
  stage: string = 'stage0';
  showGrid1: boolean = false;
  showGrid2: boolean = false;
  showGrid3: boolean = false;
  showGrid4: boolean = false;
  showGrid1selected: boolean = false;
  showGrid2selected: boolean = false;
  showGrid3selected: boolean = false;
  Grid1DataList = [];
  Grid2DataList = [];
  Grid3DataList = [];
  Grid4DataList = [];
  selectedGrid1DataList = [];
  selectedGrid2DataList = [];
  selectedGrid3DataList = [];

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private journalReportService: JournalReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService,
    private finalAccountsReportService: FinalAccountsReportService
  ) {
    this.reportModel.ReportName = 'GLFinalAccIncomeExpenses3rd';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
  }

  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.FinalAccountsReportForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.FinalAccountsReportForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
        this.spinner.hide();
      });
  }

  private initializeForm() {
    this.FinalAccountsReportForm = new FormGroup({
      rbLayer: new FormControl('4'),

      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),

      rbReportName: new FormControl('1'),

      chbShowZero: new FormControl(false),

      rbLanguage: new FormControl('0'),
      // rbAccNoWise: new FormControl('1'),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    console.log('stage info', this.stage);
    var fValue = this.FinalAccountsReportForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue('rbLanguage', fValue.rbLanguage)
    );
    this.reportModel.Values.push(new ReportKeyValue('rbLayer', fValue.rbLayer));

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('rbReportName', fValue.rbReportName)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('chbShowZero', fValue.chbShowZero)
    );
    this.reportModel.Values.push(new ReportKeyValue('stage', this.stage));

    if (this.stage === 'stage0') {
      // reports when no Grid is present
      if (fValue.rbReportName === '4') {
        // this.reportModel.ReportName = 'GLFinalAccTrialBalanceOld';
        if (fValue.rbLanguage == '0') {
          this.reportModel.ReportName = 'rptTrialBalanceOld';
        } else {
          this.reportModel.ReportName = 'rptTrialBalanceOldB';
        }
      } else if (fValue.rbReportName !== '4' && fValue.rbLayer === '1') {
        // this.reportModel.ReportName = 'GLFinalAccTrialBalance1st';
        if (fValue.rbLanguage == '0') {
          this.reportModel.ReportName = 'rptTrialBalance1st';
        } else {
          this.reportModel.ReportName = 'rptTrialBalance1stB';
        }
      } else if (fValue.rbReportName !== '4' && fValue.rbLayer === '2') {
        // this.reportModel.ReportName = 'GLFinalAccTrialBalance2nd';
        if (fValue.rbLanguage == '0') {
          this.reportModel.ReportName = 'rptTrialBalance2nd';
        } else {
          this.reportModel.ReportName = 'rptTrialBalance2ndB';
        }
      } else if (fValue.rbReportName !== '4' && fValue.rbLayer === '3') {
        //this.reportModel.ReportName = 'GLFinalAccIncomeExpenses3rd';
        if (fValue.rbLanguage == '0') {
          this.reportModel.ReportName = 'rptIncomeExpenses3rd';
        } else {
          this.reportModel.ReportName = 'rptIncomeExpenses3rdB';
        }
      } else if (fValue.rbReportName !== '4' && fValue.rbLayer === '4') {
        // this.reportModel.ReportName = 'GLFinalAccIncomeExpenses4th';
        if (fValue.rbLanguage == '0') {
          this.reportModel.ReportName = 'rptIncomeExpenses4th';
        } else {
          this.reportModel.ReportName = 'rptIncomeExpenses4thB';
        }
      }
    } else {
      // reports when there is Grid
      // first Grid start
      if (this.stage === 'stage1') {
        // this.reportModel.ReportName = 'GLFinalAccTrialBalance2nd';
        this.reportModel.ReportName = 'rptTrialBalance2nd';
        if (fValue.rbReportName === '1') {
          this.reportModel.Values.push(new ReportKeyValue('CommonNo1', '0'));

          this.reportModel.Values.push(
            new ReportKeyValue('CommonName1', 'Trial Balance - [2nd Layer]')
          );
        }
        if (fValue.rbReportName === '2') {
          this.reportModel.Values.push(new ReportKeyValue('CommonNo1', '2'));
          this.reportModel.Values.push(
            new ReportKeyValue('CommonName1', 'Income & Expenses - [2nd Layer]')
          );
        }
        if (fValue.rbReportName === '3') {
          this.reportModel.Values.push(new ReportKeyValue('CommonNo1', '3'));
          this.reportModel.Values.push(
            new ReportKeyValue('CommonName1', 'Balance Sheet - [2nd Layer]')
          );
        }
      }
      // first Grid end

      // 2nd Grid start
      if (this.stage === 'stage2') {
        console.log('rbReportName', fValue.rbReportName);
        // this.reportModel.ReportName = 'GLFinalAccIncomeExpenses3rd';
        this.reportModel.ReportName = 'rptIncomeExpenses3rd';

        if (fValue.rbReportName === '1') {
          this.reportModel.Values.push(new ReportKeyValue('CommonNo1', '5'));

          this.reportModel.Values.push(
            new ReportKeyValue('CommonName1', 'Trial Balance - [3rd Layer]')
          );
          this.reportModel.Values.push(
            new ReportKeyValue(
              'CommonNo2',
              this.selectedGrid1DataList[0].GLAccNo
            )
          );
        }
        if (fValue.rbReportName === '2') {
          this.reportModel.Values.push(new ReportKeyValue('CommonNo1', '5'));
          this.reportModel.Values.push(
            new ReportKeyValue('CommonName1', 'Income & Expenses - [3rd Layer]')
          );
          this.reportModel.Values.push(
            new ReportKeyValue(
              'CommonNo2',
              this.selectedGrid1DataList[0].GLAccNo
            )
          );
        }
        if (fValue.rbReportName === '3') {
          this.reportModel.Values.push(new ReportKeyValue('CommonNo1', '5'));
          this.reportModel.Values.push(
            new ReportKeyValue('CommonName1', 'Balance Sheet - [3rd Layer]')
          );
          this.reportModel.Values.push(
            new ReportKeyValue(
              'CommonNo2',
              this.selectedGrid1DataList[0].GLAccNo
            )
          );
        }
      }
      // 2nd Grid end

      // 3rd Grid start
      if (this.stage === 'stage3') {
        console.log('rbReportName', fValue.rbReportName);
        // this.reportModel.ReportName = 'GLFinalAccIncomeExpenses4th';
        this.reportModel.ReportName = 'rptIncomeExpenses4th';
        if (fValue.rbReportName === '1') {
          this.reportModel.Values.push(new ReportKeyValue('CommonNo1', '5'));
          this.reportModel.Values.push(
            new ReportKeyValue('CommonName1', 'Trial Balance - [4th Layer]')
          );
          this.reportModel.Values.push(
            new ReportKeyValue(
              'CommonNo2',
              this.selectedGrid1DataList[0].GLAccNo
            )
          );
          this.reportModel.Values.push(
            new ReportKeyValue(
              'CommonNo3',
              this.selectedGrid2DataList[0].GLAccNo
            )
          );
        }
        if (fValue.rbReportName === '2') {
          this.reportModel.Values.push(new ReportKeyValue('CommonNo1', '5'));
          this.reportModel.Values.push(
            new ReportKeyValue('CommonName1', 'Income & Expenses - [4th Layer]')
          );
          this.reportModel.Values.push(
            new ReportKeyValue(
              'CommonNo2',
              this.selectedGrid1DataList[0].GLAccNo
            )
          );
          this.reportModel.Values.push(
            new ReportKeyValue(
              'CommonNo3',
              this.selectedGrid2DataList[0].GLAccNo
            )
          );
        }
        if (fValue.rbReportName === '3') {
          this.reportModel.Values.push(new ReportKeyValue('CommonNo1', '5'));
          this.reportModel.Values.push(
            new ReportKeyValue('CommonName1', 'Balance Sheet - [4th Layer]')
          );
          this.reportModel.Values.push(
            new ReportKeyValue(
              'CommonNo2',
              this.selectedGrid1DataList[0].GLAccNo
            )
          );
          this.reportModel.Values.push(
            new ReportKeyValue(
              'CommonNo3',
              this.selectedGrid2DataList[0].GLAccNo
            )
          );
        }
      }
      // 3rd Grid end

      // 4th Grid start
      if (this.stage === 'stage4') {
        console.log('rbReportName', fValue.rbReportName);
        //this.reportModel.ReportName = 'GLAccountStatement';
        this.reportModel.ReportName = 'rptGLAccountStatement';

        this.reportModel.Values.push(
          new ReportKeyValue('CommonNo1', this.selectedGrid3DataList[0].GLAccNo)
        );
        this.reportModel.Values.push(
          new ReportKeyValue(
            'CommonName1',
            this.selectedGrid3DataList[0].GLAccDesc
          )
        );
      }
      // 4th Grid end
    }

    // report Name
    // if (this.stage === 'stage4') {
    //   this.reportModel.ReportName = 'GLAccountStatement';
    // } else if (fValue.rbReportName === '4') {
    //   this.reportModel.ReportName = 'GLFinalAccTrialBalanceOld';
    // } else if (fValue.rbReportName !== '4' && fValue.rbLayer === '1') {
    //   this.reportModel.ReportName = 'GLFinalAccTrialBalance1st';
    // } else if (fValue.rbReportName !== '4' && fValue.rbLayer === '2') {
    //   this.reportModel.ReportName = 'GLFinalAccTrialBalance2nd';
    // } else if (fValue.rbReportName !== '4' && fValue.rbLayer === '3') {
    //   this.reportModel.ReportName = 'GLFinalAccIncomeExpenses3rd';
    // } else if (fValue.rbReportName !== '4' && fValue.rbLayer === '4') {
    //   this.reportModel.ReportName = 'GLFinalAccIncomeExpenses4th';
    // }
  }

  // Date change event
  applicationDateChange() {
    var fv = this.FinalAccountsReportForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.FinalAccountsReportForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.FinalAccountsReportForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.FinalAccountsReportForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.FinalAccountsReportForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.FinalAccountsReportForm.value);
    console.log(this.storetDate);
  }

  // Layer change event
  onChangeLayer = (event: any) => {
    if (event.target.value == '1') {
      console.log('1st layer is now selected');
      this.showGridbutton = false;
    } else {
      this.showGridbutton = true;
    }
  };

  public getReportToken = (type: any) => {
    // let mNo = this.PrevTransTransferListForm.controls['MemNo'].value;
    // console.log(mNo);
    // if (mNo === '') {
    //   this.toastr.error('Please Input Member!', 'Error');
    // } else {
    this.spinner.show();
    this.setParameter();
    //this.spinner.show();
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
    // }
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

  // Back Button click
  public GoBack = () => {
    console.log('curret stage information', this.stage);
    if (this.stage === 'stage4') {
      this.goStage3();
    } else if (this.stage === 'stage3') {
      this.goStage2();
    } else if (this.stage === 'stage2') {
      this.goStage1();
    }
  };
  goStage3 = () => {
    this.stage = 'stage3';
    this.showGrid1 = false;
    this.showGrid2 = false;
    this.showGrid3 = true;
    this.showGrid4 = false;
    this.showGrid1selected = true;
    this.showGrid2selected = true;
    this.showGrid3selected = false;
  };
  goStage2 = () => {
    this.stage = 'stage2';
    this.showGrid1 = false;
    this.showGrid2 = true;
    this.showGrid3 = false;
    this.showGrid4 = false;
    this.showGrid1selected = true;
    this.showGrid2selected = false;
  };
  goStage1 = () => {
    this.stage = 'stage1';
    this.showBackButton = false;
    this.showGrid1 = true;
    this.showGrid2 = false;
    this.showGrid3 = false;
    this.showGrid4 = false;
    this.showGrid1selected = false;
    this.showGrid2selected = false;
  };

  // gridview
  public ShowGrid = () => {
    this.stage = 'stage1';
    this.showGrid1 = true;
    this.getGrid1InfoDetails();
  };
  public ShowGrid2 = (event: any) => {
    // show back button
    this.showBackButton = true;
    this.stage = 'stage2';

    this.showGrid1 = false;
    this.showGrid2 = true;
    this.getGrid2InfoDetails(event);
    //show selected
    this.selectedGrid1DataList = [];
    this.selectedGrid1DataList.push(event);
    this.showGrid1selected = true;
  };
  public ShowGrid3 = (event: any) => {
    // show back button
    this.showBackButton = true;
    this.stage = 'stage3';

    this.showGrid1 = false;
    this.showGrid2 = false;
    this.showGrid3 = true;
    this.getGrid3InfoDetails(event);
    //show selected
    this.selectedGrid2DataList = [];
    this.selectedGrid2DataList.push(event);
    this.showGrid2selected = true;
  };

  public ShowGrid4 = (event: any) => {
    // show back button
    this.showBackButton = true;
    this.stage = 'stage4';

    this.showGrid1 = false;
    this.showGrid2 = false;
    this.showGrid3 = false;
    this.showGrid4 = true;
    this.getGrid4InfoDetails(event);
    //show selected
    this.selectedGrid3DataList = [];
    this.selectedGrid3DataList.push(event);
    this.showGrid3selected = true;
  };

  // Grid1 Info table data
  getGrid1InfoDetails = () => {
    let rbtOpt = this.FinalAccountsReportForm.controls['rbReportName'].value;
    console.log(rbtOpt);
    let fdata = this.storefDate;
    let tdata = this.storetDate;

    console.log(fdata);
    console.log(tdata);

    if (rbtOpt && fdata) {
      this.spinner.show();
      this.finalAccountsReportService
        .GetGrid1Info(rbtOpt, fdata, tdata)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.Grid1DataList = x;
            console.log('This is Grid1Table information', this.Grid1DataList);
            //show table
            // console.log(
            //   'This is Grid1Table.length',
            //   this.Grid1DataList.length
            // );

            // if (this.accInfoDetails.length > 0) {
            //   this.getTableReportData();
            // } else {
            //   this.displayTabularData = false;
            // }

            //show table

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
    let rbtOpt = this.FinalAccountsReportForm.controls['rbReportName'].value;
    let selectedGLAccNo = event.GLAccNo;
    console.log(rbtOpt);
    console.log(selectedGLAccNo);

    if (rbtOpt && selectedGLAccNo) {
      this.spinner.show();
      this.finalAccountsReportService
        .GetGrid2Info(rbtOpt, selectedGLAccNo)
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
  // Grid3 Info table data
  getGrid3InfoDetails = (event: any) => {
    let rbtOpt = this.FinalAccountsReportForm.controls['rbReportName'].value;
    let selectedGLAccNo = event.GLAccNo;
    console.log(rbtOpt);
    console.log(selectedGLAccNo);

    if (rbtOpt && selectedGLAccNo) {
      this.spinner.show();
      this.finalAccountsReportService
        .GetGrid3Info(rbtOpt, selectedGLAccNo)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.Grid3DataList = x;
            console.log('This is Grid3Table information', this.Grid3DataList);

            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error('Invalid !', 'Error');
          }
        );
    }
  };
  // Grid4 Info table data
  getGrid4InfoDetails = (event: any) => {
    let selectedGLAccNo = event.GLAccNo;
    console.log(selectedGLAccNo);
    let fdata = this.storefDate;
    let tdata = this.storetDate;

    console.log(fdata);
    console.log(tdata);

    if (selectedGLAccNo && fdata) {
      this.spinner.show();
      this.finalAccountsReportService
        .GetGrid4Info(selectedGLAccNo, fdata, tdata)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.Grid4DataList = x;
            console.log('This is Grid4Table information', this.Grid4DataList);
            //show table
            // console.log(
            //   'This is Grid1Table.length',
            //   this.Grid1DataList.length
            // );

            // if (this.accInfoDetails.length > 0) {
            //   this.getTableReportData();
            // } else {
            //   this.displayTabularData = false;
            // }

            //show table

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
