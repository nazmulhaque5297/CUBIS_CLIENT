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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoanReceivedReportService } from 'src/app/services/loanreceived-report.service';
import {
  LoanReceivedReportInputHelp,
  AccClassDetails,
  AccNoDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { ChequeBookReportService } from 'src/app/services/chequebook-report.service';
import {
  MemberDetailsCode,
  MemberDetailsCodeByOldAcNo,
} from 'src/app/interfaces/loan-info-report';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-account-statement-report',
  templateUrl: './account-statement-report.component.html',
  styleUrls: ['./account-statement-report.component.css'],
})
export class AccountStatementReportComponent implements OnInit, OnDestroy {
  module: string = '1';
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  public inputHelpAccNoDetails: AccNoDetails = new AccNoDetails();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  public MemberDetailsListByOldAcNo: MemberDetailsCodeByOldAcNo = new MemberDetailsCodeByOldAcNo();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;

  accInfoDetails = [];
  displayTabularData: boolean = false;

  IsActiveOrClosedText: any;
  chbIsActiveAccStatus: boolean;

  AccountStatementForm: FormGroup;
  storefDate: any;
  storetDate: any;
  showPenaltyText: string = 'Show Penalty';

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private chequeBookReportService: ChequeBookReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    //this.reportModel.ReportName = 'AccountStatementIntPenalty01';
    //this.reportModel.ReportName = 'AccountStatementIntPenalty02';
    //this.reportModel.ReportName = 'AccountStatementIntPenalty05';
    //this.reportModel.ReportName = 'AccountStatementIntPenalty06';
    //this.reportModel.ReportName = 'AccountStatementIntPenalty07';
    // this.reportModel.ReportName = 'AccountStatement01';
    //this.reportModel.ReportName = 'AccountStatement02';

    //this.reportModel.ReportName = 'AccountStatement03';
    //this.reportModel.ReportName = 'AccountStatement04';
    // this.reportModel.ReportName = 'AccountStatement05';
    //this.reportModel.ReportName = 'AccountStatement06';
    //this.reportModel.ReportName = 'AccountStatement07';
    this.reportModel.ReportName = 'AccountStatement08';
    this.reportModel.Values = [];
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

