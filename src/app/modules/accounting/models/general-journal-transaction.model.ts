import { IdDescription } from "src/app/interfaces/id-description";

export interface GLCodeDropDownModel{
    GLAccNo: number;
    GLAccDesc: string;
    GlAccDescAll:string;
}

export class GvDepositTrnInfoModel{
    GLAccDesc: string;
    GLAccNo: number;
    GLAccType: number;
    GLCreditAmt: number;
    GLDebitAmt: number;
    Id: number;
    MarkRecord: number;
    TrnDesc: string; 
}

export interface CashDataModel{
    CashCode: number;
    CashCodeDesc: string;
    CtrlProcDate: string;
    CtrlPrmGLAutoVchCtrl: number;
    CtrlPrmAutoVchFlag: number;
    VPrintFlag: number;
    VPrintFOptFlag: number;
}

export class TransactionGridViewInfoModel{
    GLAccDesc: string;
    GLAccNo: number;
    GLCreditAmt: number;
    GLDebitAmt: number;
    Id: number;
    TrnDesc: string;
    TrnTypeDes: string;
    VchNo: string;
}