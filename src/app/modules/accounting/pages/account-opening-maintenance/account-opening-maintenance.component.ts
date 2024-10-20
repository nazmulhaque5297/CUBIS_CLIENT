import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import {
  ReportCommonModel,
  ReportKeyValue,
} from 'src/app/Models/report-common.model';
import { AccountOpenService } from 'src/app/services/account-open.service';
import { ReportCommonService } from 'src/app/services/report-common.service';
import { environment } from 'src/environments/environment';
import {
  AccountOpenInputHelp,
  IAccountOpenCreate,
  IAccountOpenPeriodSlab,
  IAccountOpenViewModel,
} from '../../models/account-open.model';
import { AddNomineeComponent } from '../approve-member-application/auto-new-account-openning/add-nominee/add-nominee.component';

@Component({
  selector: 'app-account-opening-maintenance',
  templateUrl: './account-opening-maintenance.component.html',
  styleUrls: ['./account-opening-maintenance.component.css'],
})
export class AccountOpeningMaintenanceComponent implements OnInit, OnDestroy {
  accountOpenForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: AccountOpenInputHelp = new AccountOpenInputHelp();
  public accountViewModel: IAccountOpenViewModel = new IAccountOpenViewModel();
  private reportModel: ReportCommonModel = new ReportCommonModel();
  displayIFrame = false;
  MemType: any = '';
  AccTypeClass: number;
  showNomiBtn: boolean = false;
  public slabDetails: IAccountOpenPeriodSlab;
  openDate: string;

