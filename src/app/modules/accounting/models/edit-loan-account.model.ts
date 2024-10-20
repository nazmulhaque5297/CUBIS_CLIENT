export class EditLoanAccLoadModel{
    OpenDate: string;
    ProcDate: string;
}

export class AccTypeDataDropDown{
    AccType: number;
    AccTypeDescription: string;
}

export class MemberNoDataModel{
    CtrlBranchNo: number;
    MemName: string;
    MemType: number;
}

export class AccNoDataModel{
    AtyClass: number;
    PrmCorrType: number;
    AccDepRoundingBy: number;
    CalculationPeriod: number;
    FirstInstlDtVisible: boolean = false;
    SecondInstlDtVisible: boolean = false;
    DisbDateVisible: boolean = false;
    DisbAmtVisible: boolean = false;
    NoInstlVisible: boolean = false;
    InstlAmountVisible: boolean = false;
    LastInstlAmtVisible: boolean = false;
    DuePrincVisible: boolean = false;
    DueIntVisible: boolean = false;
    ODIntDateVisible: boolean = false;
    ODIDueIntAmtVisible: boolean = false;
    PeriodVisible: boolean = false;
    DepositMode: number;
    WeeklyDay: number;
}

export class AccTypeDataModel{
    AccCorrType: number;
    AutoTrf: number;
    Balance: number;
    CalculationPeriod: number;
    Cls: number;
    CorrAccNo: number;
    CorrAccNoVisible: boolean = false;
    CorrAccTitle: string;
    CtrlAccStatus: number;
    CtrlBranchNo: number;
    CtrlMsgFlag: number;
    DepositMode: number;
    DisbAmount: number;
    DisbDate: string;
    DueInt: number;
    DuePrinc: number;
    EffectDate: string;
    FirstInstlDt: string;
    FirstInstlDtText: string;
    FirstInstlDtVisible: boolean = false;
    GraceFlag: number;
    ID: number;
    InstlAmount: number;
    IntRate: number;
    LastInstlAmount: number;
    LastTrnDate: string;
    LoanAppNo: number;
    LoanCalMethod: number;
    LoanExpiryDate: string;
    LoanFirstInstlDt: string;
    LoanGrace: number;
    LoanGraceVisible: boolean = false;
    LoanSecondInstlDt: string;
    MemName: string;
    MemType: number;
    NextEffectDate: string;
    NoInstl: number;
    ODIDueIntAmt: number;
    ODIntDate: string;
    OldAccNo: number;
    OpenDate: string;
    PaidIntAmt: number;
    PaidPrincAmt: number;
    Period: number;
    PrmCorrType: number;
    RebatePaid: number;
    SMSService: number;
    SancAmount: number;
    SancDate: string;
    SecondInstlDt: string;
    SecondInstlDtText: string;
    SecondInstlDtVisible: boolean = false;
    Stat: string;
    SuretyMemName: string;
    SuretyMemNo: number;
    SuretyMemType: number;
    WeeklyDay: number;
    WeeklyDayVisible: boolean = false;
}

export class EditLoanAccShareMemDetails{
    AccAmount: number;
    AccNo: number;
    AccType: number;
    Id: number;
    MemNo: number;
}


export class EditLoanAccFullUpdateModel{
    MemberNo?: number;
    AccountType?: number;
    WeeklyDay?: number;
    AccountNo?: number;
    Status: string;
    OpenDate: string;
    LedgerBalance?: number;
    SanctionDate: string;
    LoanGraceMonth?: number;
    DisbursementDate: string;
    SanctionAmount?:number;
    LoanExpiryDate:string;
    DisburesementAmount?:number;
    LastTransactionDate:string
    NoOfInstallment?: number;
    InterestRate?: number;
    InstallmentAmount?: number;
    LoanCalMethod?: number;
    LastInstallmentAmount?: number;
    FirstInstallmentDate: string;
    SecondInstallmentDate: string;
    CurrentEffectingDate: string;
    NextEffectingDate: string;
    ODIntPostDate: string;
    DueODInterestAmt?: number;
    ODPeriod?: number;
    LoanSuretyMemberNo?: number;
    LoanSuretyMemberType?: number;
    CurrPrincipalDue?: number;
    CurrInterestDue?: number;
    CorrAccountNo?: number;
    AutoTrfCorrAC?: number;
    OldAccountNo?: number;
    SMSService?: number;
    RebatePaid?: number;
    MemberType?: number;
    LoanFirstInstlDt: string;
    LoanSecondInstlDt: string;
    AccCorrType?: number;
    ProcDate: string;
    EffectDate: string;
    PaidPrincAmt?: number;
    PaidIntAmt?: number;
    ID?: number;
    LoanAppNo?: number;
    AtyClass?: number;
}