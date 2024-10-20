import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccNoDataModel, AccTypeDataModel, MemberNoDataModel, EditLoanAccFullUpdateModel } from '../modules/accounting/models/edit-loan-account.model';
import { createUrl } from '../utility/common';

@Injectable({
  providedIn: 'root'
})
export class EditLoanAccountService {
  public loanApplicationNo: number;
  public accountType: number;
  constructor(
    private httpClient: HttpClient,
  ) { }

  public setAccountType(data:number){
    this.accountType = data;
  }
  public getAccountType(){
    return this.accountType;
  }
  public setLoanApplicationNo(data:number){
    this.loanApplicationNo = data;
  }

  public getLoanApplicationNo(){
    return this.loanApplicationNo;
  }

  public setMemberNoData(x:any){
    var data = new MemberNoDataModel();
    data.CtrlBranchNo = x.CtrlBranchNo;
    data.MemName = x.MemName;
    data.MemType = x.MemType;
    return data;
  }

  public convertDateToString(value:any){
    if(value==null) return;
    let num = value;
    num = num.toString();
    num = num.split("-");
    let date = num[0];
    let month = num[1];
    let year = num[2]; 
    let result = date + "/" + month + "/" + year;
    return result;
  }

  public setLoanAccTypeChangeData(x:any){
    var data = new AccNoDataModel();
    data.AccDepRoundingBy = x.AccDepRoundingBy;
    data.AtyClass = x.AtyClass;
    data.CalculationPeriod = x.CalculationPeriod;
    data.DepositMode = x.DepositMode;
    data.DisbAmtVisible = x.DisbAmtVisible;
    data.DisbDateVisible = x.DisbDateVisible;
    data.DueIntVisible = x.DueIntVisible;
    data.DuePrincVisible = x.DuePrincVisible;
    data.FirstInstlDtVisible = x.FirstInstlDtVisible;
    data.InstlAmountVisible = x.InstlAmountVisible;
    data.LastInstlAmtVisible = x.LastInstlAmtVisible;
    data.NoInstlVisible = x.NoInstlVisible;
    data.ODIDueIntAmtVisible = x.ODIDueIntAmtVisible;
    data.ODIntDateVisible = x.ODIntDateVisible;
    data.PeriodVisible = x.PeriodVisible;
    data.PrmCorrType = x.PrmCorrType;
    data.SecondInstlDtVisible = x.SecondInstlDtVisible;
    data.WeeklyDay = x.WeeklyDay;
    return data;
  }
  
