import { FormGroup } from '@angular/forms';
import { SelectListFilter } from 'src/app/filters/select-list-filter';
import { IdDescription } from 'src/app/interfaces/id-description';
import {
  LoanAccountTypeViewModel,
  LoanAmountViewModel,
  LoanApplicationInputHelp,
  LoanMemberViewModel,
  MemberNameModel,
} from '../models/loan-application.model';

export class LoanApplicationEventService {
  private readonly inputHelpData: LoanApplicationInputHelp;
  loanApplicationForm: FormGroup;
  inputFieldValue: string = '';
  ddlValue: number = 0;

  constructor(
    _loanApplicationForm: FormGroup,
    _inputHelp: LoanApplicationInputHelp
  ) {
    this.inputHelpData = _inputHelp;
    this.loanApplicationForm = _loanApplicationForm;
  }

  public setAccountType(value: number) {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.AccountTypeList,
      value
    );
    this.checkAndSetValue(item);
    this.loanApplicationForm.controls['LoanAccountType'].setValue(
      this.ddlValue
    );
    this.loanApplicationForm.controls['LoanAccountTypeCode'].setValue(
      this.inputFieldValue
    );
  }

  public setLoanPurpose(value: number) {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.LoanPurposeList,
      value
    );
    this.checkAndSetValue(item);
    this.loanApplicationForm.controls['LoanPurpose'].setValue(this.ddlValue);
    this.loanApplicationForm.controls['LoanPurposeCode'].setValue(
      this.inputFieldValue
    );
  }

  public setLoanCalMethod(value: number) {
    var item = new SelectListFilter().getItem(
      this.inputHelpData.LoanPurposeList,
      value
    );
    this.checkAndSetValue(item);
    this.loanApplicationForm.controls['LoanInterestCalMethod'].setValue(
      this.ddlValue
    );
    this.loanApplicationForm.controls['LoanInterestCalMethodCode'].setValue(
      this.inputFieldValue
    );
  }

  private checkAndSetValue(item: IdDescription) {
    this.ddlValue = item != null ? item.Id : 0;
    this.inputFieldValue = item != null ? item.Id.toString() : '';
  }

  public setLoanMemberDetails(item: LoanMemberViewModel): void {
    this.loanApplicationForm.controls['LoanMemberNo'].setValue(item.MemberNo);
    this.loanApplicationForm.controls['LoanMemberName'].setValue(
      item.MemberName
    );
    this.loanApplicationForm.controls['StepsOfLoan'].setValue(item.StepNoLoan);
    this.loanApplicationForm.controls['LoanPerformance'].setValue(
      item.PrevLoanRecord
    );
    this.loanApplicationForm.controls['TotalDepAmount'].setValue(
      item.TotalDeposit
    );
    this.loanApplicationForm.controls['CorrAccountNo'].setValue(
      item.CorrAccountNo
    );
    this.loanApplicationForm.controls['CorrAccountTitle'].setValue(
      item.CorrAccountTitle
    );
    this.loanApplicationForm.controls['LoanAccCorrType'].setValue(
      item.AccCorrType
    );
  }

  public setAccountTypeDetails(item: LoanAccountTypeViewModel): void {
    this.loanApplicationForm.controls['LoanInterestRate'].setValue(
      item.InterestRate
    );
    this.loanApplicationForm.controls['LoanExpDate'].setValue(item.LoanExpDate);
    this.loanApplicationForm.controls['AccPeriod'].setValue(item.Period);
    this.loanApplicationForm.controls['LoanGracePeriod'].setValue(
      item.GraceMonth
    );
    this.loanApplicationForm.controls['AccTypeMode'].setValue(item.AccTypeMode);
    this.loanApplicationForm.controls['DepositMode'].setValue(
      item.AccDepositMode
    );
    this.loanApplicationForm.controls['LoanApplicationAmount'].setValue(null);
    this.loanApplicationForm.controls['LoanMemberNo'].setValue(null);
    this.loanApplicationForm.controls['LoanMemberName'].setValue(null);
    this.loanApplicationForm.controls['PrmLoanGuarantyAmtPerc'].setValue(
      item.PrmLoanGuarantyAmtPerc
    );
    this.loanApplicationForm.controls['AccAtyClass'].setValue(
      item.AccTypeClass
    );
  }

  public setLoanDetails(item: LoanAmountViewModel): void {
    this.loanApplicationForm.controls['LoanApplicationAmount'].setValue(
      item.LoanApplicationAmount
    );
    this.loanApplicationForm.controls['LoanNoInstallment'].setValue(
      item.LoanNoInstallment
    );
    this.loanApplicationForm.controls['LoanInstallmentAmount'].setValue(
      item.LoanInstallmentAmount
    );
    this.loanApplicationForm.controls['LoanLastInstallmentAmount'].setValue(
      item.LoanLastInstallmentAmount
    );
    this.loanApplicationForm.controls['LoanFirstInstallmentdate'].setValue(
      item.LoanFirstInstallmentdate
    );
    if (item.LoanExpDate != null)
      this.loanApplicationForm.controls['LoanExpDate'].setValue(
        item.LoanExpDate
      );
    this.loanApplicationForm.controls['LoanSecondInstallmentdate'].setValue(
      item.LoanSecondInstallmentDate
    );
  }

  public setDetailsByInstallmentNo(item: LoanAmountViewModel): void {
    this.loanApplicationForm.controls['LoanInstallmentAmount'].setValue(
      item.LoanInstallmentAmount
    );
    this.loanApplicationForm.controls['LoanLastInstallmentAmount'].setValue(
      item.LoanLastInstallmentAmount
    );
    this.loanApplicationForm.controls['LoanFirstInstallmentdate'].setValue(
      item.LoanFirstInstallmentdate
    );
    this.loanApplicationForm.controls['LoanExpDate'].setValue(item.LoanExpDate);
  }

  public setSuretyMemberName(item: MemberNameModel): void {
    if (!item.Success) {
      this.loanApplicationForm.controls['LoanSuretyMemNo'].setValue(null);
      this.loanApplicationForm.controls['LoanSuretyMemName'].setValue(null);
    } else {
      this.loanApplicationForm.controls['LoanSuretyMemName'].setValue(
        item.FullName
      );
      this.loanApplicationForm.controls['LoanSuretyMemType'].setValue(
        item.LoanSuretyMemType
      );
      document.getElementById(`Submit`).focus();
    }
  }

public setFocusOnSubmit(): void{
  document.getElementById(`Submit`).focus();
}

}