  ngOnInit(): void {
    var urlData = this.getResolvedUrl(this.route.snapshot);
    if (urlData == 'booth') this.module = '3';
    else if (urlData == 'accounting') this.module = '1';
    this.initializeForm();
    this.setDefaultOptions();
    //this.getUserDetails();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    this.IsActiveOrClosedText = 'Active A/c';
    this.chbIsActiveAccStatus = true;

    this.AccountStatementForm = new FormGroup({
      IsOldMem: new FormControl(false),
      AccTypeCode: new FormControl('', Validators.required),
      AccType: new FormControl('0'),
      OldAcNo: new FormControl(''),
      MemNo: new FormControl('', Validators.required),
      MemName: new FormControl(''),
      AccNo: new FormControl('', Validators.required),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      Balance: new FormControl(''),
      Status: new FormControl(''),
      IsActiveAcc: new FormControl(true),
      ShowPenalty: new FormControl(false),
    });
  }
  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.AccountStatementForm.controls['IssueFromDate'].setValue(
          data.ApplicationDate
        );
        this.AccountStatementForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.spinner.hide();
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
      });
  }

  onChangeOldAcNo(event: any) {

    let accType = this.AccountStatementForm.controls['AccType'].value;
    console.log(accType);
    let OldAcNoId = this.AccountStatementForm.controls['OldAcNo'].value;
    console.log(OldAcNoId);
    let isActive = this.AccountStatementForm.controls['IsActiveAcc'].value
      ? '1'
      : '0';
    console.log(isActive);
    if (accType && OldAcNoId) {
      this.spinner.show();
      this.loanInfoReportService
        .GetMemberDetailsByOldAccNo(accType, OldAcNoId, isActive)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.MemberDetailsListByOldAcNo = x;
            // invalid memberno
            if (this.MemberDetailsListByOldAcNo.MemNo == 0) {
              alert('Invalid Account Type or OldAcNo No!');
            }
            if (this.MemberDetailsListByOldAcNo.MemberName) {
              this.AccountStatementForm.patchValue({
                MemNo: this.MemberDetailsListByOldAcNo.MemNo,
                MemName: this.MemberDetailsListByOldAcNo.MemberName,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccNo) {
              this.AccountStatementForm.patchValue({
                AccNo: this.MemberDetailsListByOldAcNo.AccNo,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccBalance) {
              this.AccountStatementForm.patchValue({
                Balance: this.MemberDetailsListByOldAcNo.AccBalance,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccStatusDescription) {
              this.AccountStatementForm.patchValue({
                Status: this.MemberDetailsListByOldAcNo.AccStatusDescription,
              });
            }

            console.log(this.MemberDetailsListByOldAcNo);
            console.log(this.MemberDetailsListByOldAcNo.MemberName);
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.MemberDetailsListByOldAcNo = null;
    }
    this.getGetAccountInfoDetails();
  }

  onChangeAcNo(event: any) {
    let accType = this.AccountStatementForm.controls['AccType'].value;
    console.log(accType);
    let AcNoId = this.AccountStatementForm.controls['AccNo'].value;
    console.log(AcNoId);
    let isActive = this.AccountStatementForm.controls['IsActiveAcc'].value
      ? '1'
      : '0';
    console.log(isActive);
    if (accType && AcNoId) {
      this.spinner.show();
      this.loanInfoReportService
        .GetMemberDetailsByAccNo(accType, AcNoId, isActive)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.MemberDetailsListByOldAcNo = x;
            // invalid memberno
            if (this.MemberDetailsListByOldAcNo.MemNo == 0) {
              alert('Invalid Account Type or Account No!');
            }
            if (this.MemberDetailsListByOldAcNo.MemberName) {
              this.AccountStatementForm.patchValue({
                MemNo: this.MemberDetailsListByOldAcNo.MemNo,
                MemName: this.MemberDetailsListByOldAcNo.MemberName,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccNo) {
              this.AccountStatementForm.patchValue({
                AccNo: this.MemberDetailsListByOldAcNo.AccNo,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccOldNumber) {
              this.AccountStatementForm.patchValue({
                OldAcNo: this.MemberDetailsListByOldAcNo.AccOldNumber,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccBalance) {
              this.AccountStatementForm.patchValue({
                Balance: this.MemberDetailsListByOldAcNo.AccBalance,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccStatusDescription) {
              this.AccountStatementForm.patchValue({
                Status: this.MemberDetailsListByOldAcNo.AccStatusDescription,
              });
            }

            console.log(this.MemberDetailsListByOldAcNo);
            console.log(this.MemberDetailsListByOldAcNo.MemberName);
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.MemberDetailsListByOldAcNo = null;
    }
    this.getGetAccountInfoDetails();
  }

  onChangeMemNo(event: any) {

    if(this.AccountStatementForm.controls['AccTypeCode'].value=='' || this.AccountStatementForm.controls['AccTypeCode'].value==null)
    {
      alert("Please Select Account Type!!!")
      this.AccountStatementForm.controls['MemNo'].setValue('');
      document.getElementById(`CodeNumber`).focus();
      return;
    }
    let accType = this.AccountStatementForm.controls['AccType'].value;
    console.log(accType);
    let MemNoId = this.AccountStatementForm.controls['MemNo'].value;
    let isActive = this.AccountStatementForm.controls['IsActiveAcc'].value
      ? '1'
      : '0';
    console.log(isActive);
    console.log(MemNoId);
    if (accType && MemNoId) {
      this.spinner.show();
      this.loanInfoReportService
        .GetMemberDetailsByMemNo(accType, MemNoId, isActive)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.MemberDetailsListByOldAcNo = x;
            console.log("MyData===>",this.MemberDetailsListByOldAcNo)
            // invalid memberno
            if (this.MemberDetailsListByOldAcNo.MemNo == 0) {
              alert('Invalid Member No!');
              this.AccountStatementForm.controls['MemNo'].setValue('');
              document.getElementById(`MemNo`).focus();
              return;
            }
            if (this.MemberDetailsListByOldAcNo.MemberName) {
              this.AccountStatementForm.patchValue({
                // MemNo: this.MemberDetailsListByOldAcNo.MemNo,
                MemName: this.MemberDetailsListByOldAcNo.MemberName,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccNo) {
              this.AccountStatementForm.patchValue({
                AccNo: this.MemberDetailsListByOldAcNo.AccNo,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccOldNumber) {
              this.AccountStatementForm.patchValue({
                OldAcNo: this.MemberDetailsListByOldAcNo.AccOldNumber,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccBalance) {
              this.AccountStatementForm.patchValue({
                Balance: this.MemberDetailsListByOldAcNo.AccBalance,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccStatusDescription) {
              this.AccountStatementForm.patchValue({
                Status: this.MemberDetailsListByOldAcNo.AccStatusDescription,
              });
            }
            console.log(this.MemberDetailsList);
            //console.log(this.MemberDetailsList.MemberName);
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.MemberDetailsList = null;
    }

    this.getGetAccountInfoDetails();
  }

  // Account Info table data
  getGetAccountInfoDetails = () => {
    let accType = this.AccountStatementForm.controls['AccType'].value;
    console.log(accType);
    let MemNoId = this.AccountStatementForm.controls['MemNo'].value;
    let isActive = this.AccountStatementForm.controls['IsActiveAcc'].value
      ? '1'
      : '0';
    console.log(isActive);
    console.log(MemNoId);

    if (accType && MemNoId) {
      this.spinner.show();
      this.loanInfoReportService
        .GetAccountInfo(accType, MemNoId, isActive)
        .pipe(first())
        .subscribe(
          (x: any[]) => {
            this.accInfoDetails = x;
            console.log(
              'This is accInfoTable information',
              this.accInfoDetails
            );
            //show table
            console.log(
              'This is accInfoDetails.length',
              this.accInfoDetails.length
            );

            if (this.accInfoDetails.length > 0) {
              this.getTableReportData();
            } else {
              this.displayTabularData = false;
            }

            //show table

            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            alert('Invalid !');
          }
        );
    }
  };

  public getTableReportData() {
    this.displayTabularData = true;
  }

  // enter key events
  onEnterAccTypeCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if(this.AccountStatementForm.controls['AccTypeCode'].value==' ' || this.AccountStatementForm.controls['AccTypeCode'].value==null)
    {
      document.getElementById(`CodeNumber`).focus();
      return;

    }
    document.getElementById(`OldAcNo`).focus();
  }
  onEnterOldAcNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`MemNo`).focus();
  }

  onEnterMember(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if(this.AccountStatementForm.controls['MemNo'].value=='' || this.AccountStatementForm.controls['MemNo'].value==null)
    {
      document.getElementById(`MemNo`).focus();
      return;
    }
    document.getElementById(`accNo`).focus();
  }

  onChangeAccNo(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`dateFormat1`).focus();
  }
  applicationDateChangeEnter(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`dateFormat`).focus();
  }
  applicationDateEnter(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    document.getElementById(`preview`).focus();
  }

  onChangeAccTypeCode(event: any) {
    let AccTypeCodeId = this.AccountStatementForm.controls['AccTypeCode'].value;
    console.log(AccTypeCodeId);
    if (AccTypeCodeId) {
      this.AccountStatementForm.patchValue({
        AccType: this.getSelectedItemIDAccType(
          AccTypeCodeId,
          this.inputHelpData.accTransferAccountTypeList
        ),
        OldAcNo: '',
        MemNo: '',
        MemName: '',
        AccNo: '',
      });
    }
    //start get acctype class
    this.spinner.show();
    this.loanReceivedReportService
      .getAccTypeClassDetails(AccTypeCodeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accTypeClassData = data;
        console.log("HelloCode===>",this.accTypeClassData.AccTypeClass)
        this.showPenaltyText = !(this.accTypeClassData.AccTypeClass == 2)
          ? (!(this.accTypeClassData.AccTypeClass == 5)
            ? 'Show Interest'
            : 'Show Benefit')
          : 'Show Penalty';
        console.log('This is accTypeClassData=', this.accTypeClassData);
        this.spinner.hide();

        (err) => {
          this.spinner.hide();
        };
      });

    //end get acctype class
    if(this.AccountStatementForm.controls['AccTypeCode'].value=='' ||this.AccountStatementForm.controls[''].value==null)
    {
      document.getElementById(`CodeNumber`).focus();
      return;
    }
    document.getElementById(`OldAcNo`).focus();
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
      this.AccountStatementForm.patchValue({
        AccType: 0,
        AccTypeCode: '',
      });
    }
    return selected.Id;
  }
  onChangeAccType(event: any) {
    let AccTypeId = this.AccountStatementForm.controls['AccType'].value;
    console.log(AccTypeId);
    if (AccTypeId) {
      this.AccountStatementForm.patchValue({
        AccTypeCode: AccTypeId,
        OldAcNo: '',
        MemNo: '',
        MemName: '',
        AccNo: '',
      });
    }
    //start get acctype class
    this.spinner.show();
    this.loanReceivedReportService
      .getAccTypeClassDetails(AccTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.accTypeClassData = data;
        this.showPenaltyText = !(this.accTypeClassData.AccTypeClass == 2)
          ? !(this.accTypeClassData.AccTypeClass == 5)
            ? 'Show Interest'
            : 'Show Benifit'
          : 'Show Penalty';
        console.log('This is accTypeClassData=', this.accTypeClassData);
        this.spinner.hide();

        (err) => {
          this.spinner.hide();
        };
      });

    //end get acctype class
    document.getElementById(`OldAcNo`).focus();
  }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.AccountStatementForm.value;
    this.reportModel.Values = [];

    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccAtyClass',
        this.MemberDetailsListByOldAcNo.AccAtyClass
      )
    );

    // logic for report names start

    if (
      fValue.ShowPenalty &&
      this.MemberDetailsListByOldAcNo.AccAtyClass == '1'
    ) {
      //this.reportModel.ReportName = 'AccountStatementIntPenalty01';
      this.reportModel.ReportName = 'rptMCSAccountStatementIntPenalty01';
      this.reportModel.Values.push(
        new ReportKeyValue('nFlag', '2')
      );
      

      console.log(this.reportModel.ReportName);
    } else if (
      fValue.ShowPenalty &&
      this.MemberDetailsListByOldAcNo.AccAtyClass == '2'
    ) {
      // this.reportModel.ReportName = 'AccountStatementIntPenalty02';
      this.reportModel.ReportName = 'rptMCSAccountStatementIntPenalty02';
      this.reportModel.Values.push(
        new ReportKeyValue('nFlag', '2')
      );

      console.log(this.reportModel.ReportName);
    } else if (
      fValue.ShowPenalty &&
      this.MemberDetailsListByOldAcNo.AccAtyClass == '5'
    ) {
      //this.reportModel.ReportName = 'AccountStatementIntPenalty05';
      this.reportModel.ReportName = 'rptMCSAccountStatementIntPenalty05';
      this.reportModel.Values.push(
        new ReportKeyValue('nFlag', '2')
      );
      console.log(this.reportModel.ReportName);
    } else if (
      fValue.ShowPenalty &&
      this.MemberDetailsListByOldAcNo.AccAtyClass == '6'
    ) {
      //this.reportModel.ReportName = 'AccountStatementIntPenalty06';
      this.reportModel.ReportName = 'rptMCSAccountStatementIntPenalty06';
      this.reportModel.Values.push(
        new ReportKeyValue('nFlag', '2')
      );

      console.log(this.reportModel.ReportName);
    } else if (
      fValue.ShowPenalty &&
      this.MemberDetailsListByOldAcNo.AccAtyClass == '7'
    ) {
      //this.reportModel.ReportName = 'AccountStatementIntPenalty07';
      this.reportModel.ReportName = 'rptMCSAccountStatementIntPenalty07';
      this.reportModel.Values.push(
        new ReportKeyValue('nFlag', '2')
      );

      console.log(this.reportModel.ReportName);
    } else {
      if (this.MemberDetailsListByOldAcNo.AccAtyClass == '1') {
        // this.reportModel.ReportName = 'AccountStatement01';
        this.reportModel.ReportName = 'rptMCsAccountStatement01';
        this.reportModel.Values.push(
          new ReportKeyValue('nFlag', '0')
        );

        console.log(this.reportModel.ReportName);
      } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '2') {
        // this.reportModel.ReportName = 'AccountStatement02';
        this.reportModel.ReportName = 'rptMCsAccountStatement02';
        this.reportModel.Values.push(
          new ReportKeyValue('nFlag', '0')
        );

        console.log(this.reportModel.ReportName);
      } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '3') {
        // this.reportModel.ReportName = 'AccountStatement03';
        this.reportModel.ReportName = 'rptMCsAccountStatement03';
        this.reportModel.Values.push(
          new ReportKeyValue('nFlag', '0')
        );

        console.log(this.reportModel.ReportName);
      } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '4') {
        // this.reportModel.ReportName = 'AccountStatement04';
        this.reportModel.ReportName = 'rptMCsAccountStatement04';
        this.reportModel.Values.push(
          new ReportKeyValue('nFlag', '0')
        );

        console.log(this.reportModel.ReportName);
      } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '5') {
        //this.reportModel.ReportName = 'AccountStatement05';
        this.reportModel.ReportName = 'rptMCsAccountStatement05';
        this.reportModel.Values.push(
          new ReportKeyValue('nFlag', '0')
        );

        console.log(this.reportModel.ReportName);
      } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '6') {
        //this.reportModel.ReportName = 'AccountStatement06';
        this.reportModel.ReportName = 'rptMCsAccountStatement06';
        this.reportModel.Values.push(
          new ReportKeyValue('nFlag', '0')
        );

        console.log(this.reportModel.ReportName);
      } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '7') {
        // this.reportModel.ReportName = 'AccountStatement07';
        this.reportModel.ReportName = 'rptMCsAccountStatement07';
        this.reportModel.Values.push(
          new ReportKeyValue('nFlag', '0')
        );

        console.log(this.reportModel.ReportName);
      } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '8') {
        // this.reportModel.ReportName = 'AccountStatement08';
        this.reportModel.ReportName = 'rptMCsAccountStatement08';
        this.reportModel.Values.push(
          new ReportKeyValue('nFlag', '999')
        );

        console.log(this.reportModel.ReportName);
      }
    }

    //logic for report names end

    this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));
    this.reportModel.Values.push(new ReportKeyValue('OldAcNo', fValue.OldAcNo));
    this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));
    var mName = this.MemberDetailsListByOldAcNo.MemberName;
    this.reportModel.Values.push(new ReportKeyValue('MemberDesc', mName));
    this.reportModel.Values.push(new ReportKeyValue('AccNo', fValue.AccNo));
    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IsActiveAcc', fValue.IsActiveAcc ? '1' : '0')
    );
    this.reportModel.Values.push(
      new ReportKeyValue('ShowPenalty', fValue.ShowPenalty ? '1' : '0')
    );
    this.reportModel.Values.push(
      new ReportKeyValue(
        'AccTypeDesc',
        this.getSelectedItemText(
          fValue.AccType,
          this.inputHelpData.accTransferAccountTypeList
        )
      )
    );
    this.reportModel.Values.push(new ReportKeyValue('AcStatus', fValue.Status));
  }

  public getReportToken = (type:any) => {
    if (this.AccountStatementForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }

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



  isActiveAccClick(e) {
    console.log(e);
    if (e) {
      this.chbIsActiveAccStatus = true;
      this.IsActiveOrClosedText = 'Active A/c';
      this.getGetAccountInfoDetails();
      this.AccountStatementForm.patchValue({
        AccNo: '',
        Balance: '',
        Status: '',
      });
    } else {
      this.chbIsActiveAccStatus = false;
      this.IsActiveOrClosedText = 'Closed A/c';
      this.getGetAccountInfoDetails();
      this.AccountStatementForm.patchValue({
        AccNo: '',
        Balance: '',
        Status: '',
      });
    }
  }

  bindSelectedAccNo(event: any) {
    this.AccountStatementForm.patchValue({
      AccNo: event.target.value,
    });
    this.bindUsingSelectedAccNo(event.target.value);
  }
  bindUsingSelectedAccNo(AcNoId: string) {
    let accType = this.AccountStatementForm.controls['AccType'].value;
    console.log(accType);
    // let AcNoId = this.AccountStatementForm.controls['AccNo'].value;
    console.log(AcNoId);
    let isActive = this.AccountStatementForm.controls['IsActiveAcc'].value
      ? '1'
      : '0';
    console.log(isActive);
    if (accType && AcNoId) {
      this.spinner.show();
      this.loanInfoReportService
        .GetMemberDetailsByAccNo(accType, AcNoId, isActive)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.MemberDetailsListByOldAcNo = x;
            // invalid memberno
            if (this.MemberDetailsListByOldAcNo.MemNo == 0) {
              alert('Invalid Account Type or Account No!');
            }
            if (this.MemberDetailsListByOldAcNo.MemberName) {
              this.AccountStatementForm.patchValue({
                MemNo: this.MemberDetailsListByOldAcNo.MemNo,
                MemName: this.MemberDetailsListByOldAcNo.MemberName,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccNo) {
              this.AccountStatementForm.patchValue({
                AccNo: this.MemberDetailsListByOldAcNo.AccNo,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccOldNumber) {
              this.AccountStatementForm.patchValue({
                OldAcNo: this.MemberDetailsListByOldAcNo.AccOldNumber,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccBalance) {
              this.AccountStatementForm.patchValue({
                Balance: this.MemberDetailsListByOldAcNo.AccBalance,
              });
            }

            if (this.MemberDetailsListByOldAcNo.AccStatusDescription) {
              this.AccountStatementForm.patchValue({
                Status: this.MemberDetailsListByOldAcNo.AccStatusDescription,
              });
            }

            console.log(this.MemberDetailsListByOldAcNo);
            console.log(this.MemberDetailsListByOldAcNo.MemberName);
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.MemberDetailsListByOldAcNo = null;
    }
    this.getGetAccountInfoDetails();
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
  // Date change event
  applicationDateChange() {
    var fv = this.AccountStatementForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.AccountStatementForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.AccountStatementForm.value);
    console.log(this.storefDate);
    document.getElementById(`dateFormat`).focus();
  }
  applicationDateChange2() {
    var fv = this.AccountStatementForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.AccountStatementForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.AccountStatementForm.value);
    console.log(this.storetDate);
    document.getElementById(`preview`).focus();
  }
}
