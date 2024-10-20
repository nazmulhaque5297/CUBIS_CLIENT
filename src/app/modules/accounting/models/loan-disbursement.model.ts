import { IdDescription } from "src/app/interfaces/id-description";


export class LoanDisbursementInputHelp{
    AccountTypeList: IdDescription[];
    TransactionTypeList: IdDescription[];
    BankList:IdDescription[];
    Transactions: IDisbursementTransactionModel[];
    PrintFOptFlag:number;
    PrintFlag:number;
}

export interface ILoanDisbursementApplication{
    Success?:false
    Message?:string
    MemberDetails?:LoanDisbursementDataModel
    AccountInfo?:DisbursementAccountViewModel
}

export interface DisbursementAccountViewModel{
    Success?:boolean
    Message?:string
    AccTypeCode?:number
    AccProductGLCode?:number
    AccTypeClass?:number
    AccountDetails?:IDisbursementAccountDetails
}


export class LoanDisbursementDataModel{
    Success:false
    Message:string
    MemberNo?:number
    MemType?:number
    MemRegNo?:number
    MemSubRegNo?:number
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
    MemColCode: string;
    Transactions?: IDisbursementTransactionModel[]
}

export interface LoanDisbursementCreateModel{
    AutoVchflag?:Boolean
    AccountTypeCode?:string
    AccountTypeId?:number
    AccountNo?:string
    ApplicationNo?:string
    ApplicationDate?:string
    MemberNo?:string
    VoucherNo?:string
    TotalAmount?:number
    MemType?:number
    AccProductGLCode?:number
    AccTypeClass?:number
    TransactionTypeCode?:number
    BankChequeNo?:string
    BankCode?:number
    MemRegNo?: number;
    MemColCode: string;
    Transactions: IDisbursementTransactionModel[],
    AccountDetails?:IDisbursementAccountDetails
}


export interface IDisbursementTransactionModel{
    Id?:number
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


export interface TransResponseModel{
    Success?:boolean
    Message?:string
    Transactions?:IDisbursementTransactionModel[]
}

export interface IDisbursementAccountDetails{
    Success?:boolean;
    Message?:string;

    MemberNo?:number;
    MemType?:number;
    BranchNo?:number;
    MemRegNo?:number;
    MemSubRegNo?:number;
    PreMobile?:string;
    MemberName?:string;
    AccountNo?:string;

    CtrlAccType?:number;
    AccStatus?:string;
    AccAtyClass?:string;
    OldAccountNo?:string;
    LadgerBalance?:string;
    OpenDate?:string;
    Period?:string;
    MatruityDate?:string;
    CertNo?:string;


    AccOrgAmt?:string

    AccRenwlDate?:string

    SancAmount?:string
    SancDate?:string
    DisbursementAmount?:string
    DisbursementDate?:string
    AccLoanExpiryDate?:string
    IntRate?:string
    NoInstl?:string
    InstlAmt?:string
    AccLoanAppNo?:string
    AccLoanAppDate?:string

    CorrAccountNo?:string
    CorrAccountBalance?:string
    CorrAccountHoldBalanceDr?:string
    CorrAccountHoldBalanceCr?:string
    CorrAccountLienAmount?:string

}

