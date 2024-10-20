import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { AccountOpenService } from 'src/app/services/account-open.service';
import {
  AccountOpenInputHelp,
  IAccountOpenCreate,
  IAccountOpenPeriodSlab,
  IAccountOpenViewModel,
} from '../../models/account-open.model';
import { AddNomineeComponent } from '../approve-member-application/auto-new-account-openning/add-nominee/add-nominee.component';

@Component({
  selector: 'app-account-edit-maintenance',
  templateUrl: './account-edit-maintenance.component.html',
  styleUrls: ['./account-edit-maintenance.component.css'],
})
export class AccountEditMaintenanceComponent implements OnInit {
  openDate: string;
  bsValue = new Date();
  maxDate = new Date();
  accountEditForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public inputHelpData: AccountOpenInputHelp = new AccountOpenInputHelp();
  public accountViewModel: IAccountOpenViewModel = new IAccountOpenViewModel();
  MemType: any = '';
  public slabDetails: IAccountOpenPeriodSlab;
  showNomiBtn: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private pService: AccountOpenService,
    private spinner: NgxSpinnerService
  ) {
    this.maxDate.setDate(this.maxDate.getDate());
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getInputHelp();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.accountEditForm = this.fb.group({
      AccountTypeCode: new FormControl(''),
      AccountTypeId: new FormControl('0'),
      MemberNo: new FormControl(''),
      MemberName: new FormControl(''),
      AccountNo: new FormControl(''),
      Status: new FormControl(''),
      OpenDate: new FormControl(''),
      AccBalance: new FormControl(''),
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
      CorrAccountTitle: new FormControl(''),
      IsAutoTransCorrAccount: new FormControl(false),
      IsContractInt: new FormControl(false),
      OldAccountNo: new FormControl(''),
      SmsService: new FormControl('1'),
      ShareStatusId: new FormControl('0'),
      OriginalAmount: new FormControl(''),
      PrincipalAmount: new FormControl(''),
      AnniversaryDate: new FormControl(''),
      LastRenewalDate: new FormControl(''),
      RenewalAmount: new FormControl(''),
      BenefitsDate: new FormControl(''),
      NoOfBenefit: new FormControl(''),
    });
  }

  private getInputHelp(): void {
    this.spinner.show();
    this.pService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        this.spinner.hide();
      });
  }
  dateChecker() {
    var opDate = this.inputHelpData.OpenDate;
    var arrOpDate = opDate.split('/');
    var fOpDate = arrOpDate[2] + '-' + arrOpDate[1] + '-' + arrOpDate[0];
    var arrPros = new Date(fOpDate);

    var value = this.accountEditForm.value.OpenDate;
    var valueSplit = value.split('/');
    var valueConcat = valueSplit[2] + '-' + valueSplit[1] + '-' + valueSplit[0];

    var finalValue = new Date(valueConcat);
    console.log('initial value', value);
    console.log('final value', finalValue);

    if (finalValue > arrPros) {
      alert('Date cannot be Greater than Process date');
      this.accountEditForm.value.OpenDate = this.openDate;
      this.accountEditForm.controls['OpenDate'].setValue(this.openDate);
    }
  }

  onMemberChange(value: number): void {
    this.spinner.show();
    var fValue = this.accountEditForm.value;
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
        this.accountEditForm.controls['MemberName'].setValue(data.MemberName);
        this.MemType = data.MemType;
        if (!data.Success) {
          alert(data.Message);
        }
        setTimeout(() => {
          document.getElementById(`AccountTypeCode`).focus();
        }, 100);
      });
  }

  SetEditDetails(data) {
    this.accountEditForm.controls['OpenDate'].setValue(data.OpenDate);
    console.log(
      'This is open date control value after set>>',
      this.accountEditForm.controls['OpenDate']
    );
    this.openDate = data.OpenDate;
    this.accountEditForm.controls['AccBalance'].setValue(
      data.AccBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
    this.accountEditForm.controls['AnniversaryDate'].setValue(
      data.AnniversaryDate
    );
    this.accountEditForm.controls['LastRenewalDate'].setValue(
      data.LastRenewalDate
    );
    this.accountEditForm.controls['DepositAmount'].setValue(data.DepositAmount);
    this.accountEditForm.controls['AccountNo'].setValue(data.AccountNo);
    this.accountEditForm.controls['Status'].setValue(data.Status);
    this.accountEditForm.controls['Period'].setValue(data.Period);
    this.accountEditForm.controls['CorrAccountNo'].setValue(data.CorrAccountNo);
    this.accountEditForm.controls['CorrAccountTitle'].setValue(
      data.CorrAccountTitle
    );
    this.accountEditForm.controls['OldAccountNo'].setValue(data.OldAccountNo);
    this.accountEditForm.controls['SpecialInstruction'].setValue(
      data.SpecialInstruction
    );
    this.accountEditForm.controls['InterestCalculationId'].setValue(
      data.InterestCalculation
    );
    this.accountEditForm.controls['WithdrawalAccountTypeId'].setValue(
      data.WithdrawalAccountTypeId
    );
    this.accountEditForm.controls['AutoRenewalId'].setValue(data.AutoRenewalId);
    this.accountEditForm.controls['ShareStatusId'].setValue(data.ShareStatusId);
    this.accountEditForm.controls['SmsService'].setValue(data.SmsService);
    this.accountEditForm.controls['IsAutoTransCorrAccount'].setValue(
      data.IsAutoTransCorrAccount ? true : false
    );
    this.accountEditForm.controls['IsContractInt'].setValue(
      data.IsContractInt ? true : false
    );
    this.accountEditForm.controls['InterestRate'].setValue(data.InterestRate);
    this.accountEditForm.controls['MaturityDate'].setValue(data.MaturityDate);
    this.accountEditForm.controls['FixedDeposit'].setValue(
      data.FixedDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
    this.accountEditForm.controls['InterestBenefits'].setValue(
      data.InterestBenefits
    );

    this.accountEditForm.controls['OriginalAmount'].setValue(
      data.OriginalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
    this.accountEditForm.controls['PrincipalAmount'].setValue(
      data.PrincipalAmount
    );
    this.accountEditForm.controls['RenewalAmount'].setValue(data.RenewalAmount);
    this.accountEditForm.controls['MaturityAmount'].setValue(
      data.MaturedAmount
    );
    this.accountEditForm.controls['BenefitsDate'].setValue(data.BenefitDate);
    this.accountEditForm.controls['NoOfBenefit'].setValue(data.NoOfBenefit);
    this.dateChecker();
  }

  onAccountTypeChange(value: number): void {
    this.showNomiBtn = true;
    var fValue = this.accountEditForm.value as IAccountOpenCreate;
    if (!fValue.MemberNo) {
      alert('Please Input Member No!');
      return;
    }
    this.spinner.show();
    var item = new SelectListFilter().getItem(
      this.inputHelpData.AccountTypeList,
      value
    );
    console.log('method parameter>', value);
    this.accountEditForm.controls['AccountTypeId'].setValue(
      item != null ? item.Id : 0
    );
    this.accountEditForm.controls['AccountTypeCode'].setValue(
      item != null ? item.Id.toString() : ''
    );
    this.pService
      .EditAccountTypeChange(value, +fValue.MemberNo, +this.MemType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.accountEditForm.controls['AccountTypeId'].setValue(0);
          this.accountEditForm.controls['AccountTypeCode'].setValue('');
        }
        this.accountViewModel = data;
        console.log('-------', data);

        if (this.accountViewModel.ShowAccountList) {
          this.accountEditForm.controls['Status'].setValue('');
          return;
        }
        this.SetEditDetails(data);
      });
  }

  onAccountNumberChange(e) {
    console.log('acount no=====', typeof e.target.value);
    var fValue = this.accountEditForm.value as IAccountOpenCreate;
    this.spinner.show();
    this.pService
      .GetEditDetialsByAccountNo(fValue.AccountTypeId, e.target.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (!data.Success) {
          alert(data.Message);
          this.accountEditForm.controls['AccountTypeId'].setValue(0);
          this.accountEditForm.controls['AccountTypeCode'].setValue('');
        }
        console.log('edit details===', data);
        data.ShowAccountList = true;
        data.AccountNoList = this.accountViewModel.AccountNoList;
        this.accountViewModel = data;
        this.SetEditDetails(data);
      });
  }

  onUpdate(): void {

    if (this.accountEditForm.invalid) {
      alert('Please fill all the required field!');
      return;
    }
    this.spinner.show();
    var fValue = this.accountEditForm.value as IAccountOpenCreate;
    console.log("AllValue----==>",fValue)
    fValue.AccCorrType = this.accountViewModel.AccCorrType;
    (fValue.OpenDate =
      typeof this.accountEditForm.value.OpenDate == 'string'
        ? this.accountEditForm.value.OpenDate
        : this.convertDateToString(this.accountEditForm.value.OpenDate)),

        (fValue.BenefitDates =
          typeof this.accountEditForm.value.BenefitsDate == 'string'
            ? this.accountEditForm.value.BenefitsDate
            : this.convertDateToString(this.accountEditForm.value.BenefitsDate).toString()),
            
    

console.log("Checkin==>",fValue.BenefitDates)

    

        console.log("Hello Chec====>",fValue.OpenDate);
      (fValue.SlabDetails = this.slabDetails);
    this.pService
      .Update(fValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        if (data.Success) {
          alert(data.Message);
          location.reload();
        } else {
          alert(data.Message);
        }
      });
  }

  CorrAccChangeHandler = (e) => {
    var fValue = this.accountEditForm.value as IAccountOpenCreate;
    if (!fValue.MemberNo) {
      alert('Please Input Member No!');
      return;
    }
    this.spinner.show();
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
          this.toaster.warning(data.Message);
          this.accountEditForm.controls['CorrAccountNo'].setValue('');
          this.accountEditForm.controls['CorrAccountTitle'].setValue('');
        }
        this.accountEditForm.controls['CorrAccountNo'].setValue(
          data.CorrAccountNo
        );
        this.accountEditForm.controls['CorrAccountTitle'].setValue(
          data.CorrAccountDescriptipn
        );
      });
  };

  changeDepositAmountHandler = (e) => {
    if (this.accountViewModel.AccountClassId == 1) {
      let DepositValidationData = {
        AccTypeClass: this.accountViewModel.AccountClassId,
        MinDepositAmt: this.accountViewModel.MinDepositAmt,
        DepositAmount: e.target.value,
        Period: this.accountEditForm.value.Period ?? 0,
        MemType: this.MemType,
        AccountTypeId: this.accountViewModel.AccountTypeId,
      };
      this.spinner.show();
      // console.log('=====send data', DepositValidationData)
      this.pService
        .OnDepositAmountChange(DepositValidationData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.spinner.hide();
          // console.log('=========res data', data)
        });
    } else if (
      this.accountViewModel.AccountClassId != 1 &&
      this.accountEditForm.value.Period
    ) {
      let DepositValidationData = {
        AccTypeClass: this.accountViewModel.AccountClassId,
        MinDepositAmt: this.accountViewModel.MinDepositAmt,
        DepositAmount: e.target.value,
        Period: this.accountEditForm.value.Period ?? 0,
        MemType: this.MemType,
        AccountTypeId: this.accountViewModel.AccountTypeId,
        OpenDate: this.accountEditForm.value.OpenDate,
      };
      this.spinner.show();
      this.pService
        .OnDepositAmountChange(DepositValidationData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.spinner.hide();
          this.accountEditForm.controls['MaturityDate'].setValue(
            data.MaturityDate
          );
          this.accountEditForm.controls['InterestRate'].setValue(
            data.InterestRate
          );
          this.accountEditForm.controls['MaturityAmount'].setValue(
            data.MaturedAmount
          );
          this.accountEditForm.controls['Period'].setValue(data.Period);
          console.log('=========res data', data);
        });
    }
  };
  changeFixedDepositAmountHandler = (e) => {
    // let DepositValidationData = {
    //   AccTypeClass: this.accountViewModel.AccountClassId,
    //   MinDepositAmt: this.accountViewModel.MinDepositAmt,
    //   DepositAmount: e.target.value,
    //   Period: this.accountEditForm.value.Period ?? 0,
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
    console.log("OKOKOK===>",str)
    if(str=='' || str==null)
    {
      return '';
    }
     
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('/');
  }

  changePeriodHandler = (e) => {
    if (!this.accountEditForm.value.Period) {
      return;
    }
    let PeriodValidationData = {
      AccTypeClass: this.accountViewModel.AccountClassId,
      DepositAmount: this.accountEditForm.value.DepositAmount,
      FixedDeposit: this.accountEditForm.value.FixedDeposit,
      Period: this.accountEditForm.value.Period ?? 0,
      OpenDate:
        typeof this.accountEditForm.value.OpenDate == 'string'
          ? this.accountEditForm.value.OpenDate
          : this.convertDateToString(this.accountEditForm.value.OpenDate),
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
          this.accountEditForm.controls['MaturityDate'].setValue(
            data.MaturityDate
          );
          this.accountEditForm.controls['InterestRate'].setValue(
            data.InterestRate
          );
          this.accountEditForm.controls['MaturityAmount'].setValue(
            data.MaturedAmount
          );
          this.accountEditForm.controls['InterestBenefits'].setValue(
            data.InterestBenefits
          );
        } else {
          alert(data.Message);
          this.accountEditForm.controls['Period'].setValue('');
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
    this.pService.checkTemp = false;
    this.pService.MemNo = this.accountEditForm.value.MemberNo;
    this.pService.AccNo = this.accountEditForm.value.AccountNo;
    this.pService.MemType = this.MemType;
    this.pService.AccType = this.accountEditForm.value.AccountTypeCode;

    const modalRef = this.modalService.open(AddNomineeComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'my-modal',
    });
  }
}
