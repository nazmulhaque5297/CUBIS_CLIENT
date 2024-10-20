import { DatePipe, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { IdDescription } from 'src/app/interfaces/id-description';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { UserInfo } from 'src/app/Models/Common.model';
import { JournalReportInputHelp } from 'src/app/Models/journal-report.model';
import {
  AccClassDetails,
  LoanReceivedReportInputHelp,
} from 'src/app/Models/loanreceived-report.model';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { GLAccountStatementService } from 'src/app/services/gl-account-statement-report.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import { GLAccountStatementPageLoadModel } from '../../../models/gl-account-statement-report.model';
@Component({
  selector: 'app-gl-account-statement-reports',
  templateUrl: './gl-account-statement-reports.component.html',
  styleUrls: ['./gl-account-statement-reports.component.css'],
})
export class GlAccountStatementReportsComponent implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp =
    new LoanReceivedReportInputHelp();
  public inputHelpData2: JournalReportInputHelp = new JournalReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  allUnitDropdown: any;
  chbIsAllUnitCodeStatus: any;
  headerCodeValue: any;
  mainHeadCodeValue: any;
  subHeadCodeValue: any;
  detailsCodeValue: any;
  glCodeValue: any;
  accountCode: any;
  commonName1: any;
  commonName2: any;
  fDate: any;
  tDate: any;
  nFlag: any;
  storetDate: any;
  storefDate: any;
  backButton: number = 0;
  mainHeadCode: any[] = [];
  subHeadCode: any[] = [];
  detailsCode: any[] = [];
  showGLAccount: boolean = false;
  showMainHeadCode: boolean = false;
  showSubHeadCode: boolean = false;
  showDetailsCode: boolean = false;

  showHeader: boolean = false;
  showMainHead: boolean = false;
  showSubHead: boolean = false;
  showDetails: boolean = false;

  IsAllUnitCodeDisabled: any;

  GLAccountStatementReportForm: FormGroup;

  GetInputHelpData: GLAccountStatementPageLoadModel =
    new GLAccountStatementPageLoadModel();
  button1: boolean = false;
  button2: boolean = false;
  button3: boolean = false;
  button4: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private aService: ReportCommonService,
    //private loanInfoReportService: LoanInfoReportService,
    private glAccountStatementService: GLAccountStatementService,
    private location: Location
  ) {
    this.reportModel.ReportName = 'rptMGLAccountStatement';
    this.reportModel.Values = [];
  }
  ngOnInit(): void {
    this.backButton = 0;
    this.initializeForm();
    this.showGLAccount = true;
    this.showHeader = false;
    this.showMainHead = false;
    this.showSubHead = false;
    this.showDetails = false;

    this.button1 = false;
  }
  private initializeForm() {
    this.chbIsAllUnitCodeStatus = true;
    this.IsAllUnitCodeDisabled = true;
    this.GLAccountStatementReportForm = new FormGroup({
      IsAllUnitCode: new FormControl('true'),
      AllUnitCode: new FormControl('0'),
      GLAccountCode: new FormControl(''),
      GLAccount: new FormControl('0'),
      GLMainCode: new FormControl('0'),
      GLSubHeadCode: new FormControl('0'),
      GLDetailsCode: new FormControl('0'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      rbReportName: new FormControl('1'),
    });
    this.getInputHelpData();
  }
  public getInputHelpData() {
    this.glAccountStatementService
      .GetInputHelpData()
      .pipe(first())
      .subscribe((data: any) => {
        console.log('GetInputHelpData:', data);
        this.GetInputHelpData = data;
        this.GLAccountStatementReportForm.controls['IssueFromDate'].setValue(
          this.GetInputHelpData.FromDate
        );
        this.GLAccountStatementReportForm.controls['IssueToDate'].setValue(
          this.GetInputHelpData.ToDate
        );
        this.storefDate = this.GetInputHelpData.FromDate;
        this.storetDate = this.GetInputHelpData.ToDate;
      });
  }
  checkIsAllUnitCode(e) {
    console.log(e);
    if (e) {
      this.chbIsAllUnitCodeStatus = true;
      this.IsAllUnitCodeDisabled = true;
      this.GLAccountStatementReportForm.controls['AllUnitCode'].setValue('0');
    } else {
      this.chbIsAllUnitCodeStatus = false;
      this.GLAccountStatementReportForm.get('AllUnitCode').enable();
    }
  }

  onChangeGlAccount() {
    this.backButton += 1;
    this.headerCodeValue = this.GLAccountStatementReportForm.value.GLAccount;
    console.log('headerCodeValue:', this.headerCodeValue);
    this.glAccountStatementService
      .MainHeadCode(this.GLAccountStatementReportForm.value.GLAccount)
      .pipe(first())
      .subscribe((data: any) => {
        this.mainHeadCode = data.MainHeadCodeDropDown;
        console.log('mainHeadCode:', this.mainHeadCode);
        this.showMainHeadCode = true;
        this.showGLAccount = false;
        this.GLAccountStatementReportForm.controls['GLMainCode'].setValue(0);
        this.button1 = true;
      });
  }
  onChangeMainHeadCode() {
    this.backButton += 1;
    this.button1 = false;
    this.button2 = true;
    this.mainHeadCodeValue = this.GLAccountStatementReportForm.value.GLMainCode;
    console.log('MainCodeValue:', this.mainHeadCodeValue);
    this.glAccountStatementService
      .SubHeadCode(this.GLAccountStatementReportForm.value.GLMainCode)
      .pipe(first())
      .subscribe((data: any) => {
        this.subHeadCode = data.SubHeadCodeDropDown;
        console.log('SubHeadCode:', this.subHeadCode);
        this.showSubHeadCode = true;
        this.showMainHeadCode = false;
        this.showGLAccount = false;
        this.GLAccountStatementReportForm.controls['GLSubHeadCode'].setValue(0);
      });
  }

  onChangeSubHeadCode() {
    this.backButton += 1;
    this.button1 = false;
    this.button2 = false;
    this.button3 = true;
    //this.GLAccountStatementReportForm.controls['GLAccountCode'].setValue( this.GLAccountStatementReportForm.value.GLAccount);
    this.subHeadCodeValue =
      this.GLAccountStatementReportForm.value.GLSubHeadCode;
    console.log('SubHeadCodeValue:', this.subHeadCodeValue);
    this.glAccountStatementService
      .SelectDetailsCode(this.GLAccountStatementReportForm.value.GLSubHeadCode)
      .pipe(first())
      .subscribe((data: any) => {
        this.detailsCode = data.SelectDetailsDropDown;
        console.log('DetailsCode:', this.detailsCode);
        this.showDetailsCode = true;
        this.showMainHeadCode = false;
        this.showGLAccount = false;
        this.showSubHeadCode = false;
        this.GLAccountStatementReportForm.controls['GLDetailsCode'].setValue(0);
      });
  }

  onChangeDetailsCode() {
    this.backButton += 1;
    this.button1 = false;
    this.button2 = false;
    this.button3 = false;
    this.button4 = true;
    console.log('BackButtonValue:', this.backButton);
    this.detailsCodeValue = this.GLAccountStatementReportForm.controls[
      'GLAccountCode'
    ].setValue(this.GLAccountStatementReportForm.value.GLDetailsCode);
    this.accountCode = this.GLAccountStatementReportForm.value.GLAccountCode;
    this.commonName2 = this.detailsCode.find(
      (x) => x.Id == this.GLAccountStatementReportForm.value.GLDetailsCode
    );
    console.log('CommonName2:', this.commonName2.Description);
    console.log('DetailsCodeValue', this.accountCode);
  }

  OnChangeGLCode() {
    this.glCodeValue =
      this.GLAccountStatementReportForm.controls[
        'GLAccountCode'
      ].value.toString();
    const pattern1 = this.glCodeValue.substring(0, 1) + '0000000';
    const pattern2 = this.glCodeValue.substring(0, 4) + '0000';
    const pattern3 = this.glCodeValue.substring(0, 5) + '000';
    if (this.glCodeValue == pattern1) {
      this.backButton += 1;
      this.button1 = true;
      this.button2 = false;
      this.button3 = false;
      this.headerCodeValue = pattern1;
      console.log('headerCodeValue:', this.headerCodeValue);
      this.glAccountStatementService
        .MainHeadCode(this.headerCodeValue)
        .pipe(first())
        .subscribe((data: any) => {
          this.mainHeadCode = data.MainHeadCodeDropDown;
          console.log('mainHeadCode:', this.mainHeadCode);
          this.showMainHeadCode = true;
          this.showSubHeadCode = false;
          this.showGLAccount = false;
          this.showDetailsCode=false;
          if (this.GLAccountStatementReportForm.value.GLAccountCode==pattern2) {
            this.GLAccountStatementReportForm.controls['GLMainCode'].setValue(
              '0'
            );
          }
          else{
            this.GLAccountStatementReportForm.controls['GLMainCode'].setValue(
              this.GLAccountStatementReportForm.value.GLAccountCode
            );
          }


          this.button1 = true;
        });
    } else if (this.glCodeValue == pattern2) {
      this.backButton += 1;
      this.button1 = false;
      this.button2 = true;
      this.button3 = false;
      this.mainHeadCodeValue = pattern2;
      console.log('MainCodeValue:', this.mainHeadCodeValue);
      this.glAccountStatementService
        .SubHeadCode(this.mainHeadCodeValue)
        .pipe(first())
        .subscribe((data: any) => {
          this.subHeadCode = data.SubHeadCodeDropDown;
          console.log('SubHeadCode:', this.subHeadCode);
          this.showSubHeadCode = true;
          this.showMainHeadCode = false;
          this.showGLAccount = false;
          this.showDetailsCode=false;
          if (this.GLAccountStatementReportForm.value.GLAccountCode==pattern2) {
            this.GLAccountStatementReportForm.controls[
              'GLSubHeadCode'
            ].setValue('0');
          }
          else
          {
            this.GLAccountStatementReportForm.controls['GLSubHeadCode'].setValue(
              this.GLAccountStatementReportForm.value.GLAccountCode
            );
          }
          this.button2 = true;

        });
    } else {
      this.backButton += 1;
      this.button1 = false;
      this.button2 = false;
      this.button3 = true;
      //this.GLAccountStatementReportForm.controls['GLAccountCode'].setValue( this.GLAccountStatementReportForm.value.GLAccount);
      this.subHeadCodeValue = pattern3;
      console.log('SubHeadCodeValue:', this.subHeadCodeValue);
      this.glAccountStatementService
        .SelectDetailsCode(this.subHeadCodeValue)
        .pipe(first())
        .subscribe((data: any) => {
          console.log('Datttaaaa===>', data);
          this.detailsCode = data.SelectDetailsDropDown;
          console.log('DetailsCode======>>:', this.detailsCode);
          this.showDetailsCode = true;
          this.showMainHeadCode = false;
          this.showGLAccount = false;
          this.showSubHeadCode = false;
          if (this.GLAccountStatementReportForm.value.GLAccountCode==pattern3)
          {
            this.GLAccountStatementReportForm.controls[
              'GLDetailsCode'
            ].setValue('0');  
          }
          else
          {
            this.GLAccountStatementReportForm.controls[
              'GLDetailsCode'
            ].setValue(this.GLAccountStatementReportForm.value.GLAccountCode);
          }


          this.button3 = true;
        });
    }

    console.log('Checkkkk1===>>', pattern1);
    console.log('Checkkkk2===>>', pattern2);
    console.log('Checkkkk3===>>', pattern3);
  }

  //  //BackButton Start

  backButtonPress1() {
    console.log('coming here motivation de1');
    if (this.backButton == 1) {
      this.showMainHeadCode = false;
      this.showGLAccount = true;
      this.backButton -= 1;
      this.GLAccountStatementReportForm.controls['GLAccount'].setValue(0);
      this.button1 = false;
    }
  }

  backButtonPress2() {
    console.log('coming here motivation de2');
    if (this.backButton == 2) {
      this.showSubHeadCode = false;
      this.showMainHeadCode = true;
      this.backButton -= 1;
      this.GLAccountStatementReportForm.controls['GLMainCode'].setValue(0);
      this.button1 = true;
      this.button2 = false;
    }
  }

  backButtonPress3() {
    console.log('coming here motivation de3');
    if (this.backButton == 3) {
      this.showDetailsCode = false;
      this.showSubHeadCode = true;
      this.backButton -= 1;
      this.GLAccountStatementReportForm.controls['GLSubHeadCode'].setValue(0);
      this.button1 = false;
      this.button2 = true;
      this.button3 = false;
    }
  }

  backButtonPress4() {
    console.log('coming here motivation de4');
    if (this.backButton >= 4) {
      this.showDetailsCode = false;
      this.showSubHeadCode = true;
      this.backButton = 3;
      this.GLAccountStatementReportForm.controls['GLSubHeadCode'].setValue(0);
      this.GLAccountStatementReportForm.controls['GLAccountCode'].setValue('');
      this.button1 = false;
      this.button2 = false;
      this.button3 = true;
      this.button4 = false;
    }
  }
  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  //BackButton End

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.GLAccountStatementReportForm.value;
    this.reportModel.Values = [];

    // report Name
    if (fValue.rbReportName == '1') {
      this.reportModel.ReportName = 'rptMGLAccountStatement';
    } else if (fValue.rbReportName == '2') {
      this.reportModel.ReportName =
        'rptMGLAccountStatementByVchWiseConsolidated';
    } else if (fValue.rbReportName == '3') {
      this.reportModel.ReportName =
        'rptMGLAccountStatementByDateWiseConsolidated';
    }

    this.reportModel.Values.push(
      new ReportKeyValue('rbReportName', fValue.rbReportName)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('accountCode', fValue.GLDetailsCode)
    );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'commonName2',
        this.getSelectedItemText(fValue.GLDetailsCode, this.detailsCode)
      )
    );
    if (fValue.rbReportName === '1') {
      this.reportModel.Values.push(new ReportKeyValue('nFlag', '0'));
    } else if (fValue.rbReportName === '2') {
      this.reportModel.Values.push(new ReportKeyValue('nFlag', '1'));
    } else if (fValue.rbReportName === '3') {
      this.reportModel.Values.push(new ReportKeyValue('nFlag', '2'));
    }

    if (fValue.rbReportName === '2') {
      this.reportModel.Values.push(
        new ReportKeyValue('commonName1', 'By Voucher Wise Consolidated')
      );
    } else if (fValue.rbReportName === '3') {
      this.reportModel.Values.push(
        new ReportKeyValue('commonName1', 'By Day Wise Consolidated')
      );
    }
  }
  //okk
  public getReportToken = (type:any) => {
    let glAccNo =
      this.GLAccountStatementReportForm.controls['GLAccountCode'].value;
    if (glAccNo == '') {
      this.toastr.error('Please Input GL Account Code!');
    } else {
      this.spinner.show();
      this.setParameter();
      //this.spinner.show();
      this.displayIFrame = true;
      console.log('ReportModel:', this.reportModel);
      this.aService
        .getReportToken(this.reportModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (x) => {
            console.log('Value Of X:', x);
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

  // Back button function
  public back = () => {};

  // Date change event
  applicationDateChange() {
    var fv = this.GLAccountStatementReportForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.GLAccountStatementReportForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.GLAccountStatementReportForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.GLAccountStatementReportForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.GLAccountStatementReportForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.GLAccountStatementReportForm.value);
    console.log(this.storetDate);
  }
}
