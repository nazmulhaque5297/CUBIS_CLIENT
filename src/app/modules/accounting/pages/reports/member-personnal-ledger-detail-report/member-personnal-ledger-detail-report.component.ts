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

@Component({
  selector: 'app-member-personnal-ledger-detail-report',
  templateUrl: './member-personnal-ledger-detail-report.component.html',
  styleUrls: ['./member-personnal-ledger-detail-report.component.css'],
})
export class MemberPersonnalLedgerDetailReportComponent
  implements OnInit, OnDestroy {
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
  storefDate: any;
  storetDate: any;

  accInfoDetails = [];
  displayTabularData: boolean = false;

  allCheckedList: any = [];

  // IsActiveOrClosedText: any;
  chbIsActiveAccStatus: boolean;

  // chbIsAllMemberStatus: any;

  // chbIsAllAccTypeStatus: any;
  // chbIsAllTellerStatus: any;
  // chbIsAllBranchStatus: any;
  // IsAccTypeDisabled: any;
  // IsTellerDisabled: any;
  // IsBranchDisabled: any;
  // IsTrnDisabled: any;
  //chbShowZeroBalance: any;

  // chbIsAllTrnStatus: any;

  // ShowWhenUserlvl40: any;
  // ShowWhenUserlvlNot40: any;

  MemberPersonnalLedgerForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private chequeBookReportService: ChequeBookReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    // this.reportModel.ReportName = 'MemberPersonnalLedger1';
    // this.reportModel.ReportName = 'MemberPersonnalLedger2';
    this.reportModel.ReportName = 'MemberPersonnalLedger3';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
    //this.getUserDetails();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    // this.IsActiveOrClosedText = 'Active A/c';
    this.chbIsActiveAccStatus = false;

    //  this.chbIsAllMemberStatus = true;
    // this.chbIsAllAccTypeStatus = true;
    // this.chbIsAllTellerStatus = true;
    // this.chbIsAllBranchStatus = true;
    // this.chbIsAllTrnStatus = true;
    //this.IsAccTypeDisabled = true;
    // this.IsTellerDisabled = true;
    // this.IsBranchDisabled = true;
    // this.IsTrnDisabled = true;
    // this.chbShowZeroBalance = false;
    // this.ShowWhenUserlvl40 = false;
    // this.ShowWhenUserlvlNot40 = true;

    this.MemberPersonnalLedgerForm = new FormGroup({
      // IsAllAccType: new FormControl('true'),
      // IsAllTeller: new FormControl('true'),
      // IsAllBranch: new FormControl('true'),
      // IsAllTrn: new FormControl('true'),

      //  IsOldMem: new FormControl(false),
      // AccTypeCode: new FormControl(''),
      // TellerCode: new FormControl(''),
      // BranchCode: new FormControl(''),
      // TrnCode: new FormControl(''),
      //  AccType: new FormControl('0'),
      // Teller: new FormControl('0'),
      // Branch: new FormControl('0'),
      // Trn: new FormControl('0'),
      IsOldMem: new FormControl(false),
      //  AccTypeCode: new FormControl('', Validators.required),
      // AccType: new FormControl('0'),
      // OldAcNo: new FormControl(''),
      MemNo: new FormControl('', Validators.required),
      MemName: new FormControl(''),
      //AccNo: new FormControl('', Validators.required),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      // Balance: new FormControl(''),
      // Status: new FormControl(''),
      // IsActiveAcc: new FormControl(true),
      WithCloseAc: new FormControl(false),
      // rbConsolidated: new FormControl('1'),
      // rbOptConsolidated: new FormControl('1'),

      //  IsAllMember: new FormControl('true'),
      //  MemNo: new FormControl(''),
      // MemName: new FormControl(''),

      // ShowZeroBalance: new FormControl('False'),
      // IssueFromDate: new FormControl(''),
      // IssueToDate: new FormControl(''),

      //AccStatus: new FormControl('1'),
    });
  }
  // private getUserDetails(): void {
  //   this.spinner.show();

  //   this.loanReceivedReportService
  //     .getUserInformation()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data) => {
  //       this.UserData = data;
  //       console.log(this.UserData);

  //       // test for lvl40 user START
  //       // this.UserData.IdsFlag = 40;
  //       // test for lvl40 user END

  //       if (this.UserData.IdsFlag != 40) {
  //         this.ShowWhenUserlvl40 = false;
  //         this.ShowWhenUserlvlNot40 = true;
  //       } else {
  //         this.ShowWhenUserlvl40 = true;
  //         this.ShowWhenUserlvlNot40 = false;
  //       }

  //       this.spinner.hide();
  //     });
  // }
  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log(this.inputHelpData);
        this.MemberPersonnalLedgerForm.controls['IssueFromDate'].setValue(
          data.frmDateMemStat
        );
        this.MemberPersonnalLedgerForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.storefDate = data.frmDateMemStat;
        this.storetDate = data.ApplicationDate;
        this.spinner.hide();
      });
  }

  // Account Info table data
  getGetAccountInfoDetails = () => {
    let MemNoId = this.MemberPersonnalLedgerForm.controls['MemNo'].value;
    let withCloseAc = this.MemberPersonnalLedgerForm.controls['WithCloseAc']
      .value
      ? '1'
      : '0';
    console.log(withCloseAc);
    console.log(MemNoId);

    if (MemNoId) {
      this.spinner.show();
      this.loanInfoReportService
        .GetAccountInfoLedger(MemNoId, withCloseAc)
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

  checkHandler = (value) => {
    //new start
    let check = this.allCheckedList.find((x) => x == value);
    if (!check) {
      this.allCheckedList.push(value);
      console.log('This is selected data', this.allCheckedList);
    } else {
      let index = this.allCheckedList.indexOf(value);
      let temp = [];
      var i = 0;
      while (i < this.allCheckedList.length) {
        if (i != index) {
          temp.push(this.allCheckedList[i]);
        }
        i++;
      }
      this.allCheckedList = temp;
      console.log('This is final selected data', this.allCheckedList);
    }
    //new end
  };

  // let list = this.allCheckedList;
  // let toBeAdded = [];

  // let toBeRemoved = [];

  // if (this.allCheckedList.length == 0) {
  //   console.log('This is first time');
  //   toBeAdded.push(value);
  //   this.allCheckedList = toBeAdded;
  // } else {

  // list.map((x) => {
  //   if (x.AccNo == value.AccNo) {
  //     toBeRemoved.push(value);
  //   } else {
  //     toBeAdded.push(value);
  //   }
  // });

  // this.allCheckedList.forEach((element) => {
  //   if (element.AccNo == value.AccNo) {
  //     toBeRemoved.push(value);
  //   } else {
  //     this.allCheckedList.push(value);
  //   }
  // }
  // this.allCheckedList = toBeAdded;
  // toBeRemoved.forEach((element) => {
  //   this.allCheckedList = this.allCheckedList.filter(
  //     (obj) => obj !== element
  //   );
  // });
  // this.allCheckedList.forEach((element) => {
  //   if (element.AccNo == value.AccNo)
  //   toBeRemoved.push(value);
  // });

  // list.map((x) => {
  //   if (x.AccNo == value.AccNo) {
  //     toBeRemoved.push(value);
  //   } else {
  //     toBeAdded.push(value);
  //   }
  // });

  // toBeRemoved.forEach((element) => {
  //   this.allCheckedList = this.allCheckedList.filter(
  //     (obj) => obj !== element
  //   );
  // });

  // toBeAdded.forEach((element) => {
  //   this.allCheckedList.push(element);
  // });

  //console.log('This is the All checked Array :', this.allCheckedList);

  // this.allCheckedList = toBeAdded;

  // let toBeUpdated = [];
  // list.map((x) => {
  //   if (x.MenuNo == value.MenuNo) {
  //     x.IsAssigned = !x.IsAssigned;
  //   }
  //   toBeUpdated.push(x);
  // });
  // this.allMenuList = toBeUpdated;
  // };

  onChangeMemNo(event: any) {
    let IsOldCheck = this.MemberPersonnalLedgerForm.controls['IsOldMem'].value;
    console.log(IsOldCheck);
    let MemNoId = this.MemberPersonnalLedgerForm.controls['MemNo'].value;
    console.log(MemNoId);
    if (MemNoId) {
      this.spinner.show();
      this.loanInfoReportService
        .GetMemberDetails(IsOldCheck, MemNoId)
        .pipe(first())
        .subscribe(
          (x: any) => {
            this.spinner.hide();
            this.MemberDetailsList = x;
            // invalid memberno
            if (this.MemberDetailsList.MemberNo == 0) {
              alert('Invalid Member No!');
            }
            if (this.MemberDetailsList.MemberName) {
              this.MemberPersonnalLedgerForm.patchValue({
                //MemNo: this.MemberDetailsList.MemberNo,
                MemName: this.MemberDetailsList.MemberName,
              });
            }
            console.log(this.MemberDetailsList);
            console.log(this.MemberDetailsList.MemberName);
          },
          (err) => {
            this.spinner.hide();
          }
        );
    } else {
      this.MemberDetailsList = null;
    }

    //get table data
    this.getGetAccountInfoDetails();
    // make checklist null
    let temp2 = [];
    this.allCheckedList = temp2;
  }

  onMemNoEnterHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    this.onChangeMemNo(e);
    document.getElementById(`dateFormat`).focus();
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
    var fValue = this.MemberPersonnalLedgerForm.value;
    this.reportModel.Values = [];

    // this.reportModel.Values.push(
    //   new ReportKeyValue(
    //     'AccAtyClass',
    //     this.MemberDetailsListByOldAcNo.AccAtyClass
    //   )
    // );

    // logic for report names start

    // if (
    //   fValue.ShowPenalty &&
    //   this.MemberDetailsListByOldAcNo.AccAtyClass == '1'
    // ) {
    //   this.reportModel.ReportName = 'AccountStatementIntPenalty01';
    //   console.log(this.reportModel.ReportName);
    // } else if (
    //   fValue.ShowPenalty &&
    //   this.MemberDetailsListByOldAcNo.AccAtyClass == '2'
    // ) {
    //   this.reportModel.ReportName = 'AccountStatementIntPenalty02';
    //   console.log(this.reportModel.ReportName);
    // } else if (
    //   fValue.ShowPenalty &&
    //   this.MemberDetailsListByOldAcNo.AccAtyClass == '5'
    // ) {
    //   this.reportModel.ReportName = 'AccountStatementIntPenalty05';
    //   console.log(this.reportModel.ReportName);
    // } else if (
    //   fValue.ShowPenalty &&
    //   this.MemberDetailsListByOldAcNo.AccAtyClass == '6'
    // ) {
    //   this.reportModel.ReportName = 'AccountStatementIntPenalty06';
    //   console.log(this.reportModel.ReportName);
    // } else if (
    //   fValue.ShowPenalty &&
    //   this.MemberDetailsListByOldAcNo.AccAtyClass == '7'
    // ) {
    //   this.reportModel.ReportName = 'AccountStatementIntPenalty07';
    //   console.log(this.reportModel.ReportName);
    // } else {
    //   if (this.MemberDetailsListByOldAcNo.AccAtyClass == '1') {
    //     this.reportModel.ReportName = 'AccountStatement01';
    //     console.log(this.reportModel.ReportName);
    //   } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '2') {
    //     this.reportModel.ReportName = 'AccountStatement02';
    //     console.log(this.reportModel.ReportName);
    //   } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '3') {
    //     this.reportModel.ReportName = 'AccountStatement03';
    //     console.log(this.reportModel.ReportName);
    //   } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '4') {
    //     this.reportModel.ReportName = 'AccountStatement04';
    //     console.log(this.reportModel.ReportName);
    //   } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '5') {
    //     this.reportModel.ReportName = 'AccountStatement05';
    //     console.log(this.reportModel.ReportName);
    //   } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '6') {
    //     this.reportModel.ReportName = 'AccountStatement06';
    //     console.log(this.reportModel.ReportName);
    //   } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '7') {
    //     this.reportModel.ReportName = 'AccountStatement07';
    //     console.log(this.reportModel.ReportName);
    //   } else if (this.MemberDetailsListByOldAcNo.AccAtyClass == '8') {
    //     this.reportModel.ReportName = 'AccountStatement08';
    //     console.log(this.reportModel.ReportName);
    //   }
    // }

    //logic for report names end

    // this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));
    // this.reportModel.Values.push(new ReportKeyValue('OldAcNo', fValue.OldAcNo));
    this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));
    var mName = this.MemberDetailsList.MemberName;
    this.reportModel.Values.push(new ReportKeyValue('MemberDesc', mName));
    // this.reportModel.Values.push(new ReportKeyValue('AccNo', fValue.AccNo));
    this.reportModel.Values.push(
      new ReportKeyValue('IssueFromDate', this.storefDate)
    );
    this.reportModel.Values.push(
      new ReportKeyValue('IssueToDate', this.storetDate)
    );
    // this.reportModel.Values.push(
    //   new ReportKeyValue('IsActiveAcc', fValue.IsActiveAcc ? '1' : '0')
    // );
    this.reportModel.Values.push(
      new ReportKeyValue('WithCloseAc', fValue.WithCloseAc ? '1' : '0')
    );
    // this.reportModel.Values.push(
    //   new ReportKeyValue(
    //     'AccTypeDesc',
    //     this.getSelectedItemText(
    //       fValue.AccType,
    //       this.inputHelpData.accTransferAccountTypeList
    //     )
    //   )
    // );
    // this.reportModel.Values.push(new ReportKeyValue('AcStatus', fValue.Status));

    // logic for report names start
    // if ((this.allCheckedList = [])) {
    //   alert('Please select atleast one account!');
    //   return;
    // }

    if (this.allCheckedList.length == 0) {
      alert('Please select atleast one account!');
      return;
    } else {
      if (this.allCheckedList.length == 1) {
        // this.reportModel.ReportName = 'MemberPersonnalLedger1';
        this.reportModel.ReportName = 'rptCSMemberPersonnalLedger1';

        console.log(this.reportModel.ReportName);
        this.reportModel.Values.push(
          new ReportKeyValue('AccNoA', this.allCheckedList[0].AccNo)
        );
      } else if (this.allCheckedList.length == 2) {
        // this.reportModel.ReportName = 'MemberPersonnalLedger2';
        this.reportModel.ReportName = 'rptCSMemberPersonnalLedger2';

        console.log(this.reportModel.ReportName);
        this.reportModel.Values.push(
          new ReportKeyValue('AccNoA', this.allCheckedList[0].AccNo)
        );
        this.reportModel.Values.push(
          new ReportKeyValue('AccNoB', this.allCheckedList[1].AccNo)
        );
      } else if (this.allCheckedList.length == 3) {
        //this.reportModel.ReportName = 'MemberPersonnalLedger3';
        this.reportModel.ReportName = 'rptCSMemberPersonnalLedger3';

        console.log(this.reportModel.ReportName);
        this.reportModel.Values.push(
          new ReportKeyValue('AccNoA', this.allCheckedList[0].AccNo)
        );
        this.reportModel.Values.push(
          new ReportKeyValue('AccNoB', this.allCheckedList[1].AccNo)
        );
        this.reportModel.Values.push(
          new ReportKeyValue('AccNoC', this.allCheckedList[2].AccNo)
        );
      } else if (this.allCheckedList.length == 4) {
        this.reportModel.ReportName = 'rptCSMemberPersonnalLedger4';

        console.log(this.reportModel.ReportName);
        this.reportModel.Values.push(
          new ReportKeyValue('AccNoA', this.allCheckedList[0].AccNo)
        );
        this.reportModel.Values.push(
          new ReportKeyValue('AccNoB', this.allCheckedList[1].AccNo)
        );
        this.reportModel.Values.push(
          new ReportKeyValue('AccNoC', this.allCheckedList[2].AccNo)
        );
        this.reportModel.Values.push(
          new ReportKeyValue('AccNoD', this.allCheckedList[3].AccNo)
        );
      } else {
        alert('Please select less than 5 account!');
        return;
      }
    }
    // logic for report names end
  }

  public getReportToken = (type: any) => {
    if (this.MemberPersonnalLedgerForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }

    this.spinner.show();
    this.setParameter();

    // validation
    if (this.allCheckedList.length == 0) {
      this.spinner.hide();
      return;
    }

    if (this.allCheckedList.length == 5) {
      this.spinner.hide();
      return;
    }
    if (this.allCheckedList.length == 6) {
      this.spinner.hide();
      return;
    }
    // validation

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

  isActiveAccClick(e) {
    console.log(e);
    if (e) {
      this.chbIsActiveAccStatus = true;
      // this.IsActiveOrClosedText = 'Active A/c';
      this.getGetAccountInfoDetails();
      // make checklist null
      let temp2 = [];
      this.allCheckedList = temp2;

      // this.MemberPersonnalLedgerForm.patchValue({
      //   AccNo: '',
      //   Balance: '',
      //   Status: '',
      // });
    } else {
      this.chbIsActiveAccStatus = false;
      // this.IsActiveOrClosedText = 'Closed A/c';
      this.getGetAccountInfoDetails();
      // make checklist null
      let temp2 = [];
      this.allCheckedList = temp2;

      // this.MemberPersonnalLedgerForm.patchValue({
      //   AccNo: '',
      //   Balance: '',
      //   Status: '',
      // });
    }
  }

  // bindSelectedAccNo(event: any) {
  //   //console.log(event.target.value);
  //   //alert(event.target.value);
  //   this.AccountStatementForm.patchValue({
  //     AccNo: event.target.value,
  //   });
  //   this.bindUsingSelectedAccNo(event.target.value);
  // }

  // bindUsingSelectedAccNo(AcNoId: string) {
  //   let accType = this.AccountStatementForm.controls['AccType'].value;
  //   console.log(accType);
  //   // let AcNoId = this.AccountStatementForm.controls['AccNo'].value;
  //   console.log(AcNoId);
  //   let isActive = this.AccountStatementForm.controls['IsActiveAcc'].value
  //     ? '1'
  //     : '0';
  //   console.log(isActive);
  //   if (accType && AcNoId) {
  //     this.spinner.show();
  //     this.loanInfoReportService
  //       .GetMemberDetailsByAccNo(accType, AcNoId, isActive)
  //       .pipe(first())
  //       .subscribe(
  //         (x: any) => {
  //           this.spinner.hide();
  //           this.MemberDetailsListByOldAcNo = x;
  //           // invalid memberno
  //           if (this.MemberDetailsListByOldAcNo.MemNo == 0) {
  //             alert('Invalid Account Type or Account No!');
  //           }
  //           if (this.MemberDetailsListByOldAcNo.MemberName) {
  //             this.AccountStatementForm.patchValue({
  //               MemNo: this.MemberDetailsListByOldAcNo.MemNo,
  //               MemName: this.MemberDetailsListByOldAcNo.MemberName,
  //             });
  //           }

  //           if (this.MemberDetailsListByOldAcNo.AccNo) {
  //             this.AccountStatementForm.patchValue({
  //               AccNo: this.MemberDetailsListByOldAcNo.AccNo,
  //             });
  //           }

  //           if (this.MemberDetailsListByOldAcNo.AccOldNumber) {
  //             this.AccountStatementForm.patchValue({
  //               OldAcNo: this.MemberDetailsListByOldAcNo.AccOldNumber,
  //             });
  //           }

  //           if (this.MemberDetailsListByOldAcNo.AccBalance) {
  //             this.AccountStatementForm.patchValue({
  //               Balance: this.MemberDetailsListByOldAcNo.AccBalance,
  //             });
  //           }

  //           if (this.MemberDetailsListByOldAcNo.AccStatusDescription) {
  //             this.AccountStatementForm.patchValue({
  //               Status: this.MemberDetailsListByOldAcNo.AccStatusDescription,
  //             });
  //           }

  //           console.log(this.MemberDetailsListByOldAcNo);
  //           console.log(this.MemberDetailsListByOldAcNo.MemberName);
  //         },
  //         (err) => {
  //           this.spinner.hide();
  //         }
  //       );
  //   } else {
  //     this.MemberDetailsListByOldAcNo = null;
  //   }
  //   this.getGetAccountInfoDetails();
  // }

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
    var fv = this.MemberPersonnalLedgerForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.MemberPersonnalLedgerForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.MemberPersonnalLedgerForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.MemberPersonnalLedgerForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.MemberPersonnalLedgerForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.MemberPersonnalLedgerForm.value);
    console.log(this.storetDate);
  }
}