  printFlag: any;
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private pService: AccountOpenService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private aService: ReportCommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reportModel.ReportName = 'CCULB_rptCSNewAccountSlip';
    this.reportModel.Values = [];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelp();
    document.getElementById(`a/c_type`).focus();
  }

  ngOnDestroy(): void {
    this.pService
      .DeleteTempNomi()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
      });
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.accountOpenForm = this.fb.group({
      AccountTypeCode: new FormControl(''),
      AccountTypeId: new FormControl('0'),
      MemberNo: new FormControl(''),
      MemberName: new FormControl(''),
      OpenDate: new FormControl(''),
      DepositAmount: new FormControl(''),
      FixedDeposit: new FormControl(''),
      Period: new FormControl(''),
      InterestRate: new FormControl(''),
      MaturityDate: new FormControl(''),
      MaturityAmount: new FormControl(''),
      InterestBenefits: new FormControl(''),
      WithdrawalAccountTypeId: new FormControl('0'),
      InterestCalculationId: new FormControl('1'),
      AutoRenewalId: new FormControl('1'),
      SpecialInstruction: new FormControl(''),
      CorrAccountNo: new FormControl(''),
      CorrAccountDescriptipn: new FormControl(''),
      IsAutoTransCorrAccount: new FormControl(false),
      IsContractInt: new FormControl(false),
      OldAccountNo: new FormControl(''),
      SmsService: new FormControl('1'),
      ShareStatusId: new FormControl('0'),
    });
  }

  private getInputHelp(): void {
    this.spinner.show();
    this.pService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log('PrintData:', data);
        // this.printFlag = this.inputHelpData.PrintFlag;
        this.accountOpenForm.controls['OpenDate'].setValue(data.OpenDate);
        this.openDate = data.OpenDate;
        this.spinner.hide();
      });
  }

  // enter key events
  onEnterAccountTypeCodeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;

    document.getElementById(`MemberNo`).focus();
  }

  onMemberChange(value: number): void {
    this.spinner.show();
    var fValue = this.accountOpenForm.value;
    this.pService
      .GetDetailsByMember(
        fValue.MemberNo,
        this.accountViewModel.AccCorrType,
        this.accountViewModel.AccFlag,
        this.accountViewModel.AccountTypeId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        console.log('this is data', data);
        if (!data.Success) {
          alert(data.Message);
          this.accountOpenForm.controls['MemberNo'].setValue('');
          this.showNomiBtn = false;
        } else {
          this.accountOpenForm.controls['MemberName'].setValue(data.MemberName);
          this.accountOpenForm.controls['CorrAccountNo'].setValue(
            data.CorrAccountNo
          );
          this.accountOpenForm.controls['CorrAccountDescriptipn'].setValue(
            data.CorrAccountDescriptipn
          );
          this.MemType = data.MemType;
          document.getElementById(`dateFormat`).focus();
          this.showNomiBtn = true;
        }
      });
  }

  onAccountTypeChange(value: number): void {
    this.spinner.show();
    var item = new SelectListFilter().getItem(
      this.inputHelpData.AccountTypeList,
      value
    );
    this.accountOpenForm.controls['AccountTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.accountOpenForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    var fValue = this.accountOpenForm.value as IAccountOpenCreate;
    this.pService
      .OnAccountTypeChange(fValue.AccountTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.accountViewModel = data;
        setTimeout(() => {
          document.getElementById(`MemberNo`).focus();
        }, 100);
        this.AccTypeClass = this.accountViewModel.AccountClassId;
        setTimeout(() => {
          document.getElementById(`MemberNo`).focus();
        }, 100);
        this.accountOpenForm.controls['DepositAmount'].setValue(
          data.DepositAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })
        );
        if (!data.Success) {
          this.toaster.warning(data.Message);
          this.accountOpenForm.controls['AccountTypeId'].setValue(0);
          this.accountOpenForm.controls['AccountTypeCode'].setValue('');
          return;
        }
      });
  }
  OnOpenDateHandler() {
    if (this.accountViewModel.ShowDepositAmount) {
      document.getElementById(`DepositAmount`).focus();
    } else if (this.accountViewModel.ShowFixedDepositAmount) {
      document.getElementById(`FixedDeposit`).focus();
    } else if (
      !this.accountViewModel.ShowDepositAmount &&
      !this.accountViewModel.ShowFixedDepositAmount
    ) {
      document.getElementById(`Period`).focus();
    }
  }

  OnOpenDateEnterHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowDepositAmount) {
      document.getElementById(`DepositAmount`).focus();
    } else if (this.accountViewModel.ShowFixedDepositAmount) {
      document.getElementById(`FixedDeposit`).focus();
    } else if (
      !this.accountViewModel.ShowDepositAmount &&
      !this.accountViewModel.ShowFixedDepositAmount
    ) {
      document.getElementById(`Period`).focus();
    }
  }
  onCreate(): void {
    if (this.accountOpenForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    var fValue = this.accountOpenForm.value as IAccountOpenCreate;
    (fValue.OpenDate =
      typeof this.accountOpenForm.value.OpenDate == 'string'
        ? this.accountOpenForm.value.OpenDate
        : this.convertDateToString(this.accountOpenForm.value.OpenDate)),
      console.log(fValue);
    fValue.AccTypeClass = this.AccTypeClass;
    fValue.SlabDetails = this.slabDetails;
    fValue.AccCorrType = this.accountViewModel.AccCorrType;
    this.spinner.show();
    this.pService
      .Submit(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (data.Success) {
          if (this.inputHelpData.PrintFlag == 1) {
            this.getReportToken(data.AccNo);
            return;
          }
          alert(data.Message);
          location.reload();
        } else {
          alert(data.Message);
        }
      });

    console.log('this.printFlag', this.printFlag);
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\, ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  CorrAccChangeHandler = (e) => {
    var fValue = this.accountOpenForm.value as IAccountOpenCreate;
    if (!fValue.MemberNo) {
      alert('Please Input Member No!');
      return;
    }
    this.pService
      .GetCorrAccDetailsAccountNo(
        +fValue.MemberNo,
        +this.MemType,
        e.target.value
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.accountOpenForm.controls['CorrAccountNo'].setValue('');
          this.accountOpenForm.controls['CorrAccountDescriptipn'].setValue('');
        }
        this.accountOpenForm.controls['CorrAccountNo'].setValue(
          data.CorrAccountNo
        );
        this.accountOpenForm.controls['CorrAccountDescriptipn'].setValue(
          data.CorrAccountDescriptipn
        );
      });
  };

  changeDepositAmountHandler = (e) => {
    console.log(
      'This is AccountClassId ',
      this.accountViewModel.AccountClassId
    );
    if (this.accountViewModel.AccountClassId == 1) {
      let DepositValidationData = {
        AccTypeClass: this.accountViewModel.AccountClassId,
        MinDepositAmt: this.accountViewModel.MinDepositAmt,
        DepositAmount: e.target.value,
        Period: this.accountOpenForm.value.Period ?? 0,
        MemType: this.MemType,
        AccountTypeId: this.accountViewModel.AccountTypeId,
      };
      this.spinner.show();
      this.pService
        .OnDepositAmountChange(DepositValidationData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          console.log('This is data after amount change ', data);
          this.spinner.hide();
        });
    } else if (this.accountViewModel.AccountClassId != 1) {
      let DepositValidationData = {
        AccTypeClass: this.accountViewModel.AccountClassId,
        MinDepositAmt: this.accountViewModel.MinDepositAmt,
        DepositAmount: e.target.value,
        Period: this.accountOpenForm.value.Period ?? 0,
        MemType: this.MemType,
        AccountTypeId: this.accountViewModel.AccountTypeId,
        OpenDate: this.accountOpenForm.value.OpenDate,
      };
      this.spinner.show();
      this.pService
        .OnDepositAmountChange(DepositValidationData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          console.log('This is data after amount change ', data);

          this.spinner.hide();
          if (!data.Success) {
            alert(data.Message);
            this.accountOpenForm.controls['DepositAmount'].setValue('');
            return;
          }
          this.accountOpenForm.controls['MaturityDate'].setValue(
            data.MaturityDate
          );
          this.accountOpenForm.controls['InterestRate'].setValue(
            data.InterestRate
          );
          this.accountOpenForm.controls['MaturityAmount'].setValue(
            data.MaturedAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.accountOpenForm.controls['Period'].setValue(data.Period);
          this.accountOpenForm.controls['DepositAmount'].setValue(
            data.DepositAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
        });
    }
    // if(this.accountViewModel.ShowWithdrawalAC){
    //   document.getElementById(`withdrawal`).focus();
    // }
  };
  changeDepositAmountEnterHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    // setTimeout(() => {
    //   this.accountOpenForm.controls['DepositAmount'].setValue(
    //     this.accountOpenForm.value.DepositAmount.toLocaleString('en-US', {
    //       minimumFractionDigits: 2,
    //     })
    //   );
    // }, 1000);
    // this.accountOpenForm.controls['DepositAmount'].setValue(
    //   this.accountOpenForm.value.DepositAmount.toLocaleString('en-US', {
    //     minimumFractionDigits: 2,
    //   })
    // );
    if (this.accountViewModel.ShowWithdrawalAC) {
      document.getElementById(`withdrawal`).focus();
    } else if (this.accountViewModel.ShowPeriod) {
      document.getElementById(`Period`).focus();
    }
  }
  changePeriodEnterHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowInterestRate) {
      document.getElementById(`interestRate`).focus();
    } else if (this.accountViewModel.ShowFixedMthInt) {
      document.getElementById(`InterestBenefits`).focus();
    }else{
      document.getElementById(`AutoRenewalId`).focus();
    }
  }
  onWithdrawalEnterEvent() {
    if (this.accountViewModel.ShowInterestCalculation) {
      document.getElementById(`InterestCalculationId`).focus();
    }
  }
  onInterestEnterEvent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowSpInstruction) {
      document.getElementById(`SpecialInstruction`).focus();
    } else if (this.accountViewModel.ShowCorrAccount) {
      document.getElementById(`corrAccount`).focus();
    }
  }
  onSpecialInsEnterEvent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowCorrAccount) {
      document.getElementById(`corrAccount`).focus();
    }
  }
  onCorrAccEnterEvent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowAutoTrfCorrAcc) {
      document.getElementById(`autotrf`).focus();
    } else if (this.accountViewModel.ShowOldAccNo) {
      document.getElementById(`oldaccno`).focus();
    }
  }

  autotrafEnterEvent(e: KeyboardEvent) {
    if (this.accountViewModel.ShowOldAccNo) {
      document.getElementById(`oldaccno`).focus();
    }
  }
  smsserviceEnterEvent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowShareStatus) {
      document.getElementById(`shareStatus`).focus();
    } else if (!this.accountViewModel.ShowShareStatus) {
      document.getElementById(`submit`).focus();
    }
  }
  shareStatusevent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowShareStatus) {
      document.getElementById(`submit`).focus();
    }
  }

  onOldAccEvent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowSMSService) {
      document.getElementById(`smsService`).focus();
    }else{
      document.getElementById(`submit`).focus();
    }
  }
  changeIntRtEvent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowMatrutiyAmount) {
      document.getElementById(`MaturityAmount`).focus();
    } else if (this.accountViewModel.ShowAutoRenewal) {
      document.getElementById(`AutoRenewalId`).focus();
    }
  }
  renewalEvent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowContraInt) {
      document.getElementById(`contractInt`).focus();
    } else if (this.accountViewModel.ShowCorrAccount) {
      document.getElementById(`corrAccount`).focus();
    }
  }
  contrintevent(e: KeyboardEvent) {
    if (this.accountViewModel.ShowCorrAccount) {
      document.getElementById(`corrAccount`).focus();
    }
  }

  maturityAmountchange(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowInterestCalculation) {
      document.getElementById(`InterestCalculationId`).focus();
    }else{
      document.getElementById(`corrAccount`).focus();
    }
  }
  fixeddepositevent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowPeriod) {
      document.getElementById(`Period`).focus();
    }
  }

  intbenifitevent(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (this.accountViewModel.ShowContraInt) {
      document.getElementById(`contractInt`).focus();
    }
  }

  changeFixedDepositAmountHandler = (e) => {
    // let DepositValidationData = {
    //   AccTypeClass: this.accountViewModel.AccountClassId,
    //   MinDepositAmt: this.accountViewModel.MinDepositAmt,
    //   DepositAmount: e.target.value,
    //   Period: this.accountOpenForm.value.Period ?? 0,
    //   MemType: this.MemType,
    //   AccountTypeId: this.accountViewModel.AccountTypeId,
    // }
    // this.spinner.show();
    // console.log('=====send data', DepositValidationData )
    // this.pService.OnDepositAmountChange(DepositValidationData).pipe(takeUntil(this.destroy$)).subscribe(data => {
    //   this.spinner.hide();
    //   console.log('=========res data',data)
    // });
  };
  convertDateToString(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('/');
  }

  changePeriodHandler = (e) => {
    if (!this.accountOpenForm.value.Period) {
      return;
    }
    let PeriodValidationData = {
      AccTypeClass: this.accountViewModel.AccountClassId,
      DepositAmount: this.accountOpenForm.value.DepositAmount,
      FixedDeposit: this.accountOpenForm.value.FixedDeposit,
      Period: this.accountOpenForm.value.Period ?? 0,
      OpenDate:
        typeof this.accountOpenForm.value.OpenDate == 'string'
          ? this.accountOpenForm.value.OpenDate
          : this.convertDateToString(this.accountOpenForm.value.OpenDate),
      MemType: this.MemType,
      AccountTypeId: this.accountViewModel.AccountTypeId,
      BenefitBy: this.accountViewModel.BenefitBy,
      BenefitWBy: this.accountViewModel.BenefitWBy,
    };
    this.spinner.show();
    console.log('=====send data', PeriodValidationData);
    this.pService
      .OnPeriodChange(PeriodValidationData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.slabDetails = data;
        if (data.Success) {
          console.log('data', data);
          this.accountOpenForm.controls['InterestBenefits'].setValue(
            data.InterestBenefits
          );
          this.accountOpenForm.controls['MaturityDate'].setValue(
            data.MaturityDate
          );
          this.accountOpenForm.controls['InterestRate'].setValue(
            data.InterestRate.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
          this.accountOpenForm.controls['MaturityAmount'].setValue(
            data.MaturedAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          );
        } else {
          alert(data.Message);
          this.accountOpenForm.controls['Period'].setValue('');
        }
      });
  };

  callNomineeModal(event: any) {
    this.pService
      .DeleteTempNomi()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
      });
    this.pService.checkTemp = true;
    this.pService.MemNo = this.accountOpenForm.value.MemberNo;
    this.pService.AccNo = '0';
    this.pService.MemType = this.MemType;
    this.pService.AccType = this.accountOpenForm.value.AccountTypeCode;

    const modalRef = this.modalService.open(AddNomineeComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'my-modal',
    });
  }

  public getReportToken(data: any) {
    this.spinner.show();
    this.setParameter(data);
    this.displayIFrame = true;
    console.log(this.reportModel);
    this.aService
      .getReportToken(this.reportModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (x) => {
          this.setIframe(x);
          this.spinner.hide();
          location.reload();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  private setParameter(data): void {
    var fValue = this.accountOpenForm.value;
    this.reportModel.Values = [];
    this.reportModel.ReportName = 'CCULB_rptCSNewAccountSlip';
    console.log('this is my data', data);
    this.reportModel.Values.push(
      new ReportKeyValue('memberNo', fValue.MemberNo)
    );

    this.reportModel.Values.push(
      new ReportKeyValue('memberName', fValue.MemberName)
    );
    this.reportModel.Values.push(new ReportKeyValue('accNo', data));
    console.log(this.reportModel.Values);
  }

  private setIframe = (x: any) => {
    var iFramePath = environment.reportUrl + 'id=' + x.id + '&token=' + x.token;

    window.open(iFramePath, '_blank');
  };
}