  public setAccTypeData(x:any){
    var data = new AccTypeDataModel();
    data.AccCorrType = x.AccCorrType;
    data.AutoTrf = x.AutoTrf;
    data.Balance = x.Balance;
    data.CalculationPeriod = x.CalculationPeriod;
    data.Cls = x.Cls;
    data.CorrAccNo = x.CorrAccNo;
    data.CorrAccNoVisible = x.CorrAccNoVisible;
    data.CorrAccTitle = x.CorrAccTitle;
    data.CtrlAccStatus = x.CtrlAccStatus;
    data.CtrlBranchNo = x.CtrlBranchNo;
    data.CtrlMsgFlag = x.CtrlMsgFlag;
    data.DepositMode = x.DepositMode;
    data.DisbAmount = x.DisbAmount;
    data.DisbDate = x.DisbDate;
    data.DueInt = x.DueInt;
    data.DuePrinc = x.DuePrinc;
    data.EffectDate = x.EffectDate;
    data.FirstInstlDt = x.FirstInstlDt;
    data.FirstInstlDtVisible = x.FirstInstlDtVisible;
    data.GraceFlag = x.GraceFlag;
    data.ID = x.ID;
    data.InstlAmount = x.InstlAmount;
    data.IntRate = x.IntRate;
    data.LastInstlAmount = x.LastInstlAmount;
    data.LastTrnDate = x.LastTrnDate;
    data.LoanAppNo = x.LoanAppNo;
    data.LoanCalMethod = x.LoanCalMethod;
    data.LoanExpiryDate = x.LoanExpiryDate;
    data.LoanFirstInstlDt = x.LoanFirstInstlDt;
    data.LoanGrace = x.LoanGrace;
    data.LoanGraceVisible = x.LoanGraceVisible;
    data.LoanSecondInstlDt = x.LoanSecondInstlDt;
    data.MemName = x.MemName;
    data.MemType = x.MemType;
    data.NextEffectDate = x.NextEffectDate;
    data.NoInstl = x.NoInstl;
    data.ODIDueIntAmt = x.ODIDueIntAmt;
    data.ODIntDate = x.ODIntDate;
    data.OldAccNo = x.OldAccNo;
    data.OpenDate = x.OpenDate;
    data.PaidIntAmt = x.PaidIntAmt;
    data.PaidPrincAmt = x.PaidPrincAmt;
    data.Period = x.Period;
    data.PrmCorrType = x.PrmCorrType;
    data.RebatePaid = x.RebatePaid;
    data.SMSService = x.SMSService;
    data.SancAmount = x.SancAmount;
    data.SancDate = x.SancDate;
    data.SecondInstlDt = x.SecondInstlDt;
    data.SecondInstlDtText = x.SecondInstlDtText;
    data.SecondInstlDtVisible = x.SecondInstlDtVisible;
    data.Stat = x.Stat;
    data.SuretyMemName = x.SuretyMemName;
    data.SuretyMemNo = x.SuretyMemNo;
    data.SuretyMemType = x.SuretyMemType;
    data.WeeklyDay = x.WeeklyDay;
    data.WeeklyDayVisible = x.WeeklyDayVisible;
    return data;
  }

  public UpdateDataSet(data:any){
    var x = new EditLoanAccFullUpdateModel();
    x.MemberNo= Number(data.MemberNo);
    x.AccountType= Number(data.AccountType);
    x.WeeklyDay= Number(data.WeeklyDay);
    x.AccountNo= Number(data.AccountNo);
    x.Status= data.Status;
    x.OpenDate= data.OpenDate;
    x.LedgerBalance= Number(data.LedgerBalance);
    x.SanctionDate= data.SanctionDate;
    x.LoanGraceMonth= Number(data.LoanGraceMonth);
    x.DisbursementDate= data.DisbursementDate;
    x.SanctionAmount=Number(data.SanctionAmount);
    x.LoanExpiryDate=data.LoanExpiryDate;
    x.DisburesementAmount=Number(data.DisburesementAmount);
    x.LastTransactionDate=data.LastTransactionDate;
    x.NoOfInstallment= Number(data.NoOfInstallment);
    x.InterestRate= Number(data.InterestRate);
    x.InstallmentAmount= Number(data.InstallmentAmount);
    x.LoanCalMethod= Number(data.LoanCalMethod);
    x.LastInstallmentAmount= Number(data.LastInstallmentAmount);
    x.FirstInstallmentDate= data.FirstInstallmentDate;
    x.SecondInstallmentDate= data.SecondInstallmentDate;
    x.CurrentEffectingDate= data.CurrentEffectingDate;
    x.NextEffectingDate= data.NextEffectingDate;
    x.ODIntPostDate= data.ODIntPostDate;
    x.DueODInterestAmt= Number(data.DueODInterestAmt);
    x.ODPeriod= Number(data.ODPeriod);
    x.LoanSuretyMemberNo= Number(data.LoanSuretyMemberNo);
    x.LoanSuretyMemberType= Number(data.LoanSuretyMemberType);
    x.CurrPrincipalDue= Number(data.CurrPrincipalDue);
    x.CurrInterestDue= Number(data.CurrInterestDue);
    x.CorrAccountNo= Number(data.CorrAccountNo);
    x.AutoTrfCorrAC= Number(data.AutoTrfCorrAC);
    x.OldAccountNo= Number(data.OldAccountNo);
    x.SMSService= Number(data.SMSService);
    x.RebatePaid= Number(data.RebatePaid);
    x.MemberType= Number(data.MemberType);
    x.LoanFirstInstlDt= data.LoanFirstInstlDt;
    x.LoanSecondInstlDt= data.LoanSecondInstlDt;
    x.AccCorrType= Number(data.AccCorrType);
    x.ProcDate= data.ProcDate;
    x.EffectDate= data.EffectDate;
    x.PaidPrincAmt= Number(data.PaidPrincAmt);
    x.PaidIntAmt= Number(data.PaidIntAmt);
    x.ID= Number(data.ID);
    x.LoanAppNo= Number(data.LoanAppNo);
    x.AtyClass= Number(data.AtyClass);
    return x;
  }


