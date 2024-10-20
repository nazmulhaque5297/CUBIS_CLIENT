
export interface ITransactionControl{
    AccTypeClass?:number
    FuncOpt?:number
    FuncOptDesc?:string
    TrnRecDesc?:string
    PayType?:number
    TrnType?:number
    TrnMode?:number
    ShowInt?:number
    TrnLogic?:number
    RecMode?:number
    TrnPayment?:number
    GLAccNoDR?:number
    GLAccDRFlag?:number
    GLAccNoCR?:number
    GLAccCRFlag?:number
}

export interface ITransactionControlItem{
    AccTypeClass?:number
    FuncOpt?:number
    FuncOptDesc?:string
    TrnRecDesc?:string
    PayType?:number
    GLAccNoDR?:number
    GLAccDRFlag?:number
    GLAccNoCR?:number
    GLAccCRFlag?:number
}