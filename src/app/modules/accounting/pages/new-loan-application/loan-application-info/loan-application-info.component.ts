import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import {
  LoanAccountTypeViewModel,
  LoanApplicationInputHelp,
  LoanMemberViewModel,
  ShareGuarantorDetailsModel,
} from '../../../models/loan-application.model';
import { LoanApplicationEventService } from '../../../services/loan-application-event-service';
import { DepositAccountListComponent } from '../deposit-account-list/deposit-account-list.component';

@Component({
  selector: 'app-loan-application-info',
  templateUrl: './loan-application-info.component.html',
  styleUrls: ['./loan-application-info.component.css'],
})
export class LoanApplicationInfoComponent implements OnInit, OnDestroy {
  @Output() callParentFunction: EventEmitter<any> = new EventEmitter<any>();
  @Output() parentFunctionShare: EventEmitter<any> = new EventEmitter<any>();
  @Input() formGroupName: string;
  public inputHelpData: LoanApplicationInputHelp = new LoanApplicationInputHelp();
  loanInfoForm: FormGroup;
  private loanAppEventService: LoanApplicationEventService;
  private destroy$: Subject<void> = new Subject<void>();
  public hideShowModel = {
    ShowCorrAccNo: false,
    ShowInstallment: false,
    ShowLoanGraceMonth: false,
    ShowPeriod: true,
  };
  public accountTypeDetails: LoanAccountTypeViewModel = new LoanAccountTypeViewModel();
  public memberDetails: LoanMemberViewModel = new LoanMemberViewModel();
  public shareDataList: ShareGuarantorDetailsModel[] = [];
  public shareGuaranteeMonth: number;
  public shareGuranteeNo: number;
  public shareAmountNow: number = 0;
  constructor(
    private rootFormGroup: FormGroupDirective,
    private applicationService: LoanApplicationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.loanInfoForm = this.rootFormGroup.control.get(
      this.formGroupName
    ) as FormGroup;
    this.setDefaultOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setDefaultOptions(): void {
    this.spinner.show();
    this.applicationService
      .GetInputHelp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inputHelpData = data;
        console.log('input help', data);
        this.applicationService.HoLoadApplication = data.HOLoan;
        this.applicationService.HOLoanABooth = data.HOLoanBooth;
        this.loanInfoForm.controls['ApplicationDate'].setValue(
          data.ApplicationDate
        );
        this.loanAppEventService = new LoanApplicationEventService(
          this.loanInfoForm,
          this.inputHelpData
        );
        this.spinner.hide();
      });
  }

  public onAccountTypeChange(value: number): void {
    this.spinner.show();
    this.loanAppEventService.setAccountType(value);
    this.applicationService
      .GetLoanAccountTypeDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.accountTypeDetails = data;
        console.log('loan acc type details', data);
        var accountTypeTitle = this.inputHelpData.AccountTypeList.filter(
          (item) => item.Id == value
        );
        localStorage.setItem(
          'accountTypeTitle',
          JSON.stringify(accountTypeTitle[0].Description)
        );
        this.applicationService.setShareData(data);
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.hideShowModel.ShowCorrAccNo = data.ShowCorrAccNo;
        this.hideShowModel.ShowInstallment = data.ShowInstallment;
        this.hideShowModel.ShowLoanGraceMonth = data.ShowLoanGraceMonth;
        this.hideShowModel.ShowPeriod = data.ShowPeriod;
        this.shareGuaranteeMonth = data.ShareGuaranteeMonth;
        this.shareGuranteeNo = data.ShareGuaranteeNo;
        this.loanAppEventService.setAccountTypeDetails(data);
        this.memberDetails = new LoanMemberViewModel();
        document.getElementById(`LoanMemberNo`).focus();
      });
  }
  public onAccountTypeChangekeydown(e: KeyboardEvent): void {
    if (e.keyCode != 13) return;
    if(this.loanInfoForm.controls['LoanAccountTypeCode'].value=='')
    {
      document.getElementById(`LoanAccountTypeCode`).focus();
      return

    }
    let value = this.loanInfoForm.value.LoanAccountTypeCode;
    this.spinner.show();
    this.loanAppEventService.setAccountType(value);
    this.applicationService
      .GetLoanAccountTypeDetails(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.spinner.hide();
        this.accountTypeDetails = data;
        console.log('loan acc type details', data);
        var accountTypeTitle = this.inputHelpData.AccountTypeList.filter(
          (item) => item.Id == value
        );
        localStorage.setItem(
          'accountTypeTitle',
          JSON.stringify(accountTypeTitle[0].Description)
        );
        this.applicationService.setShareData(data);
        if (!data.Success) {
          alert(data.Message);
          return;
        }
        this.hideShowModel.ShowCorrAccNo = data.ShowCorrAccNo;
        this.hideShowModel.ShowInstallment = data.ShowInstallment;
        this.hideShowModel.ShowLoanGraceMonth = data.ShowLoanGraceMonth;
        this.hideShowModel.ShowPeriod = data.ShowPeriod;
        this.shareGuaranteeMonth = data.ShareGuaranteeMonth;
        this.shareGuranteeNo = data.ShareGuaranteeNo;
        this.loanAppEventService.setAccountTypeDetails(data);
        this.memberDetails = new LoanMemberViewModel();
        document.getElementById(`LoanMemberNo`).focus();
      });
  }

  public onLoanPurposeChange(value: number): void {
    this.loanAppEventService.setLoanPurpose(value);
    document.getElementById(`LoanSuretyMemNo`).focus();
  }

  public onLoanCalMethodChange(value: number): void {
    this.loanAppEventService.setLoanCalMethod(value);
  }

  public onMemberNoChange(): void {
    var fValue = this.loanInfoForm.value;
    if (fValue.LoanAccountTypeCode.length <= 0) {
      alert('Please Select Loan A/C Type!');
      this.loanInfoForm.controls['LoanMemberNo'].setValue('');
      return;
    }
    if(this.loanInfoForm.controls['LoanMemberNo'].value==' ')
    {
      document.getElementById(`LoanMemberNo`).focus();
    }

    this.spinner.show();
    this.applicationService
      .GetLoanMemberDetails(
        fValue.LoanMemberNo,
        fValue.LoanAccountTypeCode,
        this.shareGuranteeNo,
        this.shareGuaranteeMonth
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.loanInfoForm.controls['MemType'].setValue(data.MemType);
        this.applicationService.memNo = data.MemberNo;
        this.applicationService.memType = data.MemType;
        if (!data.Success) {
          alert(data.Message);
        } else {
          console.log('here is coming');
          if (
            data.ShareGuarantorData != null &&
            data.ShareGuarantorData != undefined
          ) {
            console.log(data.ShareGuarantorData);
            if (
              data.ShareGuarantorData.length > 0 &&
              data.ShareGuarantorData[0].Success == true
            ) {
              this.applicationService.changeLoanMemberNo(
                data.ShareGuarantorData
              );
              var tot = 0;
              for (var i = 0; i < data.ShareGuarantorData.length; i++) {
                tot += Number(data.ShareGuarantorData[i].ShareAmount);
              }
              if (tot > 0) {
                this.applicationService.changeTotalShare(tot);
                this.shareDataList.push(data.ShareGuarantorData);
                if (this.shareAmountNow != 0) {
                  let sendData = {
                    singleValue: 1,
                    Data: this.shareAmountNow * -1,
                  };
                  this.callParentFunction.emit(sendData);
                }
                this.shareAmountNow = tot;
                let sendData = {
                  singleValue: 0,
                  Data: data.ShareGuarantorData,
                };
                this.callParentFunction.emit(sendData);
              }
            } else {
              if (data.ShareGuarantorData.length > 0)
                alert(data.ShareGuarantorData[0].Message);
            }
          }
          this.loanAppEventService.setLoanMemberDetails(data);
          this.memberDetails = data;
          this.hideShowModel.ShowCorrAccNo = data.ShowCorrAccNo;
        }
        document.getElementById(`LoanApplicationAmount`).focus();
        this.spinner.hide();
      });

  }

  public onMemberNoChangekeydown(e: KeyboardEvent): void {
    if (e.keyCode != 13) return;
    console.log("HelloTest==>",this.loanInfoForm.controls['LoanMemberNo'].value)
    if(this.loanInfoForm.controls['LoanMemberNo'].value=='' || this.loanInfoForm.controls['LoanMemberNo'].value==null )
    {
      document.getElementById(`LoanMemberNo`).focus();
      return;
    }
    var fValue = this.loanInfoForm.value;
    if (fValue.LoanAccountTypeCode.length <= 0) {
      alert('Please Select Loan A/C Type!');
      this.loanInfoForm.controls['LoanMemberNo'].setValue('');
      return;
    }

    this.spinner.show();
    this.applicationService
      .GetLoanMemberDetails(
        fValue.LoanMemberNo,
        fValue.LoanAccountTypeCode,
        this.shareGuranteeNo,
        this.shareGuaranteeMonth
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.loanInfoForm.controls['MemType'].setValue(data.MemType);
        if (!data.Success) {
          alert(data.Message);
        } else {
          console.log('here is coming');
          if (
            data.ShareGuarantorData != null &&
            data.ShareGuarantorData != undefined
          ) {
            console.log(data.ShareGuarantorData);
            if (
              data.ShareGuarantorData.length > 0 &&
              data.ShareGuarantorData[0].Success == true
            ) {
              this.applicationService.changeLoanMemberNo(
                data.ShareGuarantorData
              );
              var tot = 0;
              for (var i = 0; i < data.ShareGuarantorData.length; i++) {
                tot += Number(data.ShareGuarantorData[i].ShareAmount);
              }
              if (tot > 0) {
                this.applicationService.changeTotalShare(tot);
                this.shareDataList.push(data.ShareGuarantorData);
                if (this.shareAmountNow != 0) {
                  let sendData = {
                    singleValue: 1,
                    Data: this.shareAmountNow * -1,
                  };
                  this.callParentFunction.emit(sendData);
                }
                this.shareAmountNow = tot;
                let sendData = {
                  singleValue: 0,
                  Data: data.ShareGuarantorData,
                };
                this.callParentFunction.emit(sendData);
              }
            } else {
              if (data.ShareGuarantorData.length > 0)
                alert(data.ShareGuarantorData[0].Message);
            }
          }
          this.loanAppEventService.setLoanMemberDetails(data);
          this.memberDetails = data;
          this.hideShowModel.ShowCorrAccNo = data.ShowCorrAccNo;
        }
        this.spinner.hide();
      });
    document.getElementById(`LoanApplicationAmount`).focus();
  }

  private getCreateModel(): any {
    var fValue = this.loanInfoForm.value;
    fValue.AccountClassId = this.accountTypeDetails.AccTypeClass;
    fValue.MemType = this.memberDetails.MemType;
    fValue.DepositMode = this.accountTypeDetails.AccDepositMode;
    fValue.GraceFlag = this.accountTypeDetails.GraceFlag;
    return fValue;
  }

  public onLoanAmountEvent(): void {
    this.spinner.show();
    this.applicationService
      .CalculateInstallmentDetails(this.getCreateModel())
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loanAppEventService.setLoanDetails(data);
        console.log('calculate installment details', data);
        if (!data.Success) {
          alert(data.Message);
        }
        this.spinner.hide();
      });
    document.getElementById(`LoanPurposeCode`).focus();
  }

  public onLoanAmountEventkeydown(e: KeyboardEvent): void {
    if (e.keyCode != 13) return;
    this.spinner.show();
    this.applicationService
      .CalculateInstallmentDetails(this.getCreateModel())
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loanAppEventService.setLoanDetails(data);
        console.log('calculate installment details', data);
        if (!data.Success) {
          alert(data.Message);
        }
        this.spinner.hide();
      });
    document.getElementById(`LoanPurposeCode`).focus();
  }

  onEnterLoanPurposeHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (!this.loanInfoForm.controls['LoanPurposeCode'].value) {
      document.getElementById(`LoanSuretyMemNo`).focus();
      return;
    } else {
      document.getElementById(`LoanSuretyMemNo`).focus();
    }
  }

  onEnterLoanSuretyMemNoHandler(e: KeyboardEvent) {
    if (e.keyCode != 13) return;
    if (!this.loanInfoForm.controls['LoanSuretyMemNo'].value) {
      this.loanAppEventService.setFocusOnSubmit();
    }
  }

  public onLoanNoEvent(): void {
    this.spinner.show();
    this.applicationService
      .CalculateByNoOfLoan(this.getCreateModel())
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loanAppEventService.setDetailsByInstallmentNo(data);
        console.log('calculate by no of loan', data);
        if (!data.Success) {
          alert(data.Message);
        }
        this.spinner.hide();
      });
  }

  public onSuretyMemberNo(): void {
    this.applicationService
      .GetMemberByMemNo(this.loanInfoForm.value.LoanSuretyMemNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loanAppEventService.setSuretyMemberName(data);
        console.log('get member by mem no', data);
      });
  }

  public OpenDepositAccountPoUp(): void {
    const modalRef = this.modalService.open(DepositAccountListComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
}