  public editLoanAccLoadData(){
    return this.httpClient.get(createUrl(`Accounting/EditLoanAccountMaintenance/LoadData`));
  }

  public editLoanAccMemNoChangeData(data:any){
    return this.httpClient.get(createUrl(`Accounting/EditLoanAccountMaintenance/MemberNoChange?MemberNo=`+data));
  }

  public editLoanAccTypeChangeData(data:any){
    return this.httpClient.post(createUrl(`Accounting/EditLoanAccountMaintenance/AccTypeChange`),data);
  }

  public editLoanAccNoChangeData(data:any){
    return this.httpClient.post(createUrl(`Accounting/EditLoanAccountMaintenance/AccNoChange`),data);
  }
  public editLoanAccShareMemberData(data:any,data2:any){
    return this.httpClient.get(createUrl(`Accounting/EditLoanAccountMaintenance/GetShareMemberData?MemberNo=`+data+`&accountType=`+data2));
  }
  public editLoanAccAddAndGetShareDataToTemp(data:any){
    return this.httpClient.post(createUrl(`Accounting/EditLoanAccountMaintenance/AddAndGetShareDataToTemp`),data);
  }
  public editLoanRemoveAndGetShareDataToTemp(data:any, data2:any){
    return this.httpClient.get(createUrl(`Accounting/EditLoanAccountMaintenance/RemoveAndGetShareDataToTemp?ShareDataId=`+data+`&LoanApplicationNo=`+data2));
  }
  public editLoanAccAddAndGetDepositDataToTemp(data:any){
    return this.httpClient.post(createUrl(`Accounting/EditLoanAccountMaintenance/AddAndGetDepositDataToTemp`),data);
  }
  public editLoanRemoveAndGetDepositDataToTemp(data:any){
    return this.httpClient.post(createUrl(`Accounting/EditLoanAccountMaintenance/RemoveAndGetDepositDataToTemp`),data);
  }
  public AddAndGetPropertyDataToTemp(data:any){
    return this.httpClient.post(createUrl(`Accounting/EditLoanAccountMaintenance/AddAndGetPropertyDataToTemp`),data);
  }
  public RemoveAndGetPropertyDataToTemp(data:any, data2:any){
    return this.httpClient.get(createUrl(`Accounting/EditLoanAccountMaintenance/RemoveAndGetPropertyDataToTemp?propertyId=`+data+`&loanApplicationNo=`+data2));
  }
  public UpdateData(data:EditLoanAccFullUpdateModel){
    return this.httpClient.post(createUrl(`Accounting/EditLoanAccountMaintenance/UpdateData`),data);
  }
  public NoOfInstallmentChange(data:any){
    return this.httpClient.post(createUrl(`Accounting/EditLoanAccountMaintenance/NoOfInstallmentChange`),data);
  }
  public InstallmentAmountChange(data:any){
    return this.httpClient.post(createUrl(`Accounting/EditLoanAccountMaintenance/InstallmentAmountChange`),data);
  }
  public CorrAccountNoChange(data:any){
    return this.httpClient.post(createUrl(`Accounting/EditLoanAccountMaintenance/CorrAccountNoChange`),data);
  }
  public LoanSuretyMemberNoChange(data:any){
    return this.httpClient.get(createUrl(`Accounting/EditLoanAccountMaintenance/LoanSuretyMemberNoChange?suretyMemNo=`+data));
  }
}
