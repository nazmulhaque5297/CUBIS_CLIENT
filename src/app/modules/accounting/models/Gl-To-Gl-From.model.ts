import { MemberBasicInfo } from "src/app/Models/Common.model";

export class GlToGlFromModel{
    GlFromAmount?:number = null;
    ShowLimitBalance?:boolean
    Member?: MemberBasicInfo
    AccAtyClass?:number
    TrnCode?:number
    AccTypeId?:number
    AccountNo?:number
    Balance?:number
    LienAmount?:number
    LimitAmount?:number
    LoanAmount?:number
    AccHoldBalanceDr?:number
    AccHoldBalanceCr?:number



}


export class GlToGlToTransModel{
    GlToAmount?:number = null;

}
export class GlTranferDataModel{
    GlFromAmount?:number = null;
    GlToAmount?:number = null;
    GlTransAmount?:number = null;
    FromGlAccNo?:number=null;
    ToGlAccNo?:number=null;
    Success:string="";


    FromMemberNo:number=null;
    ToMemberNo:number=null;
    FromAccNo:number=null;
    ToAccNo:number=null;
    FromAccType:number=null;
    ToAccType:number=null;
    FromMisc:number=null;
    ToMisc:number=null;
    TransactionDate:string="";
    VoucherNo:string ="";
    ToGlCodeNotMisc:number=null;
    
   

}
