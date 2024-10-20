import { IdDescription } from "src/app/interfaces/id-description";



export class LoanSettlementDataModel{
    Success:false
    Message:string
    MemberNo?:number
    MemType?:number
    MemRegNo?:number
    MemSubRegNo?:number
    MemColCode?:number
    PreMobile:string
    MemberName:string
    GLCashCode:string
    TotalAmount?:number
    FuncOpt:string
    AccountTypeId?:number
    VoucherNo?:number
    AccProductGLCode?:number
    AccTypeClass?:number
    AccountNo?:string
    CorrAccountNo?:string
    DepositTransactions: ILoanSettlementTransactionModel[]
    AccountDetails?:ILoanSettlementAccountDetails
}

export interface LoanSettlementCreateModel{
    AccountTypeCode?:string
    AccountTypeId?:number
    AccountNo?:string
    MemberNo?:string
    VoucherNo?:string
    TotalAmount?:number
    MemType?:number
    AccProductGLCode?:number
    AccTypeClass?:number
    TransactionTypeCode?:number
    BankChequeNo?:string
    BankCode?:number
    MemRegNo?:number
    MemSubRegNo?:number
    MemColCode?:number
    DepositedAccountList: ILoanSettlementTransactionModel[],
    AccountDetails?:ILoanSettlementAccountDetails
}


export class LoanSettlementInputHelp{
    AccountTypeList: IdDescription[];
    TransactionTypeList: IdDescription[];
    DepositTransactions: ILoanSettlementTransactionModel[];
    public PrintFlag:number;
    public PrintFOptFlag:number;
}

export interface ILoanSettlementTransactionModel{
    Id:number
    GLAccNo?:number
    GLAccDesc?:string
    TrnAmount?:number
    AccType?:number
    AccNo?:number
    AccBalance?:number
    MarkRecord?:number
    PayTypeCode?:number
    PayTypeDes?:string
    LoanPrincFlag?:number
    AccOldNumber?:string
    AccPrevNumber?:string
    Selected?:boolean
}


export interface LoanSettlementTransTypeResponseModel{
    Success?:boolean
    Message?:string
    DepositTransactions?:ILoanSettlementTransactionModel[]
}
export interface LoanSettlementAccountViewModel{
    Success?:boolean
    Message?:string
    AccTypeCode?:number
    AccProductGLCode?:number
    AccTypeClass?:number
    HasMultipleAccount?:boolean
    AccountDetails?:ILoanSettlementAccountDetails
    GroupAccounts?:ILoanSettlementTransactionModel[]
}

export interface LoanSettlementAccountViewModel{
    Success?:boolean
    Message?:string
    AccTypeCode?:number
    AccProductGLCode?:number
    AccTypeClass?:number
    AccountDetails?:ILoanSettlementAccountDetails
}

export interface ILoanSettlementAccountDetails{
    Success?:boolean
    Message?:string

    MemberNo?:number
    MemType?:number;
    BranchNo?:number
    MemRegNo?:number
    MemSubRegNo?:number
    PreMobile?:string
    MemberName?:string
    AccountNo?:string

    CtrlAccType?:number
    AccStatus?:string
    AccAtyClass?:string
    OldAccountNo?:string
    LadgerBalance?:string
    OpenDate?:string
    Period?:string
    MatruityDate?:string
    CertNo?:string
    NoInstl?:string
    InstlAmt?:string
    IntRate?:string
    DisbAmt?:string
    SancAmount?:string
    LastTrnDate?:string
    AccLoanExpiryDate?:string
    RoundFlag?:number

    CalInterestAmt?:string
    DuePrincipalAmt?:string
    DueInterestAmt?:string
    NoOfDefaulterPeriod?:string
    
    CorrAccountNo?:string
    CorrAccountBalance?:string
    CorrAccountHoldBalanceDr?:string
    CorrAccountHoldBalanceCr?:string
    CorrAccountLienAmount?:string
    CalculationPeriod?:number

}

