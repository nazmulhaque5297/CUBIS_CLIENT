
export class InterestParamModel{
    AccType?:string
    CalculationPeriod?:string
    PrmCalPeriod?:string
    PrmCalMethod?:string
    PrmCalStartDay?:string
    PrmCalEndDay?:string
    PrmGiveInt25Cons?:string
    PrmCheckNotice?:string
    PrmNoticeAmt?:string
    PrmSpeIntFlag?:string
    PrmSpeIntRate1?:string
    PrmSpeIntRate2?:string
    PrmGiveIntOver25?:string
    PrmMinBalForInt?:string
    PrmMaxBalForInt?:string
    PrmMinIntAmt?:string
    PrmMaxIntAmt?:string
    IntRateJul?:number
    IntRateAug?:number
    IntRateSep?:number
    IntRateOct?:number
    IntRateNov?:number
    IntRateDec?:number
    IntRateJan?:number
    IntRateFeb?:number
    IntRateMar?:number
    IntRateApr?:number
    IntRateMay?:number
    IntRateJun?:number
    IntPostFlag?:string
    PrmRoundFlag ?:string
    TargetAccType?:string
    PrmInterestType ?:string
    PrmCalculateFY ?:string
    PrmShareValueFlag ?:string
    PrmShareValue ?:string
    PrmIntRate?:string
    TotalNoOfBranch ?:string
    GlDebitCode ?:string
    GlCreditCode ?:string
    GlDebitCodeDesc?:string
    GlCreditCodeDesc ?:string
    PrmAccProcFees ?:number
    PrmAccProcFeesFlag ?:string
    SCGlDebitCode ?:string
    SCGlCreditCode ?:string
    SCGlDebitCodeDesc ?:string
    SCGlCreditCodeDesc ?:string
    TargetAccTypeDesc ?:string
    ShareProtDeductAccType ?:string
    ShareProtMinBalance ?:string
    ShareProtMaxBalance ?:string
    ShareProtIntRate ?:string
    ShareProtFixedAmt ?:string
    SPGlDebitCode ?:string
    SPGlCreditCode ?:string
    SPGlDebitCodeDesc ?:string
    SPGlCreditCodeDesc ?:string
    ShareProtDeductAccTypeDesc ?:string
    ShareProtGLCode ?:string
    ShareProtGLDesc ?:string
}

export class CalculationStatusModel{
    BranchNo?:number
    CalStatus?:string
    CalculationDate?:string
    IntPostFlag?:string
}

export class ProcessPostModel{
    BranchId?:number
    BranchCode?:number
    AccountTypeCode?:number
    AccountTypeId?:number
    VoucherNo?:string
    DividendTypeId?:string
    InterestParam?: InterestParamModel
}

export interface ProcessResponse{
    Success?:boolean
    Message?:string
    Data?:CalculationStatusModel []
}

export interface RebateResponse{
    StatusData?:CalculationStatusModel[]
    TargetAccData?:DebateTargetAccount[]
    Data?: RebateParameter
}

export class DebateTargetAccount{
    BranchNo?:number
    MemType?:string
    MemNo?:string
    AccNo?:string
}
export class RebateParameter{
    AccType?:string
    CalculationFor?:number
    InterestRate?:string
    RescheduleFlag?:string
    TAYesNo?:string
    TAPrincipalPercent?:string
    TANoOfTimes?:string
    RebateFullMonthFlag?:string
    RebateFullMonthFlagTimes?:string
    MultipleDepositFlag?:string
    TargetAccType?:string
    TwoLoanFlag?:string
    RebateExpireDateFlag?:string
    PostFlag?:string
    RebateGlDrCode?:string
    RebateCalType?:string
    UptoMthCal?:string
    RestMthCalType?:string
    RebateGlCrCode?:string
    RebateGlCrDesc?:string
    RebateGlDrDesc?:string
    CalculationPeriod?:string
}

export class RebateProcessPostModel{
    BranchId?:number
    BranchCode?:number
    AccountTypeCode?:number
    AccountTypeId?:number
    VoucherNo?:string
    InterestParam?: RebateParameter
}

export class DebateVerifyAccounts{
    VerifyFlag?:boolean
    MemNo?:string
    MemName?:string
    AccNo?:string
    AccDisbDate?:string
    AccBalance?:number
    PaidPrincipalAmt?:number
    AccProduct?:number
    RebateIntRate?:number
    AccInterest?:number
    TargetAccNo?:string
}

export interface ServiceChargeResponse{
    StatusData?:CalculationStatusModel[]
    Data?: RebateParameter
}
