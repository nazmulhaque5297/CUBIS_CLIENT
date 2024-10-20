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
  AccClassDetails,
} from 'src/app/Models/loanreceived-report.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IdDescription } from 'src/app/interfaces/id-description';
import { LoanInfoReportService } from 'src/app/services/loan-info-report.service';
import { MemberDetailsCode } from 'src/app/interfaces/loan-info-report';
import { UserModule, UserInfo } from 'src/app/Models/Common.model';

@Component({
  selector: 'app-received-payment-register-byid-report',
  templateUrl: './received-payment-register-byid-report.component.html',
  styleUrls: ['./received-payment-register-byid-report.component.css'],
})
export class ReceivedPaymentRegisterByidReportComponent
  implements OnInit, OnDestroy {
  public inputHelpData: LoanReceivedReportInputHelp = new LoanReceivedReportInputHelp();
  UserData: UserInfo;
  public accTypeClassData: AccClassDetails = new AccClassDetails();
  private destroy$: Subject<void> = new Subject<void>();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  public MemberDetailsList: MemberDetailsCode = new MemberDetailsCode();
  iFrameUrl: SafeResourceUrl;
  displayIFrame = false;
  storefDate:any;
  storetDate:any;

  // chbIsAllMemberStatus: any;

  // chbIsAllAccTypeStatus: any;
  chbIsAllTellerStatus: any;
  chbIsAllBranchStatus: any;
  // IsAccTypeDisabled: any;
  IsTellerDisabled: any;
  IsBranchDisabled: any;
  IsTrnDisabled: any;
  //chbShowZeroBalance: any;

  chbIsAllTrnStatus: any;

  ShowWhenUserlvl40: any;
  ShowWhenUserlvlNot40: any;

  ReceivedPaymentRegisterByUnitForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private loanReceivedReportService: LoanReceivedReportService,
    private aService: ReportCommonService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private loanInfoReportService: LoanInfoReportService
  ) {
    // this.reportModel.ReportName = 'ReceivedPaymentRegisterById01';
    //this.reportModel.ReportName = 'ReceivedPaymentRegisterById02';
    this.reportModel.ReportName = 'rptMGLReceivedPaymentRegisterById02';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultOptions();
    this.getUserDetails();
  }

  private initializeForm() {
    this.MemberDetailsList = null;

    //  this.chbIsAllMemberStatus = true;
    // this.chbIsAllAccTypeStatus = true;
    this.chbIsAllTellerStatus = true;
    this.chbIsAllBranchStatus = true;
    this.chbIsAllTrnStatus = true;
    //this.IsAccTypeDisabled = true;
    this.IsTellerDisabled = true;
    this.IsBranchDisabled = true;
    this.IsTrnDisabled = true;
    // this.chbShowZeroBalance = false;
    this.ShowWhenUserlvl40 = false;
    this.ShowWhenUserlvlNot40 = true;

    this.ReceivedPaymentRegisterByUnitForm = new FormGroup({
      // IsAllAccType: new FormControl('true'),
      IsAllTeller: new FormControl('true'),
      IsAllBranch: new FormControl('true'),
      IsAllTrn: new FormControl('true'),

      //  IsOldMem: new FormControl(false),
      // AccTypeCode: new FormControl(''),
      TellerCode: new FormControl(''),
      BranchCode: new FormControl(''),
      TrnCode: new FormControl(''),
      //  AccType: new FormControl('0'),
      Teller: new FormControl('0'),
      Branch: new FormControl('0'),
      Trn: new FormControl('0'),
      IssueFromDate: new FormControl(''),
      IssueToDate: new FormControl(''),
      rbConsolidated: new FormControl('0'),
      rbOptConsolidated: new FormControl('1'),

      //  IsAllMember: new FormControl('true'),
      //  MemNo: new FormControl(''),
      // MemName: new FormControl(''),

      // ShowZeroBalance: new FormControl('False'),
      // IssueFromDate: new FormControl(''),
      // IssueToDate: new FormControl(''),

      //AccStatus: new FormControl('1'),
    });
  }
  private getUserDetails(): void {
    this.spinner.show();

    this.loanReceivedReportService
      .getUserInformation()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.UserData = data;
        console.log("All User Info:",this.UserData);

        // test for lvl40 user START
        // this.UserData.IdsFlag = 40;
        // test for lvl40 user END

        if (this.UserData.IdsFlag != 40) {
          this.ShowWhenUserlvl40 = false;
          this.ShowWhenUserlvlNot40 = true;
        } else {
          this.ShowWhenUserlvl40 = true;
          this.ShowWhenUserlvlNot40 = false;
        }

        this.spinner.hide();
      });
  }
  private setDefaultOptions(): void {
    this.spinner.show();
    this.loanReceivedReportService
      .getInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log("All Imp Data:",this.inputHelpData);
        this.ReceivedPaymentRegisterByUnitForm.controls[
          'IssueFromDate'
        ].setValue(data.ApplicationDate);
        this.ReceivedPaymentRegisterByUnitForm.controls['IssueToDate'].setValue(
          data.ApplicationDate
        );
        this.storefDate = data.ApplicationDate;
        this.storetDate = data.ApplicationDate;
        this.spinner.hide();
      });
  }

  // checkIsAllMemberValue(e) {
  //   console.log(e);
  //   if (e) {
  //     this.chbIsAllMemberStatus = true;
  //     this.MemberDetailsList = null;
  //     this.LoanTimeAllotmentForm.controls['MemNo'].setValue('');
  //     this.LoanTimeAllotmentForm.controls['MemName'].setValue('');
  //   } else {
  //     this.chbIsAllMemberStatus = false;
  //   }
  // }

  // onChangeMemNo(event: any) {
  //   let IsOldCheck = this.MemberNomineeStatementForm.controls['IsOldMem'].value;
  //   console.log(IsOldCheck);
  //   let MemNoId = this.MemberNomineeStatementForm.controls['MemNo'].value;
  //   console.log(MemNoId);
  //   if (MemNoId) {
  //     this.spinner.show();
  //     this.loanInfoReportService
  //       .GetMemberDetails(IsOldCheck, MemNoId)
  //       .pipe(first())
  //       .subscribe(
  //         (x: any) => {
  //           this.spinner.hide();
  //           this.MemberDetailsList = x;
  //           // invalid memberno
  //           if (this.MemberDetailsList.MemberNo == 0) {
  //             this.toastr.error('Invalid Member No!', 'Error');
  //           }
  //           if (this.MemberDetailsList.MemberName) {
  //             this.MemberNomineeStatementForm.patchValue({
  //               //MemNo: this.MemberDetailsList.MemberNo,
  //               MemName: this.MemberDetailsList.MemberName,
  //             });
  //           }
  //           console.log(this.MemberDetailsList);
  //           console.log(this.MemberDetailsList.MemberName);
  //         },
  //         (err) => {
  //           this.spinner.hide();
  //         }
  //       );
  //   } else {
  //     this.MemberDetailsList = null;
  //   }
  // }

  public getSelectedItemText(value: any, collection: IdDescription[]): string {
    let selected = collection.find((x) => x.Id == value);
    return selected.Description;
  }

  onChangeTellerCode(event: any) {
    let TellerCodeId = this.ReceivedPaymentRegisterByUnitForm.controls[
      'TellerCode'
    ].value;
    console.log(TellerCodeId);
    if (TellerCodeId) {
      this.ReceivedPaymentRegisterByUnitForm.patchValue({
        Teller: this.getSelectedItemIDTeller(
          TellerCodeId,
          this.inputHelpData.cashDisbTellerList
        ),
      });
      // start get acctype class
      // this.spinner.show();
      // this.loanReceivedReportService
      //   .getAccTypeClassDetails(AccTypeCodeId)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe((data) => {
      //     this.accTypeClassData = data;
      //     console.log(this.accTypeClassData);

      //     if (this.accTypeClassData.AccTypeClass == 6) {
      //       this.reportModel.ReportName = 'LoanExpiryDate06';
      //     } else {
      //       this.reportModel.ReportName = 'LoanExpiryDate';
      //     }

      //     this.spinner.hide();

      //     (err) => {
      //       this.spinner.hide();
      //     };
      //   });
      //end get acctype class
    }
  }

  onChangeBranchCode(event: any) {
    let BranchCodeId = this.ReceivedPaymentRegisterByUnitForm.controls[
      'BranchCode'
    ].value;
    console.log(BranchCodeId);
    if (BranchCodeId) {
      this.ReceivedPaymentRegisterByUnitForm.patchValue({
        Branch: this.getSelectedItemIDBranch(
          BranchCodeId,
          this.inputHelpData.branchList
        ),
      });
    }
  }

  onChangeTrnCode(event: any) {
    let TrnCodeId = this.ReceivedPaymentRegisterByUnitForm.controls['TrnCode']
      .value;
    console.log(TrnCodeId);
    if (TrnCodeId) {
      this.ReceivedPaymentRegisterByUnitForm.patchValue({
        Trn: this.getSelectedItemIDTrn(
          TrnCodeId,
          this.inputHelpData.recAndPayRegTrnTypeList
        ),
      });
    }
  }

  public getSelectedItemIDTeller(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      this.toastr.error('Invalid User ID!', 'Error');
      this.ReceivedPaymentRegisterByUnitForm.patchValue({
        Teller: 0,
        TellerCode: '',
      });
    }
    return selected.Id;
  }

  public getSelectedItemIDBranch(
    value: any,
    collection: IdDescription[]
  ): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      this.toastr.error('Invalid Unit ID!', 'Error');
      this.ReceivedPaymentRegisterByUnitForm.patchValue({
        Branch: 0,
        BranchCode: '',
      });
    }
    return selected.Id;
  }

  public getSelectedItemIDTrn(value: any, collection: IdDescription[]): number {
    let selected = collection.find((x) => x.Id == value);
    if (selected != undefined) {
      return selected.Id;
    } else {
      this.toastr.error('Invalid Trn Type!', 'Error');
      this.ReceivedPaymentRegisterByUnitForm.patchValue({
        Trn: 0,
        TrnCode: '',
      });
    }
    return selected.Id;
  }

  onChangeTeller(event: any) {
    let TellerId = this.ReceivedPaymentRegisterByUnitForm.controls['Teller']
      .value;
    console.log(TellerId);
    if (TellerId) {
      this.ReceivedPaymentRegisterByUnitForm.patchValue({
        TellerCode: TellerId,
      });
      //start get acc type class
      // this.spinner.show();
      // this.loanReceivedReportService
      //   .getAccTypeClassDetails(AccTypeId)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe((data) => {
      //     this.accTypeClassData = data;
      //     console.log(this.accTypeClassData);

      //     if (this.accTypeClassData.AccTypeClass == 6) {
      //       this.reportModel.ReportName = 'LoanExpiryDate06';
      //     } else {
      //       this.reportModel.ReportName = 'LoanExpiryDate';
      //     }

      //     this.spinner.hide();

      //     (err) => {
      //       this.spinner.hide();
      //     };
      //   });
      //end get acc type class
    }
  }

  onChangeBranch(event: any) {
    let BranchId = this.ReceivedPaymentRegisterByUnitForm.controls['Branch']
      .value;
    console.log(BranchId);
    if (BranchId) {
      this.ReceivedPaymentRegisterByUnitForm.patchValue({
        BranchCode: BranchId,
      });
    }
  }

  onChangeTrn(event: any) {
    let TrnId = this.ReceivedPaymentRegisterByUnitForm.controls['Trn'].value;
    console.log(TrnId);
    if (TrnId) {
      this.ReceivedPaymentRegisterByUnitForm.patchValue({
        TrnCode: TrnId,
      });
    }
  }

  checkIsAllTellerValue(e) {
    console.log(e);
    if (e) {
      // this.chbIsAllAccTypeStatus = true;
      this.chbIsAllTellerStatus = true;
      //  this.IsAccTypeDisabled = true;
      this.IsTellerDisabled = true;
      this.ReceivedPaymentRegisterByUnitForm.controls['Teller'].setValue('0');
      this.ReceivedPaymentRegisterByUnitForm.controls['TellerCode'].setValue(
        ''
      );
    } else {
      // this.chbIsAllAccTypeStatus = false;
      this.chbIsAllTellerStatus = false;
      this.ReceivedPaymentRegisterByUnitForm.get('Teller').enable();
    }
  }

  checkIsAllBranchValue(e) {
    console.log(e);
    if (e) {
      // this.chbIsAllAccTypeStatus = true;
      this.chbIsAllBranchStatus = true;
      //  this.IsAccTypeDisabled = true;
      this.IsBranchDisabled = true;
      this.ReceivedPaymentRegisterByUnitForm.controls['Branch'].setValue('0');
      this.ReceivedPaymentRegisterByUnitForm.controls['BranchCode'].setValue(
        ''
      );
    } else {
      // this.chbIsAllAccTypeStatus = false;
      this.chbIsAllBranchStatus = false;
      this.ReceivedPaymentRegisterByUnitForm.get('Branch').enable();
    }
  }

  checkIsAllTrnValue(e) {
    console.log(e);
    if (e) {
      // this.chbIsAllAccTypeStatus = true;
      this.chbIsAllTrnStatus = true;
      //  this.IsAccTypeDisabled = true;
      this.IsTrnDisabled = true;
      this.ReceivedPaymentRegisterByUnitForm.controls['Trn'].setValue('0');
      this.ReceivedPaymentRegisterByUnitForm.controls['TrnCode'].setValue('');
    } else {
      // this.chbIsAllAccTypeStatus = false;
      this.chbIsAllTrnStatus = false;
      this.ReceivedPaymentRegisterByUnitForm.get('Trn').enable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setParameter(): void {
    var fValue = this.ReceivedPaymentRegisterByUnitForm.value;
    this.reportModel.Values = [];

    if (this.UserData.IdsFlag != 40) {
      // report Name
      if (fValue.rbConsolidated === '0' || fValue.rbOptConsolidated=='0') {
        this.reportModel.ReportName = 'rptMGLReceivedPaymentRegisterById02';
      } else if(fValue.rbConsolidated === '1' ) {
        this.reportModel.ReportName = 'rptMGLReceivedPaymentRegisterById01';
      }
      else if(fValue.rbOptConsolidated=='1')
      {
        this.reportModel.ReportName = 'rptMGLReceivedPaymentRegisterByUnit';
      }
      // report Name
      // common for all user lvls start
      this.reportModel.Values.push(new ReportKeyValue('Teller', fValue.Teller));
      this.reportModel.Values.push(new ReportKeyValue('Trn', fValue.Trn));
      this.reportModel.Values.push(
        new ReportKeyValue('IssueFromDate', this.storefDate)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('IssueToDate', fValue.IssueToDate)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('ReportButton', fValue.rbConsolidated)
      );

      this.reportModel.Values.push(
        new ReportKeyValue('ReportButtonHide', fValue.rbOptConsolidated)
      );
      
      

      // this.reportModel.Values.push(
      //   new ReportKeyValue('rbConsolidated', fValue.rbConsolidated)
      // );

      //start Teller
      if (this.chbIsAllTellerStatus) {
        this.reportModel.Values.push(
          new ReportKeyValue('TellerDesc', 'All Teller')
        );
      } else {
        this.reportModel.Values.push(
          new ReportKeyValue(
            'TellerDesc',
            this.getSelectedItemText(
              fValue.Teller,
              this.inputHelpData.cashDisbTellerList
            )
          )
        );
      }
      // end Teller

      //start Trn
      if (this.chbIsAllTrnStatus) {
        this.reportModel.Values.push(
          new ReportKeyValue('TrnDesc', 'All Trn.Type')
        );
      } else {
        this.reportModel.Values.push(
          new ReportKeyValue(
            'TrnDesc',
            this.getSelectedItemText(
              fValue.Trn,
              this.inputHelpData.recAndPayRegTrnTypeList
            )
          )
        );
      }
      // end Trn
      // common for all user lvls end
    } else {
      // report Name
      if (fValue.rbOptConsolidated === '1') {
        this.reportModel.ReportName = 'ReceivedPaymentRegisterById02';
      } else {
        this.reportModel.ReportName = 'ReceivedPaymentRegisterByUnit';
      }
      // report Name

      // common for all user lvls start
      this.reportModel.Values.push(new ReportKeyValue('Teller', fValue.Teller));
      this.reportModel.Values.push(new ReportKeyValue('Trn', fValue.Trn));
      this.reportModel.Values.push(
        new ReportKeyValue('IssueFromDate', this.storefDate)
      );
      this.reportModel.Values.push(
        new ReportKeyValue('IssueToDate', this.storetDate)
      );
      //start Teller
      if (this.chbIsAllTellerStatus) {
        this.reportModel.Values.push(
          new ReportKeyValue('TellerDesc', 'All Teller')
        );
      } else {
        this.reportModel.Values.push(
          new ReportKeyValue(
            'TellerDesc',
            this.getSelectedItemText(
              fValue.Teller,
              this.inputHelpData.cashDisbTellerList
            )
          )
        );
      }
      // end Teller

      //start Trn
      if (this.chbIsAllTrnStatus) {
        this.reportModel.Values.push(
          new ReportKeyValue('TrnDesc', 'All Trn.Type')
        );
      } else {
        this.reportModel.Values.push(
          new ReportKeyValue(
            'TrnDesc',
            this.getSelectedItemText(
              fValue.Trn,
              this.inputHelpData.recAndPayRegTrnTypeList
            )
          )
        );
      }
      // end Trn
      // common for all user lvls end

      this.reportModel.Values.push(new ReportKeyValue('Branch', fValue.Branch));
      //start Branch
      if (this.chbIsAllBranchStatus) {
        this.reportModel.Values.push(
          new ReportKeyValue('BranchDesc', 'All Branch')
        );
      } else {
        this.reportModel.Values.push(
          new ReportKeyValue(
            'BranchDesc',
            this.getSelectedItemText(
              fValue.Branch,
              this.inputHelpData.branchList
            )
          )
        );
      }
      // end Branch
    }

    // this.reportModel.Values.push(new ReportKeyValue('MemNo', fValue.MemNo));
    //start Member
    // if (this.chbIsAllMemberStatus) {
    //   this.reportModel.Values.push(
    //     new ReportKeyValue('MemberDesc', 'All Member')
    //   );
    // } else {
    // var mName = this.MemberDetailsList.MemberName;
    // this.reportModel.Values.push(new ReportKeyValue('MemberDesc', mName));
    //  }
    // end Member

    // this.reportModel.Values.push(
    //   new ReportKeyValue('ExpiryDate', fValue.ExpiryDate)
    // );
    //  this.reportModel.Values.push(new ReportKeyValue('AccType', fValue.AccType));
    // this.reportModel.Values.push(
    //   new ReportKeyValue('ShowZeroBalance', fValue.ShowZeroBalance ? '1' : '0')
    // );
  }

  public getReportToken = (type:any) => {
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

    window.open(iFramePath,"_blank");
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
  applicationDateChange() {
    var fv = this.ReceivedPaymentRegisterByUnitForm.value;
    var value = this.datepipe.transform(fv.IssueFromDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.ReceivedPaymentRegisterByUnitForm.value.IssueFromDate = formatedValue;
    this.storefDate = formatedValue;
    console.log(this.ReceivedPaymentRegisterByUnitForm.value);
    console.log(this.storefDate);
  }
  applicationDateChange2() {
    var fv = this.ReceivedPaymentRegisterByUnitForm.value;
    var value = this.datepipe.transform(fv.IssueToDate, 'dd-MM-yyyy');
    var formatedValue = this.aService.convertDateToString(value);
    this.ReceivedPaymentRegisterByUnitForm.value.IssueToDate = formatedValue;
    this.storetDate = formatedValue;
    console.log(this.ReceivedPaymentRegisterByUnitForm.value);
    console.log(this.storetDate);
  }
}
