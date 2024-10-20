import { IdDescription } from "src/app/interfaces/id-description";


export class LoanApplicationInputHelp{
    LastApplicationNo:number=0;
    ApplicationDate:string;
    HOLoan:string;
    HOLoanBooth: string;
    AccountTypeList: IdDescription[];
    LoanPurposeList: IdDescription[];
    LoanCategoryList:IdDescription[];
    LoanCalculationMethodList:IdDescription[];
}

export interface MemberNameModel{
    Success:boolean;
    MemberNo:number;
    FullName:string;
    LoanSuretyMemType:number;
}

export class LoanApplicationCreateModel{
    ID:number=0;
    MemApplicationNo?:number;
    ApplicationDate:string;
    LoanAccountType?:number;
    LoanAccountTypeCode?:number;
    LoanAccCorrType?:number; //for hidden field on Acc Type change event
    CorrAccountNo:string;
    CorrAccountTitle:string;
    IsAutoTrfCorrAccount:boolean=false;
    LoanMemberNo?:number;
    LoanMemberName:string;
    LoanApplicationAmount?:number;
    LoanInterestRate?:number;
    LoanCategoryCode?:number;
    LoanCategory?:number;
    LoanExpDate?:Date;
    LoanPurpose?:number;
    LoanInterestCalMethodCode?:number;
    LoanInterestCalMethod?:number;
    LoanSuretyMemNo?:number;
    AccPeriod?:number;
    StepsOfLoan?:number;
    LoanPerformance?:string;
    TotalDepAmount?:number;

    LoanNoInstallment?:number;
    LoanInstallmentAmount?:number;
    LoanLastInstallmentAmount?:number;
    LoanFirstInstallmentdate?:Date;
    LoanGracePeriod?:number;

    //below properties for internal calculation purpose
    AccountClassId?:number;
    MemType?:number;
    GraceFlag?:number;
    DepositMode?:number;
    AccAtyClass?:number;

    DataShareList?: [];
    DataPropertyList?: [];
    DataDepositList?: [];

    LoanSuretyMemName?: string;
    LoanPurposeCode?: number;

    TotalDepositGuarantorAmount?:number;
    TotalShareGuarantorAmount?:number;
    TotalPropertyGuarantorAmount?:number;

    TotalGaurantyAmount?:number;
    AccTypeMode?:number;
    LoanSecondInstallmentdate: string;
    LoanSuretyMemType?: number;
    LoanModule?: number;
}

export class LoanMemberViewModel{
    AccCorrType: number;
    Success:boolean;
    Message:string;
    MemType?:number;
    MemberNo:string;
    MemberName:string;
    MemberAge?:number;
    MinAgeLoanOpen:string;
    MaxAgeLoanOpen:string;
    AccFlag:string;
    AccessT1:string;
    AccessT2:string;
    AccessT3:string;
    ShowCorrAccNo:boolean;
    CorrAccountNo:string;
    CorrAccountTitle:string;
    StepNoLoan?:number;
    IsLoanDefaulter:boolean;
    PrevLoanRecord:string;
    TotalDeposit?:number;
    ShareGuarantorData: ShareGuarantorDetailsModel;
}



export class LoanAccountTypeViewModel{
    Success:boolean;
    Message:string;
    ShowPeriod?:boolean;
    ShowInstallment?:boolean;
    ShowCorrAccNo?:boolean;
    ShowLoanGraceMonth?:boolean;

    AccTypeCode:number;
    AccTypeClass:number;
    AccDepositMode?:number;
    AccDepositModeDesc:string;
    AccTypeGuaranty?:number;
    AccTypeMode?:number;
    AccCorrType?:number;
    InterestRate?:number;
    LoanCalculationMethod?:number;
    ShareGuaranteeMonth?:number;
    ShareGuaranteeNo?:number;
    MinAgeLoanOpen?:number;
    MaxAgeLoanOpen?:number;
    MinAgeLoanGuarantee?:number;
    MaxAgeLoanGuarantee?:number;
    GraceFlag?:number;
    GraceMonth?:number;
    Period?:number;
    PrmLoanGuarantyAmtPerc?:number;
    LoanAppDate:string;
    LoanExpDate:string;
}

export class LoanAmountViewModel{
    Success:boolean;
    Message:string;
    LoanApplicationAmount?:number;
    LoanInterestRate?:number;
    LoanNoInstallment?:number;
    LoanExpDate:string;
    LoanFirstInstallmentdate:string;
    LoanInstallmentAmount?:number;
    LoanLastInstallmentAmount?:number;
    LoanSecondInstallmentDate:string;
}

export class ShareGuarantorDetailsModel{
    Success:boolean;
    Message:string;
    MemberNo:number;
    MemberName:string;
    MemberType:number;
    NoOfGuarantor:number;
    AccountType:number;
    AccountNo:number;
    ShareAmount:number;
    BranchNo:number;
    AccStatus:string;
    MemberOpenMth:string;
    MemberAge:number;
}

export class PropertyGuarantorDetailsModel{
    SerialNo: number;
    NameOfProperty: string;
    FileNo: number;
    Description: string;
    Amount: number;
}

export class DepositDisplayModel{
    AccType: number;
    TrnCodeDesc: string;
    AccNo: string;
    AccOldNumber: string;
    AccBalance: number;
    AccStatusDesc: string;
}

export class DepositGuarantorDetailsModel{
    Success: boolean;
    Message: string;
    MemberNo: number;
    BranchNo: number;
    MemType: number;
    MemberName: string;
}

export class DepositGuarantorDisplayModel{
    MemberNo: number;
    AccountType: number;
    AccountNumber: number;
    LienAmount: number;
    TotalLienAmount: number;
    LedgerBalance: number;
    MemberName: string;
    AccountTypeDescription: string;
}

export class ReturnScheduleHelpDataModel{
    LoanApplicationAmount?:number;
    LoanNoInstallment?:number;
    LoanInterestRate?:number;
    LoanInstallmentAmount?:number;
    LoanLastInstallmentAmount?:number;
    DepositMode?:number;
    WeeklyDay?:number;
    LoanGracePeriod?:number;
    LoanFirstInstallmentDate:string;
    LoanSecondInstallmentDate: string;
    LoanMemberNo: number;
    LoanMemberName: string;
    LoanAccountTypeTitle: string;
    LoanApplicationDate: string;
    LoanCalMethod: number;
}

export class ReturnScheduleViewModel{
    SchduleLoan: number;
    NoInstl: number;
    IntRate: number;
    PaymentMode: number;
    PaymentModeDesc: string;
    WeekDays: number;
    instlAmt: number;
    LastInstlAmt: number;
    TotalIntAmount: number;
    NetPayable: number;
    LoanMth: number;
    LoanMthDate: string;
    InstlAmt: number;
    LoanAmt: number;
    IntAmt: number;
    LoanPayable: number;
}
