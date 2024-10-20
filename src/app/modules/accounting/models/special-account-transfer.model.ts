import { IdDescription } from "src/app/interfaces/id-description"

export class MemInfoAccountList{
    Success?:boolean
    Message?: string
    MemberName?:string
    MemNo?:number
    MemType?:number
    AccountTypeList: IdDescription
}

export class AccountTransferViewModel{
    Success?:boolean
    Message?: string
    MemberName?:string
    TrnMemberName?:string
    MemNo?:number
    TrnMemNo?:number
    MemType?:number
    TrnMemType?:number
    AccountTypeList: IdDescription
    AccType: number
    AccNo: number
    AccBalance: string
    AccList: string[]
    VPrintFlag:string
    VPrintFOptFlag:string
}