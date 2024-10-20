import { Injectable } from '@angular/core';
import { LoanApplicationCreateModel } from '../models/loan-application.model';
@Injectable({
  providedIn: 'root'
})
export class NewLoanApplicationService {

  public newLoanApplication = new LoanApplicationCreateModel();
  public returnData:any;
  constructor() { }


  public setNewLoanApplication(data:any){
    this.newLoanApplication.ApplicationDate = data.loanInfo.ApplicationDate;
    this.newLoanApplication.MemType = data.loanInfo.MemType;
    this.newLoanApplication.LoanAccountTypeCode = data.loanInfo.LoanAccountTypeCode;
    this.newLoanApplication.LoanAccountType = data.loanInfo.LoanAccountType;
    this.newLoanApplication.LoanAccCorrType = data.loanInfo.LoanAccCorrType;
    this.newLoanApplication.CorrAccountNo = data.loanInfo.CorrAccountNo;
    this.newLoanApplication.CorrAccountTitle = data.loanInfo.CorrAccountTitle;
    this.newLoanApplication.IsAutoTrfCorrAccount  = data.loanInfo.IsAutoTrfCorrAccount;
    this.newLoanApplication.LoanMemberNo  = data.loanInfo.LoanMemberNo;
    this.newLoanApplication.LoanMemberName  = data.loanInfo.LoanMemberName;
    this.newLoanApplication.LoanApplicationAmount  = data.loanInfo.LoanApplicationAmount;
    this.newLoanApplication.LoanInterestRate  = data.loanInfo.LoanInterestRate ;
    this.newLoanApplication.LoanCategoryCode  = data.loanInfo.LoanCategoryCode;
    this.newLoanApplication.LoanCategory  = data.loanInfo.LoanCategory;
    this.newLoanApplication.LoanExpDate  = data.loanInfo.LoanExpDate;
    this.newLoanApplication.LoanPurposeCode   = data.loanInfo.LoanPurposeCode;
    this.newLoanApplication.LoanPurpose  = data.loanInfo.LoanPurpose;
    this.newLoanApplication.LoanInterestCalMethodCode  = data.loanInfo.LoanInterestCalMethodCode;
    this.newLoanApplication.LoanInterestCalMethod  = data.loanInfo.LoanInterestCalMethod;
    this.newLoanApplication.LoanSuretyMemNo  = data.loanInfo.LoanSuretyMemNo;
    this.newLoanApplication.LoanSuretyMemName  = data.loanInfo.LoanSuretyMemName;
    this.newLoanApplication.AccPeriod  = data.loanInfo.AccPeriod;
    this.newLoanApplication.StepsOfLoan  = data.loanInfo.StepsOfLoan;
    this.newLoanApplication.LoanPerformance   = data.loanInfo.LoanPerformance;
    this.newLoanApplication.TotalDepAmount   = data.loanInfo.TotalDepAmount;
    this.newLoanApplication.LoanNoInstallment   = data.loanInfo.LoanNoInstallment;
    this.newLoanApplication.LoanInstallmentAmount   = data.loanInfo.LoanInstallmentAmount;
    this.newLoanApplication.LoanLastInstallmentAmount   = data.loanInfo.LoanLastInstallmentAmount;
    this.newLoanApplication.LoanFirstInstallmentdate   = data.loanInfo.LoanFirstInstallmentdate;
    this.newLoanApplication.LoanGracePeriod   = data.loanInfo.LoanGracePeriod;
    this.newLoanApplication.DataShareList = data.shareGuarantorInfo.DataShareList;
    this.newLoanApplication.AccAtyClass = data.loanInfo.AccAtyClass;
    if(data.shareGuarantorInfo.DataShareList==null){
      this.newLoanApplication.DataShareList = [];
    }
    this.newLoanApplication.TotalShareGuarantorAmount = data.shareGuarantorInfo.TotalShareGuarantorAmount;
    this.newLoanApplication.DataDepositList = data.depositGuarantorInfo.DataDepositList;
    if(data.depositGuarantorInfo.DataDepositList==null){
      this.newLoanApplication.DataDepositList = [];
    }
    this.newLoanApplication.TotalDepositGuarantorAmount = data.depositGuarantorInfo.TotalDepositGuarantorAmount;
    this.newLoanApplication.DataPropertyList = data.propertyGuarantorInfo.DataPropertyList;
    if(data.propertyGuarantorInfo.DataPropertyList==null){
      this.newLoanApplication.DataPropertyList = [];
    }
    this.newLoanApplication.TotalPropertyGuarantorAmount = data.propertyGuarantorInfo.TotalPropertyGuarantorAmount;
    this.newLoanApplication.TotalGaurantyAmount = data.TotalGaurantyAmount;
    this.newLoanApplication.AccTypeMode = data.loanInfo.AccTypeMode;
    this.newLoanApplication.LoanSecondInstallmentdate = data.loanInfo.LoanSecondInstallmentdate;
    this.newLoanApplication.LoanSuretyMemType = data.loanInfo.LoanSuretyMemType;
    this.newLoanApplication.DepositMode = data.loanInfo.DepositMode;
    this.newLoanApplication.LoanModule = data.LoanModule;
    return this.newLoanApplication;
  }


}
